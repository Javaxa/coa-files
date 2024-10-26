<?php
header('Content-Type: application/json');

// Get the JSON data from the request body
$json_data = file_get_contents('php://input');
$form_data = json_decode($json_data, true);

if ($form_data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Create the submissions directory if it doesn't exist
$submissions_dir = __DIR__ . '/RGBA/formbuilder/submissions/';
if (!file_exists($submissions_dir)) {
    mkdir($submissions_dir, 0777, true);
}

// Generate a filename if not provided
if (!isset($form_data['filename'])) {
    $formId = $form_data['formId'] ?? 'unknown';
    $submissionDate = date('YmdHis');
    $submittedBy = preg_replace('/[^a-zA-Z0-9]/', '_', $form_data['submittedBy'] ?? 'Unknown');
    $form_data['filename'] = "{$formId}_{$submissionDate}_{$submittedBy}.json";
}

// Ensure the filename ends with .json
if (!str_ends_with($form_data['filename'], '.json')) {
    $form_data['filename'] .= '.json';
}

// Full path for the submission file
$filepath = $submissions_dir . $form_data['filename'];

// Ensure required fields are present
$form_data['submittedBy'] = $form_data['submittedBy'] ?? 'Unknown';
$form_data['submissionDate'] = $form_data['submissionDate'] ?? date('c');

// Process form inputs
$processed_data = [];
foreach ($form_data as $key => $value) {
    if (strpos($key, 'dropdown_') === 0) {
        // Handle dropdown inputs
        $processed_data[$key] = $value;
    } elseif (strpos($key, 'options_') === 0) {
        // Handle checkbox and radio inputs
        $processed_data[$key] = $value;
    } elseif (strpos($key, 'yesno_') === 0) {
        // Handle yes/no inputs
        $processed_data[$key] = $value;
    } elseif ($key === 'munsell_color') {
        // Handle Munsell color chart input
        $processed_data[$key] = $value;
    } elseif (in_array($key, ['formId', 'submissionDate', 'filename', 'submittedBy'])) {
        // Keep these fields as is
        $processed_data[$key] = $value;
    } else {
        // Handle other input types (text, date, number, email, password, etc.)
        $processed_data[$key] = $value;
    }
}

// Save the processed form data as a JSON file
if (file_put_contents($filepath, json_encode($processed_data, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'message' => 'Form submission saved successfully', 'filename' => $form_data['filename']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving form submission']);
}