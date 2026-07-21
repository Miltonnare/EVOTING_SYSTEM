<?php
include "Database.php";
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['names']) || !isset($data['email']) || !isset($data['password']) || !isset($data['phoneNumber'])) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$names = $data['names'];
$email = $data['email'];
$password = $data['password'];
$phoneNumber = $data['phoneNumber'];

$stmt = $conn->prepare("INSERT INTO userLogin (names, email, password, phoneNumber) VALUES (?, ?, ?, ?)");

if ($stmt === false) {
    die(json_encode(["success" => false, "message" => "Statement preparation failed: " . $conn->error]));
}

$stmt->bind_param("ssss", $names, $email, $password, $phoneNumber);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
