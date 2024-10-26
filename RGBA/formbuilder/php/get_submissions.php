<?php
header('Content-Type: application/json');

$formId = $_GET['formId'] ?? '';

if (empty($formId)) {
    echo json_encode(['success' => false, 'message' => 'Form ID is required']);
    exit;
}

$submissions_dir = __DIR__ . '/RGBA/formbuilder/submissions/';
$submissions = [];

if (is_dir($submissions_dir)) {
    $files = glob($submissions_dir . $formId . '_*.json');
    
    foreach ($files as $file) {
        $content = file_get_contents($file);
        $submission = json_decode($content, true);
        
        if ($submission) {
            $submissions[] = $submission;
        }
    }
}

if (!empty($submissions)) {
    echo json_encode(['success' => true, 'submissions' => $submissions]);
} else {
    echo json_encode(['success' => false, 'message' => 'No submissions found for this form']);
}