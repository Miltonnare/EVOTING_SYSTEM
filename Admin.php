<?php
session_start();
include "Database.php"; // Include database connection

header("Content-Type: application/json");

// Fetch all candidates
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["fetchCandidates"])) {
    $sql = "SELECT * FROM candidates";
    $result = $conn->query($sql);
    
    $candidates = [];
    while ($row = $result->fetch_assoc()) {
        $candidates[] = $row;
    }

    echo json_encode(["success" => true, "candidates" => $candidates]);
    exit();
}

// Add a new candidate
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["addCandidate"])) {
    $name = $_POST["name"];
    $party = $_POST["party"];

    $stmt = $conn->prepare("INSERT INTO candidates (name, party) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $party);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Candidate added successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add candidate"]);
    }
    exit();
}

// Delete a candidate
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["deleteCandidate"])) {
    $candidate_id = $_POST["candidate_id"];

    // First, delete associated votes (to prevent foreign key constraint issues)
    $conn->query("DELETE FROM votes WHERE candidate_id = $candidate_id");

    $stmt = $conn->prepare("DELETE FROM candidates WHERE candidate_id = ?");
    $stmt->bind_param("i", $candidate_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Candidate deleted successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete candidate"]);
    }
    exit();
}

// Fetch vote data
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["fetchVotes"])) {
    $sql = "SELECT candidates.name, COUNT(votes.candidate_id) AS vote_count
            FROM candidates
            LEFT JOIN votes ON candidates.candidate_id = votes.candidate_id
            GROUP BY candidates.candidate_id
            ORDER BY vote_count DESC";

    $result = $conn->query($sql);
    
    $voteData = [];
    while ($row = $result->fetch_assoc()) {
        $voteData[] = $row;
    }

    echo json_encode(["success" => true, "voteData" => $voteData]);
    exit();
}

// Fetch election status
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["fetchElectionStatus"])) {
    $sql = "SELECT status FROM election_settings WHERE id = 1";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    echo json_encode(["success" => true, "status" => $row["status"]]);
    exit();
}

// Update election status
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["updateElectionStatus"])) {
    $status = $_POST["status"];

    $stmt = $conn->prepare("UPDATE election_settings SET status = ? WHERE id = 1");
    $stmt->bind_param("s", $status);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Election status updated!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update status"]);
    }
    exit();
}

echo json_encode(["success" => false, "message" => "Invalid request"]);
?>
