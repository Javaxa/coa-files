<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formName = $_POST['formName'] ?? '';
    $formId = $_POST['formId'] ?? '';
    $htmlContent = $_POST['htmlContent'] ?? '';
    $saveMode = $_POST['saveMode'] ?? 'new';

    if (!$formName || !$formId || !$htmlContent) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $formsDir = __DIR__ . '/../forms/';
    if (!is_dir($formsDir)) {
        mkdir($formsDir, 0777, true);
    }

    $existingFile = null;
    $forms = glob($formsDir . '*.txt');
    foreach ($forms as $form) {
        $formContent = json_decode(file_get_contents($form), true);
        if (isset($formContent['formId']) && $formContent['formId'] === $formId) {
            $existingFile = $form;
            break;
        }
    }

    // Generate a random ID
    $randomId = bin2hex(random_bytes(8)); // 16 character random string

    if ($saveMode === 'replace' && $existingFile) {
        // Remove the old file
        unlink($existingFile);
    }

    // Create the new filename using formId and randomId
    $fileName = $formId . '-' . $randomId . '.txt';

    $filePath = $formsDir . $fileName;

    $fileContent = json_encode([
        'formName' => $formName,
        'formId' => $formId,
        'htmlContent' => $htmlContent
    ]);

    if (file_put_contents($filePath, $fileContent)) {
        echo json_encode(['success' => true, 'fileName' => $fileName]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>