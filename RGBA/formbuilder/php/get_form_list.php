<?php
header('Content-Type: application/json');

$formsDir = __DIR__ . '/../forms/';

// If formId is provided, get specific form data
if (isset($_GET['formId'])) {
    $formFile = $formsDir . $_GET['formId'] . '-*.txt';
    $matches = glob($formFile);
    
    if (!empty($matches)) {
        $formContent = json_decode(file_get_contents($matches[0]), true);
        echo json_encode([
            'success' => true,
            'form' => [
                'name' => $formContent['formName'] ?? basename($matches[0], '.txt'),
                'file' => basename($matches[0])
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Form not found'
        ]);
    }
    exit;
}

// Otherwise, return all forms
$forms = glob($formsDir . '*.txt');

$formList = [];
foreach ($forms as $form) {
    $formContent = json_decode(file_get_contents($form), true);
    $formList[] = [
        'name' => $formContent['formName'] ?? basename($form, '.txt'),
        'file' => basename($form)
    ];
}

echo json_encode([
    'success' => true,
    'forms' => $formList
]);