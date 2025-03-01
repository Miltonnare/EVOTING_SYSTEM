<?php
ob_start(); // Start output buffering
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set("display_errors", 1);

require "Database.php";

if (!$conn) {
    sendJsonResponse(["success" => false, "error" => "Database connection failed"]);
}

// Utility function to send a clean JSON response
function sendJsonResponse($data) {
    ob_clean(); // Clean output buffer
    echo json_encode($data);
    exit();
}

// Fetch Candidates
if (isset($_GET["fetchCandidates"])) {
    $result = $conn->query("SELECT * FROM candidates");
    sendJsonResponse([
        "success" => (bool) $result,
        "candidates" => $result ? $result->fetch_all(MYSQLI_ASSOC) : [],
        "error" => $result ? null : "Failed to fetch candidates"
    ]);
}

// Add Candidate
if (isset($_POST["addCandidate"])) {
    $name = trim($_POST["name"] ?? '');
    $party = trim($_POST["party"] ?? '');
    $category = trim($_POST["category"] ?? '');

    if (empty($name) || empty($party) || empty($category)) {
        sendJsonResponse(["success" => false, "error" => "All fields are required"]);
    }

    $imagePath = "default.png";

    if (!empty($_FILES["image"]["name"])) {
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $fileType = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
        $allowedTypes = ["jpg", "jpeg", "png", "gif"];

        if (in_array($fileType, $allowedTypes)) {
            $fileName = time() . "_" . basename($_FILES["image"]["name"]);
            $targetFilePath = $targetDir . $fileName;

            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
                $imagePath = $targetFilePath;
            } else {
                sendJsonResponse(["success" => false, "error" => "Failed to upload image"]);
            }
        } else {
            sendJsonResponse(["success" => false, "error" => "Invalid image format"]);
        }
    }

    $stmt = $conn->prepare("INSERT INTO candidates (name, party, category, image_url) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $party, $category, $imagePath);

    if ($stmt->execute()) {
        sendJsonResponse(["success" => true, "message" => "Candidate added successfully!"]);
    } else {
        sendJsonResponse(["success" => false, "error" => "Failed to add candidate"]);
    }
}

// Fetch Dashboard Data
if (isset($_GET["fetchDashboard"])) {
    $totalVotes = $conn->query("SELECT COUNT(*) AS totalVotes FROM votes")->fetch_assoc()['totalVotes'] ?? 0;
    $electionStatus = $conn->query("SELECT status FROM election_status LIMIT 1")->fetch_assoc()['status'] ?? "Loading...";
    $candidateCount = $conn->query("SELECT COUNT(*) AS candidateCount FROM candidates")->fetch_assoc()['candidateCount'] ?? 0;

    sendJsonResponse([
        "success" => true,
        "totalVotes" => (int) $totalVotes,
        "electionStatus" => ucfirst($electionStatus),
        "candidateCount" => (int) $candidateCount
    ]);
}

// Update Election Status
if (isset($_POST["updateElectionStatus"])) {
    $status = trim($_POST["status"] ?? '');

    if (empty($status)) {
        sendJsonResponse(["success" => false, "error" => "Election status is required"]);
    }

    $stmt = $conn->prepare("UPDATE election_status SET status = ? LIMIT 1");
    $stmt->bind_param("s", $status);

    if ($stmt->execute()) {
        sendJsonResponse(["success" => true, "message" => "Election status updated successfully!"]);
    } else {
        sendJsonResponse(["success" => false, "error" => "Failed to update status"]);
    }
}

exit();
?>
