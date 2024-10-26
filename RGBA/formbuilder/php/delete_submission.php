<?php
header('Content-Type: application/json');

// Get the JSON data from the request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['filename'])) {
    echo json_encode(['success' => false, 'message' => 'Filename is required']);
    exit;
}

$filename = $data['filename'];
$submissions_dir = __DIR__ . '/../submissions/';
$filepath = $submissions_dir . $filename;

if (!file_exists($filepath)) {
    echo json_encode(['success' => false, 'message' => 'Submission file not found']);
    exit;
}

if (unlink($filepath)) {
    echo json_encode(['success' => true, 'message' => 'Submission deleted.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting submission']);
}