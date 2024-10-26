<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

function logError($message) {
    error_log(date('[Y-m-d H:i:s] ') . $message . "\n", 3, __DIR__ . '/error.log');
}


function getLookupTypes() {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    if (!file_exists($filename)) {
        logError("File does not exist: $filename");
        $initData = ['lookup_types' => []];
        file_put_contents($filename, json_encode($initData));
        return $initData['lookup_types'];
    }
    $data = file_get_contents($filename);
    if ($data === false) {
        logError("Failed to read file: $filename");
        return [];
    }
    $decodedData = json_decode($data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        logError("JSON decode error: " . json_last_error_msg());
        return [];
    }
    return $decodedData['lookup_types'] ?? [];
}

function addLookupType($newLookupTypeName) {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    $data = file_get_contents($filename);
    if ($data === false) {
        error_log("Failed to read file: $filename");
        return ['success' => false, 'message' => 'Failed to read lookup types file.'];
    }
    $lookupTypes = json_decode($data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return ['success' => false, 'message' => 'Failed to parse lookup types data.'];
    }
    foreach ($lookupTypes['lookup_types'] as $lookupType) {
        if ($lookupType['name'] === $newLookupTypeName) {
            return ['success' => false, 'message' => 'Lookup type already exists.'];
        }
    }
    $newId = strval(rand(1000, 9999));
    $lookupTypes['lookup_types'][] = ['id' => $newId, 'name' => $newLookupTypeName, 'sub_elements' => []];
    $result = file_put_contents($filename, json_encode($lookupTypes));
    if ($result === false) {
        error_log("Failed to write to file: $filename");
        return ['success' => false, 'message' => 'Failed to save new lookup type.'];
    }
    return ['success' => true];
}

function updateSubElementOrder($lookupTypeId, $newOrder) {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    error_log("Updating sub-element order for lookup type: $lookupTypeId");
    error_log("New order: " . json_encode($newOrder));

    $data = file_get_contents($filename);
    if ($data === false) {
        error_log("Failed to read lookup types file: $filename");
        return ['success' => false, 'message' => 'Failed to read lookup types file.'];
    }

    $lookupTypes = json_decode($data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return ['success' => false, 'message' => 'Failed to parse lookup types data.'];
    }

    foreach ($lookupTypes['lookup_types'] as &$lookupType) {
        if ($lookupType['id'] === strval($lookupTypeId)) { // Ensure comparison with string
            error_log("Found lookup type. Current sub-elements: " . json_encode($lookupType['sub_elements']));
            
            // Create a new array of sub-elements based on the new order
            $newSubElements = [];
            foreach ($newOrder as $item) {
                $newSubElements[] = [
                    'id' => strval($item['id']), // Ensure ID is stored as string
                    'name' => $item['name']
                ];
            }

            $lookupType['sub_elements'] = $newSubElements;
            error_log("Updated sub-elements: " . json_encode($lookupType['sub_elements']));
            
            $result = file_put_contents($filename, json_encode($lookupTypes, JSON_PRETTY_PRINT));
            if ($result === false) {
                error_log("Failed to write updated lookup types to file: $filename");
                return ['success' => false, 'message' => 'Failed to save updated lookup types.'];
            }
            return ['success' => true, 'message' => 'Sub-element order updated successfully.'];
        }
    }
    error_log("Lookup type not found: $lookupTypeId");
    return ['success' => false, 'message' => 'Lookup type not found.'];
}

function addSubElement($lookupTypeId, $subElementName) {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    $data = file_get_contents($filename);
    if ($data === false || empty($data)) {
        return ['success' => false, 'message' => 'Could not load existing lookup types.'];
    }

    $lookupTypes = json_decode($data, true);
    $found = false;
    foreach ($lookupTypes['lookup_types'] as &$lookupType) {
        if ($lookupType['id'] === $lookupTypeId) {
            foreach ($lookupType['sub_elements'] as $subElement) {
                if ($subElement['name'] === $subElementName) {
                    return ['success' => false, 'message' => 'Sub-element already exists.'];
                }
            }
            $newSubElementId = strval(rand(1000, 9999));
            $lookupType['sub_elements'][] = ['id' => $newSubElementId, 'name' => $subElementName];
            $found = true;
            break;
        }
    }

    if (!$found) {
        return ['success' => false, 'message' => 'Lookup type not found.'];
    } else {
        file_put_contents($filename, json_encode($lookupTypes));
    }

    return ['success' => true];
}

