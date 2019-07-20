<?php
$servername = "remotemysql.com";
$username = "57m84zai3h";
$password = "03tSrYFz3j";
$database = "57m84zai3h";

// Create connection
$conn = new mysqli($servername, $username, $password,$database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
?>