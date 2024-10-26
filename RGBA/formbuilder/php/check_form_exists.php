<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formId = $_POST['formId'] ?? '';

    if (!$formId) {
        echo json_encode(['success' => false, 'message' => 'Missing form ID']);
        exit;
    }

    $formsDir = __DIR__ . '/../forms/';
    $forms = glob($formsDir . '*.txt');

    $exists = false;
    foreach ($forms as $form) {
        $formContent = json_decode(file_get_contents($form), true);
        if (isset($formContent['formId']) && $formContent['formId'] === $formId) {
            $exists = true;
            break;
        }
    }

    echo json_encode(['success' => true, 'exists' => $exists]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>