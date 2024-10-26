<?php
header('Content-Type: application/json');
// Define the root path for uploads relative to the website root
$uploadDir = '/RGBA/uploads/';

// Log the upload directory for debugging
error_log("Upload directory: " . $uploadDir);

if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        error_log("Failed to create directory: " . $uploadDir);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create upload directory'
        ]);
        exit;
    }
}

// Log the incoming file details
error_log("Received file upload: " . print_r($_FILES, true));

if (!isset($_FILES['file'])) {
    error_log("No file received in upload");
    echo json_encode([
        'success' => false,
        'message' => 'No file received'
    ]);
    exit;
}

if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $tempName = $_FILES['file']['tmp_name'];
    $originalName = $_FILES['file']['name'];
    $safeFileName = preg_replace("/[^a-zA-Z0-9.-]/", "_", $originalName);
    
    // Add timestamp to ensure uniqueness
    $info = pathinfo($safeFileName);
    $timestamp = date('YmdHis');
    $newFilename = $info['filename'] . '_' . $timestamp . '.' . $info['extension'];
    $destination = $uploadDir . $newFilename;
    
    error_log("Attempting to move file to: " . $destination);
    
    if (move_uploaded_file($tempName, $destination)) {
        error_log("File successfully moved to: " . $destination);
        echo json_encode([
            'success' => true,
            'message' => 'File uploaded successfully',
            'filename' => $newFilename,
            'path' => '/uploads/' . $newFilename // Return the web-accessible path
        ]);
    } else {
        error_log("Failed to move uploaded file from $tempName to $destination");
        echo json_encode([
            'success' => false,
            'message' => 'Failed to move uploaded file. Check permissions.'
        ]);
    }
} else {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
        UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
        UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
    ];
    
    $errorMessage = isset($errorMessages[$_FILES['file']['error']]) 
        ? $errorMessages[$_FILES['file']['error']] 
        : 'Unknown upload error';
    
    error_log("File upload error: " . $errorMessage);
    echo json_encode([
        'success' => false,
        'message' => $errorMessage
    ]);
}