<?php
// php/get_forms.php

header('Content-Type: application/json');

$formsDir = '/RGBA/formbuilder/forms/';
$response = ['success' => false, 'forms' => [], 'message' => '', 'debug' => []];

try {
    $response['debug'][] = 'Checking directory: ' . realpath($formsDir);
    
    if (!is_dir($formsDir)) {
        $formsDir = '/RGBA/formbuilder/forms/';
        $response['debug'][] = 'Trying alternative directory: ' . realpath($formsDir);
        
        if (!is_dir($formsDir)) {
            throw new Exception('Forms directory not found at either location');
        }
    }

    // Get all .txt files
    $files = glob($formsDir . "*.txt");
    
    if ($files === false) {
        throw new Exception('Error reading directory');
    }

    // Process each file
    foreach ($files as $file) {
        $content = file_get_contents($file);
        if ($content === false) {
            $response['debug'][] = 'Error reading file: ' . basename($file);
            continue;
        }
        
        // Add both filename and content to the response
        $response['forms'][] = [
            'filename' => basename($file),
            'content' => $content
        ];
    }

    $response['success'] = true;
    $response['debug'][] = 'Found and processed ' . count($response['forms']) . ' form(s)';
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    $response['debug'][] = 'Error: ' . $e->getMessage();
    if (is_dir($formsDir)) {
        $response['debug'][] = 'Directory contents: ' . print_r(scandir($formsDir), true);
    }
}

echo json_encode($response);