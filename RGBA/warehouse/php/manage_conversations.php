<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', '/Applications/MAMP/htdocs/RBGA/warehouse/php/error.log');

header('Content-Type: application/json');

function handleError($message) {
    error_log("Error in manage_conversations.php: " . $message);
    echo json_encode(['error' => $message]);
    exit;
}

function getConversationFilename($conversationId, $isDepartment = false) {
    $baseDir = '/Applications/MAMP/htdocs/RBGA/warehouse/messages/';
    if (!is_dir($baseDir)) {
        if (!@mkdir($baseDir, 0755, true)) {
            handleError("Failed to create directory: $baseDir");
        }
    }
    
    $year = date('Y');
    $newFilename = $baseDir . "{$conversationId}-{$year}.json";
    $oldFilenamePattern = $baseDir . $conversationId . "-" . $year . "-*.json";
    $matchingFiles = glob($oldFilenamePattern);
    
    if (!empty($matchingFiles)) {
        return $matchingFiles[0];
    }
    return $newFilename;
}

function loadConversation($filename) {
    if (file_exists($filename)) {
        $content = file_get_contents($filename);
        if ($content === false) {
            handleError("Failed to read file: $filename");
        }
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            handleError("Failed to parse JSON from file: " . json_last_error_msg());
        }
        return $data;
    }
    return ['participants' => [], 'messages' => []];
}

function saveConversation($filename, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT);
    if ($json === false) {
        handleError("Failed to encode data to JSON: " . json_last_error_msg());
    }
    if (file_put_contents($filename, $json) === false) {
        handleError("Failed to write to file: $filename");
    }
}

function addMessage($conversationId, $participants, $sender, $message, $isDepartment = false) {
    $filename = getConversationFilename($conversationId, $isDepartment);
    $conversation = loadConversation($filename);
    
    if (empty($conversation['participants'])) {
        $conversation['participants'] = $participants;
    }
    $messageData = json_decode($message, true);
    if (json_last_error() === JSON_ERROR_NONE && isset($messageData['type']) && $messageData['type'] === 'file') {
        $conversation['messages'][] = [
            'sender' => $sender,
            'message' => $message,
            'timestamp' => time(),
            'type' => 'file'
        ];
    } else {
        $conversation['messages'][] = [
            'sender' => $sender,
            'message' => $message,
            'timestamp' => time(),
            'type' => 'text'
        ];
    }
    
    saveConversation($filename, $conversation);
    return $conversation;
}


if ($_POST['action'] == 'getNewMessages') {
    $conversationId = $_POST['conversationId'];
    $isDepartment = filter_var($_POST['isDepartment'], FILTER_VALIDATE_BOOLEAN);
    $lastTimestamp = intval($_POST['lastTimestamp']);

    $filename = getConversationFilename($conversationId, $isDepartment);
    $conversation = loadConversation($filename);

    $newMessages = [];

    foreach ($conversation['messages'] as $message) {
        if ($message['timestamp'] > $lastTimestamp) {
            $newMessages[] = $message;
        }
    }

    echo json_encode(['messages' => $newMessages]);
    exit;
}

function getConversation($conversationId, $isDepartment = false) {
    $filename = getConversationFilename($conversationId, $isDepartment);
    return loadConversation($filename);
}

$action = $_POST['action'] ?? '';

try {
    switch ($action) {
      case 'addMessage':
    $conversationId = $_POST['conversationId'] ?? '';
    $participants = json_decode($_POST['participants'], true);
    $sender = json_decode($_POST['sender'], true);
    $message = $_POST['message'] ?? '';
    $isDepartment = isset($_POST['isDepartment']) ? filter_var($_POST['isDepartment'], FILTER_VALIDATE_BOOLEAN) : false;
    
    if (empty($conversationId) || empty($sender) || empty($message)) {
        handleError('Missing required data');
    }
    
    $result = addMessage($conversationId, $participants, $sender, $message, $isDepartment);
    echo json_encode($result);
    break;
        case 'getConversation':
            $conversationId = $_POST['conversationId'] ?? '';
            $isDepartment = isset($_POST['isDepartment']) ? filter_var($_POST['isDepartment'], FILTER_VALIDATE_BOOLEAN) : false;
            
            if (empty($conversationId)) {
                handleError('Missing conversation ID');
            }
            
            $result = getConversation($conversationId, $isDepartment);
            echo json_encode($result);
            break;
        default:
            handleError('Invalid action');
    }
} catch (Exception $e) {
    handleError('An error occurred: ' . $e->getMessage());
}
?>