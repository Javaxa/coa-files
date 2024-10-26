<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Function to log debug information
function debug_log($message) {
    error_log("[FORM_DELETE_DEBUG] " . $message);
}

debug_log("Delete script started");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['forms'])) {
    $formsToDelete = $_POST['forms'];
    debug_log("Forms to delete: " . json_encode($formsToDelete));

    $successCount = 0;
    $errorCount = 0;

    foreach ($formsToDelete as $formFile) {
        $formPath = __DIR__ . '/../forms/' . $formFile;
        debug_log("Attempting to delete: $formPath");

        if (file_exists($formPath)) {
            if (unlink($formPath)) {
                $successCount++;
                debug_log("Successfully deleted: $formPath");
            } else {
                $errorCount++;
                debug_log("Failed to delete: $formPath");
            }
        } else {
            $errorCount++;
            debug_log("File not found: $formPath");
        }
    }

    if ($errorCount === 0) {
        echo json_encode([
            'success' => true,
            'message' => "$successCount form(s) deleted successfully."
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "$successCount form(s) deleted successfully. $errorCount form(s) failed to delete."
        ]);
    }
} else {
    debug_log("Invalid request: POST data missing or incorrect");
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request'
    ]);
}

debug_log("Delete script ended");
?>