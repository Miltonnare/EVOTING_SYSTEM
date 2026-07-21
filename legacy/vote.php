<?php
session_start(); // Start session at the top!

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'error_log.txt');

include "Database.php";
header("Content-Type: application/json");

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Session expired. Please log in again."]);
    exit();
}

$user_id = $_SESSION['user_id'];

if (empty($user_id)) {
    echo json_encode(["success" => false, "message" => "User ID is empty. Please log in again."]);
    exit();
}

// Read and decode JSON input
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { 
    echo json_encode(["success" => false, "message" => "Invalid JSON input.", "debug" => file_get_contents('php://input')]);
    exit();
}

$categories = ["president", "governor", "senator"];
$votes = [];

foreach ($categories as $category) {
    if (!isset($data['votes'][$category])) {
        echo json_encode(["success" => false, "message" => "You must select a candidate for $category."]);
        exit();
    }
    $votes[$category] = (int) $data['votes'][$category]; 
}

// Check if user already voted
$placeholders = implode(",", array_fill(0, count($categories), "?"));
$sql = "SELECT category FROM votes WHERE id = ? AND category IN ($placeholders)";
$checkVote = $conn->prepare($sql);
$checkVote->bind_param(str_repeat("s", count($categories) + 1), $user_id, ...$categories);
$checkVote->execute();
$result = $checkVote->get_result();

$votedCategories = [];
while ($row = $result->fetch_assoc()) {
    $votedCategories[] = $row['category'];
}

foreach ($categories as $category) {
    if (in_array($category, $votedCategories)) {
        echo json_encode(["success" => false, "message" => "You have already voted for $category."]);
        exit();
    }
}

// ✅ Validate candidate ID before inserting
$checkCandidate = $conn->prepare("SELECT candidate_id FROM candidates WHERE candidate_id = ?");
foreach ($votes as $category => $candidate_id) {
    $checkCandidate->bind_param("i", $candidate_id);
    $checkCandidate->execute();
    $checkCandidate->store_result();

    if ($checkCandidate->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid candidate selected for $category."]);
        exit();
    }
}

// Insert votes
$stmt = $conn->prepare("INSERT INTO votes (id, category, candidate_id) VALUES (?, ?, ?)");

foreach ($votes as $category => $candidate_id) {
    $stmt->bind_param("ssi", $user_id, $category, $candidate_id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error submitting vote for $category."]);
        exit();
    }
}

echo json_encode(["success" => true, "message" => "All votes submitted successfully."]);
$conn->close();
?>
