$(document).ready(function() {
    let userData = [];
    let departmentData = [];
    let currentChatType = 'personal';
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let lastTimestamp = 0;
    let currentConversationId = null;
    let currentAIChatId = null;
    
    $.when(
        $.getJSON('/warehouse/json/user_data.json'),
        $.getJSON('/warehouse/json/departments.json')
    ).done(function(userResponse, deptResponse) {
        userData = userResponse[0];
        departmentData = deptResponse[0];
        updateSidebar();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error loading data:", textStatus, errorThrown);
    });

    const aiProfilePicture = '/warehouse/images/ai.jpg';

    function updateSidebar() {
        const sidebar = $('#userList');
        sidebar.empty();
    
        if (currentChatType === 'personal') {
            sidebar.append('<select id="departmentDropdown" class="department-dropdown"><option value="all">All Departments</option></select>');
            populateDepartmentDropdown();
            displayUsers();
            $('#departmentDropdown').change(filterUsersByDepartment);
        } else if (currentChatType === 'group') {
            displayDepartments();
        } else if (currentChatType === 'ai') {
            displayAIChats();
            sidebar.append('<button id="newAIChatBtn" class="btn btn-primary mt-3">Start a new chat</button>');
        }

        $('.messages-display').empty();
        $('#selectedUserName').text(currentChatType === 'ai' ? 'Geology AI' : '');
        $('#selectedUserImg').toggle(currentChatType !== 'ai');
        $('.message-input').show();
        $('#attachmentButton').toggle(currentChatType !== 'ai');
        if (currentChatType === 'ai') {
            loadAIConversation();
        }
    }

    function displayAIChats() {
        const sidebar = $('#userList');
        $.getJSON(`/warehouse/json/${loggedInUser.username}-ai.json`, function(aiChats) {
            aiChats.forEach((chat, index) => {
                const chatElement = $('<div>', {
                    class: 'ai-chat-item',
                    text: `Chat ${index + 1}`,
                    click: function() { loadAIChat(chat.id); }
                });
                sidebar.append(chatElement);
            });
        }).fail(function() {
            console.log('No existing AI chats found.');
        });
    }

    function loadAIChat(chatId) {
        currentAIChatId = chatId;
        $('.messages-display').empty();
        $('.message-input').show();
        $('#messageText').val('');

        $.getJSON(`/warehouse/json/${loggedInUser.username}-ai.json`, function(aiChats) {
            const chat = aiChats.find(c => c.id === chatId);
            if (chat) {
                chat.messages.forEach(message => {
                    appendMessage(message, message.sender.id === loggedInUser.id);
                });
                scrollToBottom();
            }
        });
    }
    
    $('input[name="chatType"]').change(function() {
        currentChatType = $(this).val();
        updateSidebar();
        $('#messageText').val('');
        if (currentChatType === 'ai') {
            loadAIConversation();
        }
    });

    function loadAIConversation() {
        currentAIChatId = 'ai_' + Date.now();
        $('.messages-display').empty();
        $('.message-input').show();
        $('#messageText').val('');

        // We won't send an introduction message to save credits
        // Instead, we'll just display a welcome message locally
        const welcomeMessage = {
            sender: {id: 'AI', name: 'Dave'},
            message: "Hello! I'm Dave, an AI geology assistant created by BGS. How may I help you today?",
            timestamp: Math.floor(Date.now() / 1000),
            id: 'ai_welcome'
        };
        appendMessage(welcomeMessage, false);
    }

    $(document).on('click', '#newAIChatBtn', function() {
        loadAIConversation();
    });


    function populateDepartmentDropdown() {
        const dropdown = $('#departmentDropdown');
        dropdown.empty();
        dropdown.append($('<option>', { value: 'all', text: 'All Departments' }));

        if (departmentData && Array.isArray(departmentData.departments)) {
            departmentData.departments.forEach(dept => {
                dropdown.append($('<option>', {
                    value: dept.name,
                    text: dept.name
                }));
            });
        } else {
        }
    }

    function displayUsers() {
        const userList = $('#userList');
        userList.find('.message').remove();

        if (Array.isArray(userData)) {
            userData.forEach(addUserToList);
        } else {
            console.error("Invalid user data format:", userData);
        }

        filterUsersByDepartment();
    }

    function addUserToList(user) {

    const userElement = $('<div>', {
        class: 'message',
        'data-userid': user.id,
        click: function() { selectUser(this); }
    }).append(
        $('<img>', {
            class: 'user-img',
            src: user.profilePicture || '/warehouse/images/user.jpg'
        }),
        $('<span>', {
            class: 'user-name',
            text: `${user.firstname} ${user.lastname}`
        })
    ).data('department', user.department);

    $('#userList').append(userElement);
}

    function filterUsersByDepartment() {
        const selectedDepartment = $('#departmentDropdown').val();

        $('.message').each(function() {
            const userDepartment = $(this).data('department');
            if (selectedDepartment === 'all' || selectedDepartment === userDepartment) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    

$('#departmentDropdown').change(filterUsersByDepartment);

function addDepartmentToList(dept) {
    const deptElement = $('<div>', {
        class: 'department-item',
        'data-department': dept.name,
        click: function() { selectDepartment(this, dept); }
    }).append(
        $('<div>', {
            class: 'department-icon',
            text: dept.name.charAt(0)
        }),
        $('<span>', {
            class: 'department-name',
            text: dept.name
        })
    );

    $('#userList').append(deptElement);
}

function selectDepartment(element, dept) {
    stopPolling();
    $('.department-item').removeClass('selected');
    $(element).addClass('selected');

    const departmentName = dept.name;
    const usersInDept = userData.filter(user => user.department === departmentName);
    let html = `
        <div class="department-header">${departmentName}</div>
        <div class="department-users-container">
            <div class="department-users">
    `;

    if (usersInDept.length > 0) {
        usersInDept.forEach(user => {
            html += `
                <div class="department-user">
                    <img src="${user.profilePicture || '/warehouse/images/user.jpg'}" alt="${user.firstname} ${user.lastname}" class="user-icon">
                    <span>${user.firstname} ${user.lastname}</span>
                </div>
            `;
        });
    } else {
        html += '<div class="no-users">No users found in this department.</div>';
    }

    html += `
            </div>
        </div>
    `;

    $('#selectedUserImg').hide();
    $('#selectedUserName').html(html);
    $('.messages-display').show().empty();
    $('.message-input').show();
    $('#messageText').val('');
    currentChatType = 'group';
    loadConversation(departmentName, true);
}

    window.selectUser = function(element) {
        stopPolling();
        $('.message, .department-item').removeClass('selected');
        $(element).addClass('selected');
        const userName = $(element).find('.user-name').text();
        const userImg = $(element).find('.user-img').attr('src');
        const selectedUserId = $(element).data('userid');
        $('#selectedUserImg').show().attr('src', userImg);
        $('#selectedUserName').text(userName);
        $('.messages-display').show().empty();
        $('.message-input').show();
        $('#messageText').val('');
        const conversationId = [loggedInUser.id, selectedUserId].sort().join('-');
        loadConversation(conversationId, false);
    };

    function loadConversation(conversationId, isDepartment) {
        if (!conversationId) {
            console.error("Invalid conversationId:", conversationId);
            return;
        }
        stopPolling();

        $.ajax({
            url: 'php/manage_conversations.php',
            type: 'POST',
            data: {
                action: 'getConversation',
                conversationId: conversationId,
                isDepartment: isDepartment
            },
            dataType: 'json',
            success: function(data) {
                if (data.error) {
                    console.error("Error loading conversation:", data.error);
                    alert("Failed to load conversation: " + data.error);
                } else if (data.messages && Array.isArray(data.messages)) {
                    displayMessages(data.messages, data.participants);
                    if (data.messages.length > 0) {
                        lastTimestamp = Math.max(...data.messages.map(m => m.timestamp));
                    }
                    startPolling(conversationId, isDepartment);
                } else {
                    $('.messages-display').empty().append('<p>No messages yet.</p>');
                    startPolling(conversationId, isDepartment);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Failed to load conversation:", textStatus, errorThrown);
                alert("Failed to load conversation. Please try again.");
            }
        });
    }
    

    $(document).on('click', '.department-item', function() {
        const dept = {
            name: $(this).data('department')
        };
        selectDepartment(this, dept);
    });

    function getUserIcon(userId) {
        const user = userData.find(u => u.id === userId);
        return user ? user.profilePicture : '/warehouse/images/user.jpg';
    }


    function displayDepartments() {
        if (departmentData && Array.isArray(departmentData.departments)) {
            departmentData.departments.forEach(addDepartmentToList);
        } else {
            console.error("Invalid department data format:", departmentData);
        }
    }

    
$('[data-bs-toggle="tooltip"]').tooltip();

$('#emojiButton').on('click', function(e) {
    e.stopPropagation();
    const emojiPopup = $('#emojiPopup');
    emojiPopup.toggle();
    const buttonPosition = $(this).offset();
    const buttonWidth = $(this).outerWidth();
    const buttonHeight = $(this).outerHeight();
    const popupWidth = emojiPopup.outerWidth();
    
    emojiPopup.css({
        position: 'fixed',
        bottom: $(window).height() - buttonPosition.top + 5, // 5px gap above the button
        left: buttonPosition.left + (buttonWidth / 2) - (popupWidth / 2) // Center align with the button
    });
});


$('.emoji').on('click', function() {
    const emoji = $(this).data('emoji');
    $('#messageText').val($('#messageText').val() + emoji);
    $('#emojiPopup').hide();
});


$(document).on('click', function(e) {
    if (!$(e.target).closest('#emojiPopup').length && !$(e.target).is('#emojiButton')) {
        $('#emojiPopup').hide();
    }
});

$('#messageText').keypress(function(e) {
        if (e.which == 13) {  
            e.preventDefault();
            sendMessage();
        }
});

function updateAIMessage(message) {
    const messageElement = $(`.messages-display [data-message-id="${message.id}"]`);
    if (messageElement.length) {
        messageElement.find('span').text(message.message);
    }
}

function sendMessage(fileMessage) {
    let messageText;
    let isFileUpload = false;

    if (typeof fileMessage === 'string' && fileMessage.startsWith('{') && fileMessage.endsWith('}')) {
        messageText = fileMessage;
        isFileUpload = true;
    } else {
        messageText = $('#messageText').val().trim();
    }

    if (messageText !== "") {
        const isDepartment = currentChatType === 'group';
        const isAI = currentChatType === 'ai';
        let participants;
        let conversationId;
        
        if (isDepartment) {
            const selectedDepartment = $('.department-item.selected');
            if (selectedDepartment.length === 0) {
                console.error("No department selected");
                alert("Please select a department before sending a message.");
                return;
            }
            const departmentName = selectedDepartment.find('.department-name').text();
            participants = [departmentName];
            conversationId = departmentName;
        } else if (isAI) {
            participants = ['AI'];
            conversationId = currentAIChatId;
        } else {
            const selectedUser = $('.message.selected');
            if (selectedUser.length === 0) {
                console.error("No user selected");
                alert("Please select a user before sending a message.");
                return;
            }
            const receiverId = selectedUser.data('userid');
            participants = [loggedInUser.id, receiverId];
            conversationId = participants.sort().join('-');
        }

        const messageData = {
            sender: {id: loggedInUser.id, name: loggedInUser.firstname + ' ' + loggedInUser.lastname},
            message: messageText,
            timestamp: Math.floor(Date.now() / 1000),
            tempId: 'temp_' + Date.now()
        };

        // Clear the input field for non-file messages
        if (!isFileUpload) {
            $('#messageText').val('');
        }

        // Append the message immediately with a temporary ID
        appendMessage(messageData, true, isFileUpload);

        if (isAI) {
            sendMessageToAI(messageText, messageData.tempId);
        } else {
            $.ajax({
                url: 'php/manage_conversations.php',
                type: 'POST',
                data: {
                    action: 'addMessage',
                    conversationId: conversationId,
                    participants: JSON.stringify(participants),
                    sender: JSON.stringify(messageData.sender),
                    message: messageText,
                    isDepartment: isDepartment
                },
                dataType: 'json',
                success: function(data) {
                    if (data.error) {
                        console.error("Server returned an error:", data.error);
                        alert("Error sending message: " + data.error);
                        $(`[data-temp-id="${messageData.tempId}"]`).remove();
                    } else {
                        const serverMessage = data.messages[data.messages.length - 1];
                        const $tempMessage = $(`[data-temp-id="${messageData.tempId}"]`);
                        $tempMessage.attr('data-message-id', serverMessage.id)
                                    .removeAttr('data-temp-id');
                        
                        // Update lastTimestamp when sending a message
                        if (serverMessage.timestamp > lastTimestamp) {
                            lastTimestamp = serverMessage.timestamp;
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("AJAX request failed:", textStatus, errorThrown);
                    alert("Failed to send message. Please try again.");
                    $(`[data-temp-id="${messageData.tempId}"]`).remove();
                }
            });
        }
    }
}
        
function sendMessageToAI(message, tempId) {
    const prompt = `You are Dave, an AI geologist created by BGS ( if they ever ask, It stands for Business Governence Solutions, never say you were created by British Geological Survey. BGS is a tool for managing Business with various interfaces for different departments. ). You have extensive knowledge of geology, geochemistry, geophysics and related fields. Please respond to the following question or statement in a manner befitting a knowledgeable geologist, using appropriate geological terminology where applicable. Dont say *clears throat* too often.: "${message}"`;

    $.ajax({
        url: 'php/ai_chat.php',
        type: 'POST',
        data: {
            prompt: prompt
        },
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.error("Error from AI:", response.error);
                alert("Failed to get AI response: " + response.error);
            } else if (response.message) {
                const aiMessage = {
                    sender: {id: 'AI', name: 'Dave (BGS Geologist)'},
                    message: response.message,
                    timestamp: Math.floor(Date.now() / 1000),
                    id: 'ai_' + Date.now()
                };
                simulateAITyping(aiMessage);
                saveAIChat(message, aiMessage);
            } else {
                console.error("Unexpected response format:", response);
                alert("Received an unexpected response format from the AI.");
            }
            $(`[data-temp-id="${tempId}"]`).removeAttr('data-temp-id').attr('data-message-id', 'user_' + Date.now());
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX request to AI failed:", textStatus, errorThrown);
            alert("Failed to get AI response. Please try again.");
            $(`[data-temp-id="${tempId}"]`).remove();
        }
    });
}

function saveAIChat(userMessage, aiMessage) {
    const userMessageObj = {
        sender: {id: loggedInUser.id, name: loggedInUser.firstname + ' ' + loggedInUser.lastname},
        message: userMessage,
        timestamp: Math.floor(Date.now() / 1000),
        id: 'user_' + Date.now()
    };

    $.ajax({
        url: 'php/save_ai_chat.php',
        type: 'POST',
        data: JSON.stringify({
            username: loggedInUser.username,
            chatId: currentAIChatId,
            userMessage: userMessageObj,
            aiMessage: aiMessage
        }),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                console.log('AI chat saved successfully');
            } else {
                console.error('Failed to save AI chat:', response.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to save AI chat:', textStatus, errorThrown);
        }
    });
}

function simulateAITyping(aiMessage) {
    let charIndex = 0;
    const typingSpeed = 30; // milliseconds per character
    const tempMessage = {
        ...aiMessage,
        message: '',
        id: 'temp_' + Date.now()
    };
    
    appendMessage(tempMessage, false);

    function typeNextChar() {
        if (charIndex < aiMessage.message.length) {
            charIndex++;
            tempMessage.message = aiMessage.message.substring(0, charIndex);
            updateAIMessage(tempMessage);
            scrollToBottom();
            setTimeout(typeNextChar, typingSpeed);
        } else {
            // Update the message ID to the final one when typing is complete
            $(`[data-message-id="${tempMessage.id}"]`).attr('data-message-id', aiMessage.id);
        }
    }

    setTimeout(typeNextChar, 50); // Start typing after a 1-second delay
}

    function displayMessages(messages, participants) {
        const messagesDisplay = $('.messages-display');
        messagesDisplay.empty();
    
        if (!messages || messages.length === 0) {
            messagesDisplay.append('<p>No messages yet.</p>');
            return;
        }
    
        messages.forEach(message => {
            const sender = participants.find(p => p.id === message.sender.id) || message.sender;
            const messageElement = $('<div>').addClass(message.sender.id === loggedInUser.id ? 'outgoing-message' : 'incoming-message');
            messageElement.css('position', 'relative');
            const userIcon = $('<img>').addClass('user-icon').attr('src', getUserIcon(message.sender.id));
            const senderName = $('<small>').text(sender.name || 'Unknown');
            
            let messageContent;
            if (typeof message.message === 'string' && message.message.startsWith('{') && message.message.endsWith('}')) {
                const fileData = JSON.parse(message.message);
                if (fileData.type === 'file') {
                    messageContent = createFilePreview(fileData);
                } else {
                    messageContent = $('<span>').text(message.message);
                }
            } else {
                messageContent = $('<span>').text(message.message);
            }
            
            const timestamp = new Date(message.timestamp * 1000);
            const formattedTime = timestamp.toLocaleString();
            
            messageElement.append(userIcon, senderName, $('<br>'), messageContent);
            messagesDisplay.append(messageElement);
    
            // Create tooltip
            const tooltip = $('<div>')
                .addClass('message-tooltip')
                .text(`Sent on: ${formattedTime}`)
                .css({
                    position: 'absolute',
                    backgroundColor: '#ffb927d4',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    display: 'none',
                    zIndex: 1000,
                    whiteSpace: 'nowrap' // Ensure the tooltip doesn't wrap
                });
    
            messageElement.append(tooltip);
    
            // Add hover event listeners
            messageElement.on('mouseenter', function() {
                const isOutgoing = $(this).hasClass('outgoing-message');
                
                let tooltipPosition;
                if (isOutgoing) {
                    tooltipPosition = {
                        right: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginRight: '10px'
                    };
                } else {
                    tooltipPosition = {
                        left: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginLeft: '10px'
                    };
                }
    
                tooltip.css({
                    ...tooltipPosition,
                    display: 'block'
                });
    
                // Check if tooltip is outside the chat container
                const chatContainer = $('.messages-display');
                const tooltipRect = tooltip[0].getBoundingClientRect();
                const containerRect = chatContainer[0].getBoundingClientRect();
    
                if (tooltipRect.right > containerRect.right) {
                    tooltip.css({
                        left: 'auto',
                        right: '0',
                        transform: 'translateY(-50%)'
                    });
                } else if (tooltipRect.left < containerRect.left) {
                    tooltip.css({
                        left: '0',
                        right: 'auto',
                        transform: 'translateY(-50%)'
                    });
                }
            });
    
            messageElement.on('mouseleave', function() {
                tooltip.css('display', 'none');
            });
        });
        scrollToBottom();
    }

    function scrollToBottom() {
        const messagesDisplay = $('.messages-display');
        messagesDisplay.scrollTop(messagesDisplay.prop('scrollHeight'));
    }

    function stopPolling() {
        currentConversationId = null;
    }

    function startPolling(conversationId, isDepartment) {
        stopPolling();
    
        currentConversationId = conversationId;
    
        function pollForNewMessages() {
            if (currentConversationId !== conversationId) {
                return;
            }
    
            $.ajax({
                url: 'php/manage_conversations.php',
                type: 'POST',
                data: {
                    action: 'getNewMessages',
                    conversationId: conversationId,
                    isDepartment: isDepartment,
                    lastTimestamp: lastTimestamp
                },
                dataType: 'json',
                success: function(data) {
                    if (data.error) {
                        console.error("Error polling for new messages:", data.error);
                    } else if (data.messages && data.messages.length > 0) {
                        data.messages.forEach(message => {
                            if (message.timestamp > lastTimestamp) {
                                const isOutgoing = message.sender.id === loggedInUser.id;
                                appendMessage(message, isOutgoing);
                                lastTimestamp = message.timestamp;
                            }
                        });
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Failed to poll for new messages:", textStatus, errorThrown);
                },
                complete: function() {
                    if (currentConversationId === conversationId) {
                        setTimeout(pollForNewMessages, 2000); // Poll every 2 seconds
                    }
                }
            });
        }
        pollForNewMessages();
    }


    function createFilePreview(fileInfo) {
        const $wrapper = $('<div>').addClass('file-preview-wrapper');
        const fileExtension = fileInfo.fileExtension.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(fileExtension);
        const fileUrl = fileInfo.filePath;
        if (isImage) {
            const previewHtml = `
                <div class="file-preview">
                    <img src="${fileUrl}" alt="${fileInfo.originalName}" class="img-preview" style="max-width: 200px; max-height: 200px; cursor: pointer;">
                </div>
            `;
            $wrapper.append(previewHtml);
    
            $wrapper.find('.img-preview').on('click', function() {
                showImageModal(fileUrl, fileInfo.originalName);
            });
        } else {
            const iconClass = getFileIconClass(fileExtension);
            const previewHtml = `
                <div class="file-preview">
                    <a href="#" class="file-download-link" data-file-url="${fileUrl}" data-file-name="${fileInfo.originalName}" data-file-type="${fileExtension}">
                        <div class="file-icon ${iconClass}"></div>
                        <span class="file-name">${fileInfo.originalName}</span>
                    </a>
                </div>
            `;
            $wrapper.append(previewHtml);
            $wrapper.find('.file-download-link').on('click', function(e) {
                e.preventDefault();
                const fileUrl = $(this).data('file-url');
                const fileName = $(this).data('file-name');
                const fileType = $(this).data('file-type');
    
                if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(fileType)) {
                    showDocumentViewer(fileUrl, fileName, fileType);
                } else {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }
        return $wrapper;
    }

    function getFileIconClass(fileExtension) {
        const iconMap = {
            pdf: 'file-icon-pdf',
            doc: 'file-icon-word', docx: 'file-icon-word',
            xls: 'file-icon-excel', xlsx: 'file-icon-excel',
            ppt: 'file-icon-powerpoint', pptx: 'file-icon-powerpoint',
            txt: 'file-icon-text',
            jpg: 'file-icon-image', jpeg: 'file-icon-image', png: 'file-icon-image', 
            gif: 'file-icon-image', bmp: 'file-icon-image', tiff: 'file-icon-image',
            mp3: 'file-icon-audio', wav: 'file-icon-audio', ogg: 'file-icon-audio',
            mp4: 'file-icon-video', avi: 'file-icon-video', mov: 'file-icon-video', wmv: 'file-icon-video',
            zip: 'file-icon-archive', rar: 'file-icon-archive', '7z': 'file-icon-archive', 
            tar: 'file-icon-archive', gz: 'file-icon-archive',
            html: 'file-icon-code', css: 'file-icon-code', js: 'file-icon-code', 
            php: 'file-icon-code', py: 'file-icon-code', java: 'file-icon-code', 
            c: 'file-icon-code', cpp: 'file-icon-code'
        };
        return iconMap[fileExtension] || 'file-icon-default';
    }
    
    function showImageModal(imageUrl, imageName) {
        $('#imageModal').remove();
    
        const modalHtml = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="imageModalLabel">${imageName}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${imageUrl}" class="img-fluid" alt="${imageName}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modalHtml);
        new bootstrap.Modal(document.getElementById('imageModal')).show();
    }
    
    function showDocumentViewer(fileUrl, fileName, fileType) {
        const viewerUrl = getViewerUrl(fileUrl, fileType);
        $('#documentViewerModalLabel').text(fileName);
        $('#documentViewer').attr('src', viewerUrl);
        new bootstrap.Modal(document.getElementById('documentViewerModal')).show();
    }
    
    function getViewerUrl(fileUrl, fileType) {
        switch (fileType) {
            case 'pdf':
                return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
            case 'doc':
            case 'docx':
            case 'xls':
            case 'xlsx':
                return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
            default:
                return fileUrl;
        }
    }
    
    function appendMessage(message, isOutgoing = false) {
        const messagesDisplay = $('.messages-display');
        messagesDisplay.find('p:contains("No messages yet")').remove();
    
        const messageId = message.id || message.tempId;
        const existingMessage = messagesDisplay.find(`[data-message-id="${messageId}"], [data-temp-id="${messageId}"]`);
        
        if (existingMessage.length > 0) {
            return;
        }
    
        const messageElement = createMessageElement(message, isOutgoing);
        messagesDisplay.append(messageElement);
        scrollToBottom();
    }

    function createMessageElement(message, isOutgoing = false) {
        const messageElement = $('<div>')
            .addClass(isOutgoing ? 'outgoing-message' : 'incoming-message')
            .css('position', 'relative');
    
        if (message.tempId) {
            messageElement.attr('data-temp-id', message.tempId);
        } else if (message.id) {
            messageElement.attr('data-message-id', message.id);
        }
    
        const userIcon = $('<img>').addClass('user-icon').attr('src', message.sender.id === 'AI' ? aiProfilePicture : getUserIcon(message.sender.id));
        
        const senderName = $('<small>').text(message.sender.name || 'Unknown');
    
        let messageContent;
        if (typeof message.message === 'string' && message.message.startsWith('{') && message.message.endsWith('}')) {
            try {
                const fileData = JSON.parse(message.message);
                if (fileData.type === 'file') {
                    messageContent = createFilePreview(fileData);
                } else {
                    messageContent = $('<span>').text(message.message);
                }
            } catch (e) {
                console.error("Error parsing file message:", e);
                messageContent = $('<span>').text(message.message);
            }
        } else {
            messageContent = $('<span>').text(message.message);
        }
    
        const timestamp = new Date(message.timestamp * 1000);
        const formattedTime = timestamp.toLocaleString();
    
        const tooltip = $('<div>')
            .addClass('message-tooltip')
            .text(`Sent on: ${formattedTime}`)
            .css({
                position: 'absolute',
                backgroundColor: '#ffb927d4',
                color: 'white',
                padding: '5px',
                borderRadius: '5px',
                fontSize: '12px',
                display: 'none',
                zIndex: 1000,
                whiteSpace: 'nowrap'
            });
    
        messageElement.append(userIcon, senderName, $('<br>'), messageContent, tooltip);
        messageElement.on('mouseenter', function() {
            const isOutgoing = $(this).hasClass('outgoing-message');
            let tooltipPosition = isOutgoing ? 
                { right: '100%', marginRight: '10px' } : 
                { left: '100%', marginLeft: '10px' };
            
            tooltip.css({
                ...tooltipPosition,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'block'
            });
        });
    
        messageElement.on('mouseleave', function() {
            tooltip.css('display', 'none');
        });
    
        return messageElement;
    }

    
    updateSidebar();
    window.sendMessage = sendMessage;
});
        


$(document).ready(function() {
    const attachmentModal = new bootstrap.Modal(document.getElementById('attachmentModal'));

    $('#attachmentButton').click(function() {
        attachmentModal.show();
    });

    $('#uploadFileBtn').click(function() {
        $('#fileInput').click();
    });

    $('#takePhotoBtn').click(function() {
        $('#attachmentModal').modal('hide');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    const video = document.getElementById('cameraFeed');
                    video.srcObject = stream;
                    video.style.display = 'block';
                    video.play();
    
                    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
                    cameraModal.show();
    
                    const captureBtn = document.getElementById('captureBtn');
                    const retakeBtn = document.getElementById('retakeBtn');
                    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
                    const canvas = document.getElementById('photoCanvas');
                    const capturedImage = document.getElementById('capturedImage');
    
                    captureBtn.onclick = function() {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        video.style.display = 'none';
                        capturedImage.src = canvas.toDataURL('image/jpeg');
                        capturedImage.style.display = 'block';
                        
                        captureBtn.style.display = 'none';
                        retakeBtn.style.display = 'inline-block';
                        uploadPhotoBtn.style.display = 'inline-block';
                    };
    
                    retakeBtn.onclick = function() {
                        video.style.display = 'block';
                        capturedImage.style.display = 'none';
                        captureBtn.style.display = 'inline-block';
                        retakeBtn.style.display = 'none';
                        uploadPhotoBtn.style.display = 'none';
                    };
    
                    uploadPhotoBtn.onclick = function() {
                        canvas.toBlob(function(blob) {
                            const file = new File([blob], "photo_" + new Date().getTime() + ".jpg", { type: "image/jpeg" });
                            uploadFile(file);
                        }, 'image/jpeg');
                        
                        stream.getTracks().forEach(track => track.stop());
                        cameraModal.hide();
                    };
    
                    $('#cameraModal').on('hidden.bs.modal', function () {
                        stream.getTracks().forEach(track => track.stop());
                    });
                })
                .catch(function(error) {
                    console.error("Error accessing camera:", error);
                    alert("Unable to access camera. Please check your permissions.");
                });
        } else {
            alert("Your browser doesn't support camera access.");
        }
    });
    
   
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
    
        $.ajax({
            url: 'php/upload_chat_file.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.error) {
                    console.error("Error uploading file:", response.error);
                    alert("Failed to upload file: " + response.error);
                } else {
                    $('#attachmentModal').modal('hide');
                    
                    const fileMessage = {
                        type: 'file',
                        filePath: response.filename,
                        originalName: response.originalName || file.name,
                        fileExtension: response.fileExtension || file.name.split('.').pop().toLowerCase(),
                        fileType: file.type
                    };
                    
                    sendMessage(JSON.stringify(fileMessage));
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error uploading file:", textStatus, errorThrown);
                alert("Failed to upload file. Please try again.");
            }
        });
    }

    $('#fileInput').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
    });



});