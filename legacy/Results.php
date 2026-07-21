<?php
header("Content-Type: application/json");
require_once "Database.php"; // Ensure correct database connection

$response = ["success" => false, "message" => "No results found", "categories" => []];

// Fetch votes grouped by category and candidate
$sql = "SELECT votes.category, candidates.candidate_id, candidates.name, candidates.party, 
               COUNT(votes.candidate_id) AS vote_count 
        FROM candidates 
        LEFT JOIN votes ON candidates.candidate_id = votes.candidate_id 
        GROUP BY votes.category, candidates.candidate_id 
        ORDER BY votes.category, vote_count DESC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[$row["category"]][] = $row;
    }

    // Calculate percentage per category
    foreach ($categories as $category => &$candidates) {
        $total_votes = array_sum(array_column($candidates, "vote_count"));

        foreach ($candidates as &$candidate) {
            $candidate["percentage"] = ($total_votes > 0) ? round(($candidate["vote_count"] / $total_votes) * 100, 2) : 0;
        }
    }

    $response["success"] = true;
    $response["categories"] = $categories;
} else {
    $response["message"] = "No votes recorded yet.";
}

$conn->close();
echo json_encode($response);
?>
