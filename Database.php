
<?php
$host="localhost";
$username="root";
$password="";
$dbname="e_voting_database";

$conn=new mysqli($host,$username,$password,$dbname);

if($conn->connect_error){
die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}