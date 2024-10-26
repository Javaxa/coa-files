<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $filePath = __DIR__ . '/RGBA/warehouse/json/user_data.json';
    
    if (!file_exists($filePath)) {
        http_response_code(500);
        echo "Error: JSON file does not exist";
        error_log("Error: JSON file does not exist at " . $filePath);
        exit;
    }

    $jsonData = file_get_contents($filePath);
    if ($jsonData === false) {
        http_response_code(500);
        echo "Error: Unable to read JSON file";
        error_log("Error: Unable to read JSON file at " . $filePath);
        exit;
    }

    $dataArray = json_decode($jsonData, true);

    if (!is_array($dataArray)) {
        $dataArray = [];
    }

    $maxId = empty($dataArray) ? 0 : max(array_column($dataArray, 'id'));
    $newId = $maxId + 1;

    $userData = [
        "department" => $_POST['department'] ?? "Unassigned",
        "priority" => $_POST['priority'] ?? "1",
        "firstname" => $_POST['firstname'] ?? "",
        "lastname" => $_POST['lastname'] ?? "",
        "phone" => $_POST['phone'] ?? "",
        "email" => $_POST['email'] ?? "",
        "address" => $_POST['address'] ?? "",
        "birthday" => $_POST['birthday'] ?? "",
        "gender" => $_POST['gender'] ?? "Unspecified",
        "password" => $_POST['password'] ?? "",
        "id" => strval($newId),
        "profilePicture" => ""
    ];

    // Handle file upload
    if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] == 0) {
        $uploadDir = __DIR__ . '/../userphotos/';
        $fileName = 'photo_' . $newId . '.' . pathinfo($_FILES['profilePicture']['name'], PATHINFO_EXTENSION);
        $uploadFile = $uploadDir . $fileName;
    
        if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $uploadFile)) {
            $userData['profilePicture'] = 'userphotos/' . $fileName;
        } else {
            http_response_code(500);
            echo "Failed to upload file";
            error_log("Failed to upload file to " . $uploadFile);
            exit;
        }
    }
    
    array_push($dataArray, $userData);
    
    $result = file_put_contents($filePath, json_encode($dataArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    if ($result === false) {
        http_response_code(500);
        echo "Error writing to file";
        error_log("Error writing to file: " . $filePath);
    } else {
        http_response_code(200);
        echo "Data saved successfully";
        error_log("Data saved successfully to " . $filePath);
    }    
} else {
    http_response_code(405);
    echo "Method Not Allowed";
    error_log("Method Not Allowed: " . $_SERVER['REQUEST_METHOD']);
}
?>