function deleteLookupType($lookupTypeId) {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    $data = file_get_contents($filename);
    if ($data === false) {
        error_log("Failed to read file: $filename");
        return ['success' => false, 'message' => 'Failed to read lookup types file.'];
    }
    $lookupTypes = json_decode($data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return ['success' => false, 'message' => 'Failed to parse lookup types data.'];
    }
    
    $found = false;
    foreach ($lookupTypes['lookup_types'] as $key => $lookupType) {
        if ($lookupType['id'] === $lookupTypeId) {
            array_splice($lookupTypes['lookup_types'], $key, 1);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        return ['success' => false, 'message' => 'Lookup type not found.'];
    }
    
    $result = file_put_contents($filename, json_encode($lookupTypes));
    if ($result === false) {
        error_log("Failed to write to file: $filename");
        return ['success' => false, 'message' => 'Failed to save updated lookup types.'];
    }
    return ['success' => true, 'message' => 'Lookup type deleted successfully.'];
}

function deleteSubElement($lookupTypeId, $subElementId) {
    $filename = __DIR__ . '/RGBA/warehouse/json/lookup_types.json'; 
    $data = file_get_contents($filename);
    if ($data === false) {
        return ['success' => false, 'message' => 'Failed to read lookup types file.'];
    }

    $lookupTypes = json_decode($data, true);
    foreach ($lookupTypes['lookup_types'] as &$lookupType) {
        if ($lookupType['id'] === $lookupTypeId) {
            foreach ($lookupType['sub_elements'] as $key => $subElement) {
                if ($subElement['id'] === $subElementId) {
                    array_splice($lookupType['sub_elements'], $key, 1);
                    file_put_contents($filename, json_encode($lookupTypes));
                    return ['success' => true, 'message' => 'Sub-element deleted successfully.'];
                }
            }
            return ['success' => false, 'message' => 'Sub-element not found.'];
        }
    }
    return ['success' => false, 'message' => 'Lookup type not found.'];
}

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['lookupTypeId'])) {
            $lookupTypeId = $_GET['lookupTypeId'];
            logError("Requested lookup type ID: $lookupTypeId");
            $lookupTypes = getLookupTypes();
            $found = false;
            foreach ($lookupTypes as $lookupType) {
                if ($lookupType['id'] === $lookupTypeId) {
                    logError("Found lookup type. Sub-elements: " . json_encode($lookupType['sub_elements']));
                    echo json_encode(['success' => true, 'data' => $lookupType['sub_elements']]);
                    $found = true;
                    exit;
                }
            }
            if (!$found) {
                logError("Lookup type not found for ID: $lookupTypeId");
                echo json_encode(['success' => false, 'message' => 'Lookup type not found.']);
            }
        } else {
            echo json_encode(['success' => true, 'data' => getLookupTypes()]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['action'])) {
            switch ($_POST['action']) {
                case 'deleteSubElement':
                    if (isset($_POST['lookupTypeId']) && isset($_POST['subElementId'])) {
                        $result = deleteSubElement($_POST['lookupTypeId'], $_POST['subElementId']);
                        echo json_encode($result);
                    } else {
                        throw new Exception('Missing parameters for deleteSubElement');
                    }
                    break;
                case 'updateSubElementOrder':
                    if (isset($_POST['lookupTypeId']) && isset($_POST['newOrder'])) {
                        $newOrder = json_decode($_POST['newOrder'], true);
                        $result = updateSubElementOrder($_POST['lookupTypeId'], $newOrder);
                        echo json_encode($result);
                    } else {
                        throw new Exception('Missing parameters for updateSubElementOrder');
                    }
                    break;
                    case 'deleteLookupType':
                        if (isset($_POST['id'])) {
                            $result = deleteLookupType($_POST['id']);
                            echo json_encode($result);
                        } else {
                            throw new Exception('Missing parameters for deleteLookupType');
                        }
                        break;
                default:
                    throw new Exception('Unknown action');
            }
        } elseif (isset($_POST['lookupTypeId']) && isset($_POST['subElementName'])) {
            $result = addSubElement($_POST['lookupTypeId'], $_POST['subElementName']);
            echo json_encode($result);
        } elseif (isset($_POST['lookuptype'])) {
            $result = addLookupType($_POST['lookuptype']);
            echo json_encode($result);
        } else {
            throw new Exception('Invalid request');
        }
    } else {
        throw new Exception('Request method not supported');
    }
} catch (Exception $e) {
    logError("Exception: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}