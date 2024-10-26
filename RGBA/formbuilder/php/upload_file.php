<?php
header('Content-Type: application/json');
$uploadDir = '/RGBA/uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $tempName = $_FILES['file']['tmp_name'];
    $originalName = $_FILES['file']['name'];
    $safeFileName = preg_replace("/[^a-zA-Z0-9.-]/", "_", $originalName);
    $counter = 0;
    $newFilename = $safeFileName;
    while (file_exists($uploadDir . $newFilename)) {
        $counter++;
        $info = pathinfo($safeFileName);
        $newFilename = $info['filename'] . '_' . $counter . '.' . $info['extension'];
    }
    
    $destination = $uploadDir . $newFilename;
    
    if (move_uploaded_file($tempName, $destination)) {
        echo json_encode([
            'success' => true,
            'message' => 'File uploaded successfully',
            'filename' => $newFilename
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to move uploaded file'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'File upload error: ' . $_FILES['file']['error']
    ]);
}