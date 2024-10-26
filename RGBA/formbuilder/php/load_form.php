<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Function to log debug information
function debug_log($message) {
    error_log("[FORM_LOAD_DEBUG] " . $message);
}

debug_log("Script started");

header('Content-Type: application/json');

debug_log("GET parameters: " . json_encode($_GET));

if (isset($_GET['formFile'])) {
    $formFile = $_GET['formFile'];
    debug_log("Form file requested: $formFile");

    $formPath = __DIR__ . '/RGBA/formbuilder/forms/' . $formFile;
    debug_log("Full form path: $formPath");

    if (file_exists($formPath)) {
        debug_log("Form file exists");
        $formContent = file_get_contents($formPath);
        debug_log("Raw form content: " . substr($formContent, 0, 100) . "..."); // Log first 100 chars

        $formData = json_decode($formContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            debug_log("JSON decode error: " . json_last_error_msg());
        }
        debug_log("Decoded form data: " . json_encode($formData));

        if (isset($formData['htmlContent'])) {
            debug_log("htmlContent found in form data");
            $response = [
                'success' => true,
                'htmlContent' => $formData['htmlContent'],
                'formName' => $formData['formName'] ?? 'Unknown',
                'formId' => $formData['formId'] ?? 'Unknown'
            ];
            debug_log("Response prepared: " . json_encode($response));
            echo json_encode($response);
        } else {
            debug_log("htmlContent not found in form data");
            echo json_encode([
                'success' => false,
                'message' => 'Invalid form data: htmlContent not found'
            ]);
        }
    } else {
        debug_log("Form file not found");
        echo json_encode([
            'success' => false,
            'message' => 'Form file not found'
        ]);
    }
} else {
    debug_log("No form file specified in GET parameters");
    echo json_encode([
        'success' => false,
        'message' => 'No form file specified'
    ]);
}

debug_log("Script ended");
?>