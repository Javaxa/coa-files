<?php
header('Content-Type: application/json');

// Specify the path to your CSV file
$csvFilePath = 'data.csv';

// Get the JSON payload from the request body
$jsonPayload = file_get_contents('php://input');
$data = json_decode($jsonPayload, true);

if (isset($data['csvContent'])) {
    // Attempt to write the CSV content to the file
    $result = file_put_contents($csvFilePath, $data['csvContent']);
    
    if ($result !== false) {
        // Success: File was written
        echo json_encode(['success' => true]);
    } else {
        // Failure: Couldn't write to file
        echo json_encode([
            'success' => false, 
            'error' => 'Failed to write to CSV file. Check file permissions.'
        ]);
    }
} else {
    // Failure: No CSV content provided
    echo json_encode([
        'success' => false, 
        'error' => 'No CSV content provided in the request.'
    ]);
}
?>