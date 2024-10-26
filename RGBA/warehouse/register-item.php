<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/supply_photos/';
$csvFile = 'warehouse_supply_data.csv';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newItem = $_POST;
    $newItem['ID'] = $_POST['ID'];

    // Handle file upload
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $tempName = $_FILES['photo']['tmp_name'];
        $fileName = uniqid() . '_' . basename($_FILES['photo']['name']);
        $targetFilePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($tempName, $targetFilePath)) {
            $newItem['Photo'] = '/supply_photos/' . $fileName;
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file.']);
            exit;
        }
    } else {
        $newItem['Photo'] = '';
    }

    // Define the correct order of columns and map to form fields
    $columnMap = [
        'Name' => 'Name',
        'Category' => 'Category',
        'Stock' => 'Stock',
        'Storage_Information' => 'Storage_Information',
        'Purchase_Location' => 'Purchase Location',
        'Purchase_Date' => 'Purchase Date',
        'Receipt' => 'Receipt',
        'ID' => 'ID',
        'Photo' => 'Photo',
        'NotifyThreshold' => 'NotifyThreshold'
    ];

    // Read existing CSV data
    $csvData = array_map('str_getcsv', file($csvFile));
    $existingHeaders = array_shift($csvData);

    // Merge existing headers with new header if not already present
    if (!in_array('NotifyThreshold', $existingHeaders)) {
        $updatedHeaders = array_merge($existingHeaders, ['NotifyThreshold']);
    } else {
        $updatedHeaders = $existingHeaders;
    }

    // Prepare new row in the correct order
    $newRow = [];
    foreach ($updatedHeaders as $header) {
        if (isset($columnMap[$header]) && isset($newItem[$columnMap[$header]])) {
            $newRow[] = $newItem[$columnMap[$header]];
        } else {
            $newRow[] = '';
        }
    }

    // Add new item to CSV data
    $csvData[] = $newRow;

    // Write updated CSV data
    $fp = fopen($csvFile, 'w');
    fputcsv($fp, $updatedHeaders); // Write updated headers
    foreach ($csvData as $row) {
        // Ensure each row has the correct number of columns
        $paddedRow = array_pad($row, count($updatedHeaders), '');
        fputcsv($fp, $paddedRow);
    }
    fclose($fp);

    echo json_encode(['success' => true, 'item' => $newItem]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>