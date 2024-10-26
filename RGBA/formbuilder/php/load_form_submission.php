<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if (isset($_GET['formId']) && isset($_GET['submissionFile'])) {
    $formId = $_GET['formId'];
    $submissionFile = $_GET['submissionFile'];
    $formsDir = $_SERVER['DOCUMENT_ROOT'] . '/RGBA/formbuilder/forms/';
    $files = scandir($formsDir);
    $formFile = null;

    foreach ($files as $file) {
        if (strpos($file, $formId . '-') === 0 && pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
            $formFile = $file;
            break;
        }
    }

    if ($formFile) {
        $formPath = $formsDir . $formFile;

        if (is_readable($formPath)) {
            $formContent = file_get_contents($formPath);
            $formData = json_decode($formContent, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($formData['htmlContent'])) {
                $response['success'] = true;
                $response['htmlContent'] = $formData['htmlContent'];
                $response['formName'] = $formData['formName'] ?? 'Unnamed Form'; // Ensure this line is present
                $response['formId'] = $formId;

                // Load submission data
                $submissionsDir = $_SERVER['DOCUMENT_ROOT'] . '/RGBA/formbuilder/submissions/';
                $submissionPath = $submissionsDir . $submissionFile;

                if (file_exists($submissionPath) && is_readable($submissionPath)) {
                    $submissionContent = file_get_contents($submissionPath);
                    $submissionData = json_decode($submissionContent, true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        $response['submissionData'] = $submissionData;
                    } else {
                        $response['message'] = 'Error parsing submission data';
                    }
                } else {
                    $response['message'] = 'Submission file not found or not readable';
                }
            } else {
                $response['message'] = 'Invalid form data structure';
            }
        } else {
            $response['message'] = 'Form file is not readable';
        }
    } else {
        $response['message'] = 'Form file not found';
    }
} else {
    $response['message'] = 'Missing formId or submissionFile';
}

header('Content-Type: application/json');
echo json_encode($response);