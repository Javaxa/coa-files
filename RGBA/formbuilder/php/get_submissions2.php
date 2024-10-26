<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$formId = $_GET['formId'] ?? '';

// Remove .txt extension if it exists in the formId
$formId = str_replace('.txt', '', $formId);

// Correct path resolution
$submissions_dir = realpath(__DIR__ . '/../submissions');

$debug = [
    'requestedFormId' => $formId,
    'submissionsDir' => $submissions_dir,
    'fullPattern' => $submissions_dir . '/' . $formId . '_*.json'
];

if (!$submissions_dir || !is_dir($submissions_dir)) {
    echo json_encode([
        'success' => false,
        'message' => 'Submissions directory not found',
        'debug' => $debug
    ]);
    exit;
}

$pattern = $submissions_dir . '/' . $formId . '_*.json';
$files = glob($pattern);
$submissions = [];

if ($files) {
    foreach ($files as $file) {
        $content = file_get_contents($file);
        $submission = json_decode($content, true);
        
        if ($submission) {
            // Add filename to submission data
            $submission['filename'] = basename($file);
            $submissions[] = $submission;
        }
    }
}

// Single JSON response
echo json_encode([
    'success' => !empty($submissions),
    'message' => empty($submissions) ? 'No submissions found for this form' : '',
    'submissions' => $submissions,
    'debug' => $debug
]);