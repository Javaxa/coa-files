<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['chatId']) || !isset($data['userMessage']) || !isset($data['aiMessage'])) {
    echo json_encode(['error' => 'Invalid data format']);
    exit;
}

$username = $data['username'];
$chatId = $data['chatId'];
$userMessage = $data['userMessage'];
$aiMessage = $data['aiMessage'];

$filename = $_SERVER['DOCUMENT_ROOT'] . "/RGBA/warehouse/json/{$username}-ai.json";

if (file_exists($filename)) {
    $chats = json_decode(file_get_contents($filename), true);
} else {
    $chats = [];
}

$chatIndex = array_search($chatId, array_column($chats, 'id'));

if ($chatIndex !== false) {
    $chats[$chatIndex]['messages'][] = $userMessage;
    $chats[$chatIndex]['messages'][] = $aiMessage;
} else {
    $chats[] = [
        'id' => $chatId,
        'messages' => [$userMessage, $aiMessage]
    ];
}

if (file_put_contents($filename, json_encode($chats, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to save AI chat']);
}
?>