<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userId = isset($_POST['id']) ? $_POST['id'] : '';

    if ($userId != '') {
        $filePath = __DIR__ . '/RGBA/warehouse/json/user_data.json';
        $jsonData = file_get_contents($filePath);
        $dataArray = json_decode($jsonData, true);
        if ($dataArray === null) {
            echo "Error reading JSON data.";
            http_response_code(500);
            exit();
        }
        foreach ($dataArray as $key => $value) {
            if ($value['id'] == $userId) {
                unset($dataArray[$key]);
                break;
            }
        }

        $result = file_put_contents($filePath, json_encode(array_values($dataArray), JSON_PRETTY_PRINT));
        if ($result === false) {
            echo "Error writing updated data to file.";
            http_response_code(500);
        } else {
            http_response_code(200);
        }
    } else {
        echo "User ID not provided.";
        http_response_code(400);
    }
} else {
    echo "Invalid request method.";
    http_response_code(405);
}
?>
