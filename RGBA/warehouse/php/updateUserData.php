<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $filePath = __DIR__ . '/../json/user_data.json';
    
    if (!file_exists($filePath)) {
        http_response_code(500);
        echo "Error: JSON file does not exist";
        exit;
    }

    $jsonData = file_get_contents($filePath);
    $dataArray = json_decode($jsonData, true);

    if (!is_array($dataArray)) {
        http_response_code(500);
        echo "Error: Invalid JSON data";
        exit;
    }

    $userId = $_POST['id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo "Error: User ID is required";
        exit;
    }

    $userIndex = array_search($userId, array_column($dataArray, 'id'));
    if ($userIndex === false) {
        http_response_code(404);
        echo "Error: User not found";
        exit;
    }

    // Update user data
    $dataArray[$userIndex]['department'] = $_POST['department'] ?? $dataArray[$userIndex]['department'];
    $dataArray[$userIndex]['priority'] = $_POST['priority'] ?? $dataArray[$userIndex]['priority'];
    $dataArray[$userIndex]['firstname'] = $_POST['firstname'] ?? $dataArray[$userIndex]['firstname'];
    $dataArray[$userIndex]['lastname'] = $_POST['lastname'] ?? $dataArray[$userIndex]['lastname'];
    $dataArray[$userIndex]['phone'] = $_POST['phone'] ?? $dataArray[$userIndex]['phone'];
    $dataArray[$userIndex]['email'] = $_POST['email'] ?? $dataArray[$userIndex]['email'];
    $dataArray[$userIndex]['address'] = $_POST['address'] ?? $dataArray[$userIndex]['address'];
    $dataArray[$userIndex]['birthday'] = $_POST['birthday'] ?? $dataArray[$userIndex]['birthday'];
    $dataArray[$userIndex]['gender'] = $_POST['gender'] ?? $dataArray[$userIndex]['gender'];
    
    // Update password only if a new one is provided
    if (!empty($_POST['password'])) {
        $dataArray[$userIndex]['password'] = $_POST['password'];
    }

    // Handle file upload
    if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] == 0) {
        $uploadDir = __DIR__ . '/../userphotos/';
        $fileName = 'photo_' . $userId . '.' . pathinfo($_FILES['profilePicture']['name'], PATHINFO_EXTENSION);
        $uploadFile = $uploadDir . $fileName;
    
        if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $uploadFile)) {
            $dataArray[$userIndex]['profilePicture'] = 'userphotos/' . $fileName;
        } else {
            http_response_code(500);
            echo "Failed to upload file";
            exit;
        }
    }
    
    $result = file_put_contents($filePath, json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    if ($result === false) {
        http_response_code(500);
        echo "Error writing to file";
    } else {
        http_response_code(200);
        echo "Data updated successfully";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>