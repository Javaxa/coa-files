<?php
header('Content-Type: application/json');

// Get the task ID from the POST request
$taskId = $_POST['taskId'] ?? null;

if (!$taskId) {
    echo json_encode(['success' => false, 'message' => 'No task ID provided']);
    exit;
}

// Read the existing data
$jsonFile = '../json/process_data.json';
$jsonData = file_get_contents($jsonFile);
$tasks = json_decode($jsonData, true);

// Find and remove the task with the given ID
$tasks = array_filter($tasks, function($task) use ($taskId) {
    return $task['id'] !== $taskId;
});

// Save the updated data back to the file
$success = file_put_contents($jsonFile, json_encode(array_values($tasks), JSON_PRETTY_PRINT));

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete task']);
}
?>