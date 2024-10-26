let currentStep = 1;
const totalSteps = 5;
let isSubmitting = false;


$(document).ready(function() {
    let existingData = [];
    let departmentMapping = {};
    let activeFilter = 'all';

    function applyFilter() {
    let filteredTasks = existingData;
    if (activeFilter !== 'all') {
        filteredTasks = existingData.filter(task => {
            switch (activeFilter) {
                case 'department':
                    return !task.assignedToName;
                case 'personal':
                    return !!task.assignedToName;
                case 'due':
                    return getTaskStatus(task.startDate, task.endDate) === 'due';
                case 'scheduled':
                    return getTaskStatus(task.startDate, task.endDate) === 'scheduled';
                case 'in-process':
                    return getTaskStatus(task.startDate, task.endDate) === 'in-process' || 
                           getTaskStatus(task.startDate, task.endDate) === 'indefinite';
                case 'finished':
                    return getTaskStatus(task.startDate, task.endDate) === 'finished';
                default:
                    return true;
            }
        });
    }
    updateUI(filteredTasks);
}

function getTaskStatus(startDate, endDate) {
    const now = new Date();
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start && !end) return 'indefinite';
    if (start && now < start) return 'scheduled';
    if (end && now > end) return 'due';
    if (start && (!end || now <= end)) return 'in-process';
    if (end && now <= end) return 'in-process';
    return 'finished';
}

$('.filter-button').on('click', function() {
    const $this = $(this);
    const filter = $this.data('filter');
    $('.filter-button').removeClass('active');
    $this.addClass('active');
    activeFilter = filter;
    applyFilter();
});


function updateUI(tasksToDisplay = existingData) {
    const taskContainer = $('#taskContainer');
    taskContainer.empty();
    if (tasksToDisplay.length === 0) {
        taskContainer.append('<p>No tasks available.</p>');
        return;
    }
    const isListView = taskContainer.hasClass('list-view');
    tasksToDisplay.forEach(function(item) {
        const card = createTaskCard(item, isListView);
        taskContainer.append(card);
    });
    updateCountdowns();
}


    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadExistingData() {
        $.getJSON('/RGBA/warehouse/json/process_data.json?' + new Date().getTime(), function(data) {
            existingData = data;
            updateUI();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading existing data:', textStatus, errorThrown);
            if (jqXHR.status === 404) {
                existingData = [];
                updateUI();
            }
        });
    }

$.getJSON('/RGBA/warehouse/json/user_data.json', function(userData) {
    window.userData = userData;
});

    $('input[name="assignType"]').change(function() {
    if (this.value === 'department') {
        $('#departmentSelection').show();
        $('#individualSelection').hide();
        $('.user-box').removeClass('selected');
    } else {
        $('#departmentSelection').show();
        $('#individualSelection').show();
        populateUserSelection($('#department').val() || null);
    }
});


function getCurrentUser() {
    const userData = localStorage.getItem('loggedInUser');
    
    if (!userData) {
        console.warn('No user data found in localStorage');
        return null;
    }
    
    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
    }
}


function getUserImageSrc(user) {
    return user.profilePicture && user.profilePicture !== '' 
        ? user.profilePicture 
        : '/RGBA/warehouse/images/user.jpg';
}

function populateUserSelection(departmentId = null) {
    const userContainer = $('#userContainer');
    userContainer.empty();
    
    window.userData.forEach(user => {
        if (!departmentId || getDepartmentId(user.department) === departmentId) {
            const userBox = $('<div>')
                .addClass('user-box')
                .data('userId', user.id)
                .data('userDepartment', user.department)
                .append(
                    $('<img>')
                        .attr('src', getUserImageSrc(user))
                        .addClass('user-avatar')
                        .on('error', function() {
                            $(this).attr('src', '/RGBA/warehouse/images/user.jpg');
                        }),
                    $('<p>').text(`${user.firstname} ${user.lastname}`).addClass('user-name'),
                    $('<p>').text(user.department).addClass('user-department')
                );
            userContainer.append(userBox);
        }
    });



    $('.user-box').click(function() {
        $('.user-box').removeClass('selected');
        $(this).addClass('selected');
        const userDepartment = $(this).data('userDepartment');
        const departmentId = getDepartmentId(userDepartment);
        $('#department').val(departmentId);
    });
}




  function validateStep(step) {
    let isValid = true;
    
    switch(step) {
        case 1:
          isValid = $('input[name="delegationType"]:checked').length > 0;
          break;
      case 2:
        isValid = $('#title').val().trim() !== '' && $('#description').val().trim() !== '';
        break;
      case 3:
        isValid = $('input[name="priority"]:checked').length > 0;
        break;
        case 4:
            isValid = $('input[name="taskStatus"]:checked').length > 0;
            break;
      case 5:
        isValid = $('input[name="category"]:checked').length > 0 && 
                  $('#department').val() !== '' &&
                  ($('input[name="assignType"]:checked').val() === 'department' || 
                   ($('input[name="assignType"]:checked').val() === 'individual' && 
                    $('#userContainer .user-box.selected').length > 0));
        break;
    }
    
    return isValid;
  }
  
  function showBootstrapModal(title, message, confirmCallback = null, secondaryCallback = null, modalType = 'default') {
    $('#dynamicModal').remove();

    let footerContent = '';
    if (modalType === 'uploadOptions') {
        footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="modalUploadFile">Upload File</button>
            <button type="button" class="btn btn-primary" id="modalTakePhoto">Take Photo</button>
        `;
    } else if (modalType === 'confirmSubmission') {
        footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="modalConfirm">Confirm</button>
        `;
    } else {
        footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            ${confirmCallback ? '<button type="button" class="btn btn-primary" id="modalConfirm">Confirm</button>' : ''}
            ${secondaryCallback ? '<button type="button" class="btn btn-primary" id="modalSecondary">Secondary</button>' : ''}
        `;
    }

    const modalHtml = `
        <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        ${footerContent}
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modalElement = document.getElementById('dynamicModal');
    const modal = new bootstrap.Modal(modalElement);

    if (modalType === 'uploadOptions') {
        $('#modalUploadFile').on('click', function() {
            modal.hide();
            if (confirmCallback) confirmCallback('upload');
        });
        $('#modalTakePhoto').on('click', function() {
            modal.hide();
            if (secondaryCallback) secondaryCallback('photo');
        });
    } else {
        if (confirmCallback) {
            $('#modalConfirm').on('click', function() {
                modal.hide();
                confirmCallback();
            });
        }
        if (secondaryCallback) {
            $('#modalSecondary').on('click', function() {
                modal.hide();
                secondaryCallback();
            });
        }
    }

    modal.show();
}


  
  $('#nextBtn').click(function() {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    } else {
        showBootstrapModal('Empty Fields', 'Please fill in all required fields before proceeding.');
    
    }
  });
  
  // Event listener for the Previous button
  $('#prevBtn').click(function() {
    currentStep--;
    showStep(currentStep);
  });

  function updateProgress(step) {
    const percent = (step / totalSteps) * 100;
    $('.progress-bar').css('width', `${percent}%`).attr('aria-valuenow', percent).text(`Step ${step} of ${totalSteps}`);
  }
  

  function showStep(step) {
    $('.step').hide();
    $(`#step${step}`).show();
    
    // Update step title and progress bar
    const stepTitles = [
      "Delegation Type",
      "Title and Description",
      "Priority Level",
      "Dates and Status",
      "Category and Assignment"
    ];
    
    $('#stepTitle').text(stepTitles[step - 1]);
    
    const percent = (step / totalSteps) * 100;
    $('.progress-bar')
      .css('width', `${percent}%`)
      .attr('aria-valuenow', percent)
      .text(`Step ${step} of ${totalSteps}`);
    
    // Update buttons
    if (step === 1) {
      $('#prevBtn').hide();
    } else {
      $('#prevBtn').show();
    }
    
    if (step === totalSteps) {
      $('#nextBtn').hide();
      $('#createTaskBtn').show();
    } else {
      $('#nextBtn').show();
      $('#createTaskBtn').hide();
    }

    updateProgress(step);
  }


  $('#task-form').submit(function(e) {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting) {
        return;
    }
    
    isSubmitting = true;
    const currentUser = getCurrentUser();
  
    var formData = {
        id: generateUUID(),
        delegationType: $('input[name="delegationType"]:checked').val(),
        title: $('#title').val(),
        description: $('#description').val(),
        priorityLevel: $('input[name="priority"]:checked').val(),
        status: $('input[name="taskStatus"]:checked').val(),
        category: $('input[name="category"]:checked').val(),
        startDate: formatDateForServer($('#startDate').val()),
        endDate: formatDateForServer($('#endDate').val()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        departmentId: $('#department').val() || null,
        createdBy: currentUser ? {
            id: currentUser.id,
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            department: currentUser.department
        } : null
    };
  
    if ($('input[name="assignType"]:checked').val() === 'individual') {
        const selectedUser = $('#userContainer .user-box.selected');
        if (selectedUser.length) {
            formData.assignedToId = selectedUser.data('userId');
            formData.assignedToName = selectedUser.find('.user-name').text();
            formData.departmentName = selectedUser.data('userDepartment');
            formData.departmentId = getDepartmentId(formData.departmentName);
        }
    } else {
        formData.departmentName = departmentMapping[formData.departmentId];
    }
  
    $.ajax({
        url: '/RGBA/warehouse/php/saveData.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify([formData]),
        success: function(response) {
            loadExistingData();
            clearTaskForm();
            $('#taskModal').modal('hide');
            isSubmitting = false; // Reset submission flag
        },
        error: function(xhr, status, error) {
            console.error('Error saving task:', status, error);
            console.error('Server response:', xhr.responseText);
            alert('Failed to save task. Please try again.');
            isSubmitting = false; // Reset submission flag on error
        }
    });
});

// Modify the modal show event to ensure work category is selected by default
$('#taskModal').on('show.bs.modal', function () {
    currentStep = 1;
    showStep(1);
    
    // Ensure work category is selected by default
    $('#categoryWork').prop('checked', true);
    
    // Reset the submission flag when modal opens
    isSubmitting = false;
});

  
  // Clear the form when the modal is hidden
  $('#taskModal').on('hidden.bs.modal', function () {
    clearTaskForm();
  });


function parseDate(dateString) {
    if (!dateString) return null;
    
    // Check if the date is in DD/MM/YYYY HH:mm format
    const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
    if (parts) {
      // Create date object with correct month (month in JS is 0-indexed)
      return new Date(parts[3], parts[2] - 1, parts[1], parts[4], parts[5]);
    }
    
    // If not in the expected format, try default parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    console.warn(`Invalid date format: ${dateString}`);
    return null;
  }
  


function getCountdownText(startDate, endDate) {
    const now = new Date();
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start && !end) return 'In Process';
    if (start && now < start) {
        const countdown = getTimeUntilStart(startDate);
        return `Scheduled - Starting in ${countdown}`;
    }
    if (end && now > end) return `Task Due - ${formatDate(end)}`;
    
    if (end && now <= end) {
        const countdown = getTimeUntilCompletion(endDate);
        return `Time till completion: ${countdown}`;
    }
    
    if (start && now >= start && !end) return 'In Process (No End Date)';
    
    return 'In Process';
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}

function getTimeUntilStart(startDate) {
    const now = new Date();
    const start = parseDate(startDate);
    
    if (!start) return null;
    
    const diff = start - now;
    if (diff <= 0) return "Starting now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
}

function getTimeUntilCompletion(endDate) {
    const now = new Date();
    const end = parseDate(endDate);
    
    if (!end) return null;
    
    const diff = end - now;
    if (diff <= 0) return "Task Due";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
}

function updateCountdowns() {
    $('.task-card').each(function() {
        const $card = $(this);
        const startDate = $card.data('start-date');
        const endDate = $card.data('end-date');
        const $countdown = $card.find('.countdown');
        const countdownText = getCountdownText(startDate, endDate);
        
        if (countdownText) {
            $countdown.text(countdownText).show();
            
            $countdown.removeClass('is-scheduled is-due is-deadline in-process');
            if (countdownText.includes('Scheduled')) {
                $countdown.addClass('is-scheduled');
            } else if (countdownText.includes('Task Due')) {
                $countdown.addClass('is-due');
            } else if (countdownText.includes('Time till completion')) {
                $countdown.addClass('is-deadline');
            } else {
                $countdown.addClass('in-process');
            }
        } else {
            $countdown.hide();
        }
    });
}

$('.modal').on('hidden.bs.modal', function () {
  $(this).find('form').trigger('reset');
});

$('input[name="editAssignType"]').change(function() {
  if (this.value === 'department') {
    $('#editDepartmentSelection').show();
    $('#editIndividualSelection').hide();
    $('#editUserContainer .user-box').removeClass('selected');
  } else {
    $('#editDepartmentSelection').show();
    $('#editIndividualSelection').show();
    populateEditUserSelection($('#editDepartment').val() || null);
  }
});

$('#editDepartment').change(function() {
  if ($('input[name="editAssignType"]:checked').val() === 'individual') {
    populateEditUserSelection($(this).val());
  }
});

// Update the existing user selection handler
$('#userContainer').on('click', '.user-box', function() {
    $('#userContainer .user-box').removeClass('selected');
    $(this).addClass('selected');
    const userDepartment = $(this).data('userDepartment');
    const departmentId = getDepartmentId(userDepartment);
    $('#department').val(departmentId);
});

function clearTaskForm() {
    $('#task-form')[0].reset();
    $('#userContainer .user-box').removeClass('selected');
    $('input[name="assignType"][value="department"]').prop('checked', true);
    $('#departmentSelection').show();
    $('#individualSelection').hide();
    $('#categoryWork').prop('checked', true); // Ensure work category remains selected
    currentStep = 1;
    showStep(1);
}

// Add extra validation to prevent duplicate submissions via the create button
$('#createTaskBtn').click(function() {
    if (isSubmitting) {
        return;
    }
    
    if (validateStep(currentStep)) {
        $('#task-form').submit();
    } else {
        showBootstrapModal('Empty Fields', 'Please fill in all required fields before creating the task.');
    }
});

function populateEditUserSelection(departmentId = null) {
    const userContainer = $('#editUserContainer');
    userContainer.empty();
    
    window.userData.forEach(user => {
        if (!departmentId || getDepartmentId(user.department) === departmentId) {
            const userBox = $('<div>')
                .addClass('user-box')
                .data('userId', user.id)
                .data('userDepartment', user.department)
                .append(
                    $('<img>')
                        .attr('src', getUserImageSrc(user))
                        .addClass('user-avatar')
                        .on('error', function() {
                            $(this).attr('src', '/RGBA/warehouse/images/user.jpg');
                        }),
                    $('<p>').text(`${user.firstname} ${user.lastname}`).addClass('user-name'),
                    $('<p>').text(user.department).addClass('user-department')
                );
            userContainer.append(userBox);
        }
    });

    $('#editUserContainer .user-box').click(function() {
        $('#editUserContainer .user-box').removeClass('selected');
        $(this).addClass('selected');
        const userDepartment = $(this).data('userDepartment');
        const departmentId = getDepartmentId(userDepartment);
        $('#editDepartment').val(departmentId);
    });
}

function formatDateTimeForDisplay(dateString) {
    const date = parseDate(dateString);
    if (!date) return 'Not set';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  $('#edit-task-form').submit(function(e) {
    e.preventDefault();
    const taskId = $(this).data('taskId');
    const updatedTask = {
      id: taskId,
      delegationType: $('input[name="editDelegationType"]:checked').val(),
      title: $('#editTitle').val(),
      description: $('#editDescription').val(),
      priorityLevel: $('input[name="editPriority"]:checked').val(),
      status: $('input[name="editTaskStatus"]:checked').val(), // Updated this line
      category: $('input[name="editCategory"]:checked').val(),
      startDate: formatDateForServer($('#editStartDate').val()),
      endDate: formatDateForServer($('#editEndDate').val()),
      updatedAt: new Date().toUTCString(),
      departmentId: $('#editDepartment').val() || null
    };

    if ($('input[name="editAssignType"]:checked').val() === 'individual') {
        const selectedUser = $('#editUserContainer .user-box.selected');
        if (selectedUser.length) {
            updatedTask.assignedToId = selectedUser.data('userId');
            updatedTask.assignedToName = selectedUser.find('.user-name').text();
            updatedTask.departmentName = selectedUser.data('userDepartment');
            updatedTask.departmentId = getDepartmentId(updatedTask.departmentName);
        } else {
            showBootstrapModal('No User Selected', 'Please select an individual to assign the task to.');
            return;
        }
    } else {
        updatedTask.departmentName = departmentMapping[updatedTask.departmentId];
        updatedTask.assignedToId = null;
        updatedTask.assignedToName = null;
    }

    $.ajax({
        url: '/RGBA/warehouse/php/saveData.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify([updatedTask]),
        success: function(response) {
            loadExistingData();
            $('#editTaskModal').modal('hide');
        },
        error: function(xhr, status, error) {
            console.error('Error updating task:', status, error);
            console.error('Server response:', xhr.responseText);
            let errorMessage = 'Failed to update task. ';
            if (xhr.responseText) {
                errorMessage += 'Server response: ' + xhr.responseText;
            }
            alert(errorMessage);
        }
    });
});


    $('#editTaskModal .close').click(function() {
        $('#editTaskModal').css('display', 'none');
    });


$('.close').on('click', function() {
  closeModal();
});

$('.cancel-button').on('click', function(event) {
  event.preventDefault(); 
  closeModal();
});

$(window).on('click', function(event) {
  if ($(event.target).is('#editModal')) {
      closeModal();
  }
});



function addFormSelectionModal() {
    const modalHTML = `
        <div class="modal fade" id="formSelectionModal" tabindex="-1" aria-labelledby="formSelectionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="formSelectionModalLabel">Select a Form to Attach</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="form-selection-header">
                        <div class="form-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="formSearch" placeholder="Search forms...">
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="form-selection-grid" id="formGrid">
                            <!-- Forms will be populated here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="attachSelectedForm" disabled>Attach Form</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Event handlers
$(document).ready(function() {
    addFormSelectionModal();

    // Update the attachProcessBtn click handler
$('#attachProcessBtn').click(function() {
    const taskId = $('#taskViewModal').data('taskId');
    const task = existingData.find(t => t.id === taskId);
    
    console.log('Current task:', task); // Debug log
    
    if (task) {
        switch(task.delegationType) {
            case 'attachForm':
                $('#taskViewModal').modal('hide');
                $('#formSelectionModal').modal('show');
                loadAvailableForms(task.attachedForm); // Pass the existing attachment
                break;
                
            case 'document':
                $('#taskViewModal').modal('hide');
                showBootstrapModal('Upload Document', 'Document upload functionality will be added soon.');
                break;
                
            case 'dependency':
                $('#taskViewModal').modal('hide');
                showBootstrapModal('Dependency Selection', 'Dependency selection functionality will be added soon.');
                break;
                
            default:
                showBootstrapModal('Error', 'Unknown delegation type');
                break;
        }
    } else {
        console.error('No task found with ID:', taskId); // Debug log
        showBootstrapModal('Error', 'Could not find process details');
    }
});

    // Form search functionality
    $('#formSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('.form-card').each(function() {
            const formName = $(this).find('.form-card-title').text().toLowerCase();
            $(this).toggle(formName.includes(searchTerm));
        });
    });

    $(document).on('click', '.form-card', function() {
        const $this = $(this);
        const wasSelected = $this.hasClass('selected');
        const hasExistingAttachment = $('.form-card .currently-attached').length > 0;
        
        // Remove selected state from all cards
        $('.form-card').removeClass('selected')
            .find('.selected-icon').remove();
        
        // Update button based on selection state and existing attachment
        if (!wasSelected) {
            // New selection
            $this.addClass('selected')
                .append('<i class="fas fa-check-circle selected-icon"></i>');
            
            $('#attachSelectedForm')
                .prop('disabled', false)
                .text($this.find('.currently-attached').length > 0 ? 'Update Attachment' : 'Attach Form');
        } else {
            // Deselection - if there's an existing attachment, show Remove Attachment
            if (hasExistingAttachment) {
                $('#attachSelectedForm')
                    .prop('disabled', false)
                    .text('Remove Attachment');
            } else {
                $('#attachSelectedForm')
                    .prop('disabled', true)
                    .text('Select a Form');
            }
        }
    });
    
    // Update the attach form button handler
    $('#attachSelectedForm').click(function() {
        const selectedForm = $('.form-card.selected').data('form');
        const taskId = $('#taskViewModal').data('taskId');
        const buttonText = $(this).text();
        
        if (taskId) {
            const updatedTask = existingData.find(t => t.id === taskId);
            if (updatedTask) {
                // If we're removing the attachment
                if (buttonText === 'Remove Attachment') {
                    updatedTask.attachedForm = null;
                    
                    // Save the updated task
                    $.ajax({
                        url: '/RGBA/warehouse/php/saveData.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify([updatedTask]),
                        success: function(response) {
                            $('#formSelectionModal').modal('hide');
                            showBootstrapModal('Success', 'Form attachment removed successfully');
                            loadExistingData();
                        },
                        error: function(xhr, status, error) {
                            console.error('Error removing form attachment:', error);
                            showBootstrapModal('Error', 'Failed to remove form attachment. Please try again.');
                        }
                    });
                } 
                // If we're attaching or updating
                else if (selectedForm) {
                    updatedTask.attachedForm = selectedForm;
                    
                    // Save the updated task
                    $.ajax({
                        url: '/RGBA/warehouse/php/saveData.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify([updatedTask]),
                        success: function(response) {
                            $('#formSelectionModal').modal('hide');
                            showBootstrapModal('Success', buttonText === 'Update Attachment' ? 
                                'Form attachment updated successfully' : 
                                'Form attached successfully');
                            loadExistingData();
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating form attachment:', error);
                            showBootstrapModal('Error', 'Failed to update form attachment. Please try again.');
                        }
                    });
                }
            }
        }
    });
    
    // Update the loadAvailableForms function to better handle existing attachments
    function loadAvailableForms(existingAttachment = null) {
        $.ajax({
            url: '/RGBA/warehouse/php/get_forms.php',
            type: 'GET',
            success: function(response) {
                const formGrid = $('#formGrid');
                formGrid.empty();
                
                if (response.success && response.forms && response.forms.length > 0) {
                    response.forms.forEach(formData => {
                        try {
                            const formContent = JSON.parse(formData.content);
                            const isCurrentlyAttached = existingAttachment === formData.filename;
                            
                            const formCard = $(`
                                <div class="form-card ${isCurrentlyAttached ? 'selected' : ''}" 
                                     data-form="${formData.filename}" 
                                     data-form-id="${formContent.formId}">
                                    <i class="fas fa-file-alt form-card-icon"></i>
                                    ${isCurrentlyAttached ? '<i class="fas fa-check-circle selected-icon"></i>' : ''}
                                    <div class="form-card-title">${formContent.formName}</div>
                                    <div class="form-card-info">
                                        <small class="text-muted">Form ID: ${formContent.formId}</small>
                                        ${isCurrentlyAttached ? '<div class="currently-attached">Currently Attached</div>' : ''}
                                    </div>
                                </div>
                            `);
                            
                            formGrid.append(formCard);
                        } catch (e) {
                            console.error('Error parsing form data:', e);
                        }
                    });
    
                    // Set initial button state based on existing attachment
                    $('#attachSelectedForm')
                        .prop('disabled', false)
                        .text(existingAttachment ? 'Remove Attachment' : 'Select a Form');
                    
                } else {
                    formGrid.append('<div class="no-forms-found">No forms available</div>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading forms:', error);
                $('#formGrid').html('<div class="no-forms-found">Error loading forms</div>');
            }
        });
    }
    

});

$('.grid-view').addClass('active');
$('#taskContainer').addClass('grid-view');

$('.change-view').on('click', function() {
    $('.change-view').removeClass('active');
    $(this).addClass('active');
    if ($(this).hasClass('grid-view')) {
        $('#taskContainer').removeClass('list-view').addClass('grid-view');
    } else {
        $('#taskContainer').removeClass('grid-view').addClass('list-view');
    }
    updateUI();
});

function formatStatus(status) {
  const statusMap = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'not-completed': 'Not Completed'
  };
  return statusMap[status] || status;
}

function createTaskCard(item, isListView) {
    const taskStatus = getCountdownText(item.startDate, item.endDate);
    const cardClasses = isListView ? 'col-12 mb-3' : 'col-md-4 mb-3';
    
    const departmentName = item.departmentName || departmentMapping[item.departmentId] || 'Unknown Department';
    const assignmentInfo = item.assignedToName 
        ? `${item.assignedToName} (${departmentName})`
        : departmentName;
    const cardButtons = $('<div>').addClass('card-buttons').append(
        $('<button>').addClass('edit-btn-small')
            .html('<i class="fas fa-edit"></i>')
            .attr('title', 'Edit'),
        $('<button>').addClass('delete-btn-small')
            .html('<i class="fas fa-trash-alt"></i>')
            .attr('title', 'Delete')
    );
    
    const card = $('<div>').addClass(cardClasses).append(
        $('<div class="card task-card">').addClass('task')
            .attr('data-id', item.id)
            .attr('data-title', item.title)
            .attr('data-description', item.description)
            .attr('data-department', item.departmentId)
            .attr('data-priority', item.priorityLevel)
            .attr('data-status', taskStatus)
            .attr('data-category', item.category)
            .attr('data-start-date', item.startDate)
            .attr('data-end-date', item.endDate)
            .attr('data-assigned-to', item.assignedToName)
            .append(
                $('<div class="card-body">').append(
                    $('<span>')
                        .addClass('department-name')
                        .addClass(item.assignedToName ? 'individual-name' : '')
                        .text(assignmentInfo),
                    $('<h6>').addClass('card-title').text(item.title),
                    $('<p>').addClass('card-text').text(item.description),
                    $('<div>').addClass('countdown').text(taskStatus),
                    $('<span>').addClass('status-bar').text(formatStatus(item.status)),
                    $('<span>').addClass(`category-badge category-${item.category}`).text(item.category),
                    cardButtons
                )
            )
    );
    return card;
}

    
$(document).ready(function() {

    if (localStorage.getItem('openTaskModal') === 'true') {
        $('#taskModal').modal('show');
        // Clear the flag
        localStorage.removeItem('openTaskModal');
    }
    
    loadExistingData();
    loadDepartmentData();
    updateCountdowns();
    setInterval(updateCountdowns, 60000);
    $('#categoryWork').prop('checked', true);
});


function formatDateTimeLocal(dateString) {
    if (!dateString) return '';
    let date;
    if (dateString.includes('T')) {
        // ISO format
        date = new Date(dateString);
    } else {
        // DD/MM/YYYY HH:mm format
        const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
        if (parts) {
            date = new Date(Date.UTC(parts[3], parts[2] - 1, parts[1], parts[4], parts[5]));
        }
    }
    if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateString}`);
        return '';
    }
    const formatted = date.toISOString().slice(0, 16);
    return formatted;
}

$('#addTaskBtn').on('click', function() {
    $('#taskModal').modal('show');
    currentStep = 1;
    showStep(currentStep);
  });


  $(document).on('click', '.edit-btn-small', function() {
    const card = $(this).closest('.task-card');
    const id = card.data('id');
    const taskToEdit = existingData.find(item => item.id === id);
  
    // Set the delegation type
    $(`input[name="editDelegationType"][value="${taskToEdit.delegationType}"]`).prop('checked', true);  
    $('#editTitle').val(taskToEdit.title);
    $('#editDescription').val(taskToEdit.description);
    $(`input[name="editTaskStatus"][value="${taskToEdit.status}"]`).prop('checked', true);
    $('#editStartDate').val(formatDateTimeLocal(taskToEdit.startDate));
    $('#editEndDate').val(formatDateTimeLocal(taskToEdit.endDate));
    
    // Set the priority radio button
    $(`input[name="editPriority"][value="${taskToEdit.priorityLevel}"]`).prop('checked', true);
    
    // Set the category radio button
    $(`input[name="editCategory"][value="${taskToEdit.category}"]`).prop('checked', true);
  
    populateDepartmentDropdown('#editDepartment', taskToEdit.departmentId);
  
    if (taskToEdit.assignedToId) {
        $(`input[name="editAssignType"][value="individual"]`).prop('checked', true);
        $('#editDepartmentSelection').show();
        $('#editIndividualSelection').show();
        populateEditUserSelection(taskToEdit.departmentId);
        setTimeout(() => {
            const userBox = $(`#editUserContainer .user-box`);
            userBox.addClass('selected');
            userBox.trigger('click');
        }, 100);
    } else {
        $(`input[name="editAssignType"][value="department"]`).prop('checked', true);
        $('#editDepartmentSelection').show();
        $('#editIndividualSelection').hide();
    }
  
    $('#edit-task-form').data('taskId', id);
    $('#editTaskModal').modal('show');
});

$(document).on('click', '.task-card', function(e) {
    if (!$(e.target).closest('.card-buttons').length) {
        const id = $(this).data('id');
        const taskToView = existingData.find(item => item.id === id);
        
        // Store the task ID in the modal
        $('#taskViewModal').data('taskId', id);
        
        // Rest of your existing view modal population code...
        $('#viewTitle').text(taskToView.title);
        $('#viewDescription').text(taskToView.description);
      $('#viewDepartment').text(taskToView.departmentName || departmentMapping[taskToView.departmentId] || 'Unknown Department');
      $('#viewPriority').text(getPriorityText(taskToView.priorityLevel));
      $('#viewAssignedTo').text(taskToView.assignedToName || 'Not Assigned');
      const $status = $('#viewTaskStatus');
      $status.text(formatStatus(taskToView.status));
      $status.removeClass().addClass('task-status ' + taskToView.status);
      $('#viewStartDate').text(formatDateTimeForDisplay(taskToView.startDate));
      $('#viewEndDate').text(formatDateTimeForDisplay(taskToView.endDate));
      
      const $category = $('#viewCategory');
      $category.text(taskToView.category);
      $category.removeClass().addClass('task-category ' + taskToView.category);
      
      $('#viewCreatedAt').text(formatDateTimeForDisplay(taskToView.createdAt));
      $('#viewUpdatedAt').text(formatDateTimeForDisplay(taskToView.updatedAt));
  
      // Display the creator's information
      if (taskToView.createdBy) {
        $('#viewCreatedBy').text(`${taskToView.createdBy.firstname} ${taskToView.createdBy.lastname} (${taskToView.createdBy.department})`);
    } else {
        $('#viewCreatedBy').text('Unknown User');
    }
    
    $('#taskViewModal').modal('show');
}
});

function getPriorityText(priorityLevel) {
    switch(priorityLevel) {
      case 'critical1':
        return 'Critical 1 - Send Reminder Email Every Hour';
      case 'critical2':
        return 'Critical 2 - Send Reminder Email Every Day';
      case 'critical3':
        return 'Critical 3 - Send Reminder Email Every Week';
      default:
        return 'Unknown';
    }
  }

function formatDateForServer(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateString}`);
        return null;
    }
    const formatted = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
    return formatted;
}


    $('.task-type-filter').on('click', function() {
        const $this = $(this);
        const filter = $this.data('filter');

        if ($this.hasClass('active')) {
            $this.removeClass('active');
            activeFilters.taskType = 'all';
        } else {
            $('.task-type-filter').removeClass('active');
            $this.addClass('active');
            activeFilters.taskType = filter;
        }
        applyFilters();
    });


function getDepartmentId(departmentName) {
  if (!window.departmentData) return null;
  const department = window.departmentData.departments.find(dept => dept.name === departmentName);
  return department ? department.id : null;
}


function loadDepartmentData() {
  $.getJSON('/RGBA/warehouse/json/departments.json', function(data) {
    window.departmentData = data;
    departmentMapping = {};
    data.departments.forEach(function(department) {
      departmentMapping[department.id] = department.name;
    });
    populateDepartmentDropdown('#department');
    populateDepartmentDropdown('#editDepartment');
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading department data:', textStatus, errorThrown);
  });
}

function populateDepartmentDropdown(selectElement, selectedDepartmentId = null) {
  const departmentDropdown = $(selectElement);
  departmentDropdown.empty();
  departmentDropdown.append('<option value="">All</option>');
  
  if (window.departmentData && window.departmentData.departments) {
    window.departmentData.departments.forEach(function(department) {
      const option = $('<option>')
        .val(department.id)
        .text(department.name);
      
      if (department.id === selectedDepartmentId) {
        option.prop('selected', true);
      }
      
      departmentDropdown.append(option);
    });
  } else {
    console.error('Department data not loaded');
  }
}

$('#department').change(function() {
    if ($('input[name="assignType"]:checked').val() === 'individual') {
        populateUserSelection($(this).val());
    }
});

$(document).on('click', '.delete-btn-small', function() {
    const card = $(this).closest('.task');
    const idToDelete = card.data('id');

    $('#confirmDelete').data('id', idToDelete).data('card', card);

    $('#deleteTaskModal').modal('show');
});


$('#confirmDelete').on('click', function() {
    const idToDelete = $(this).data('id');
    const card = $(this).data('card');

    $.ajax({
        url: '/RGBA/warehouse/php/deleteTask.php',
        type: 'POST',
        data: { taskId: idToDelete },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#deleteTaskModal').modal('hide');
                loadExistingData();
            } else {
                console.error('Error deleting task:', response.message);
                alert('Failed to delete task. Please try again.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error deleting task:', status, error);
            alert('Failed to delete task. Please try again.');
        }
    });
});


const modal = $('#taskModal');

$('.grid-view').on('click', function() {
  $('.list-view').removeClass('active');
  $(this).addClass('active');
  $('#process-view').addClass('active'); 
});

$('.list-view').on('click', function() {
  $('.grid-view').removeClass('active');
  $(this).addClass('active');
  $('#process-view').removeClass('active'); 
});

$('.sidebar .nav-link').on('click', function(e) {
            e.preventDefault();
            $('.sidebar .nav-link').removeClass('active');
            $(this).addClass('active');
            const category = $(this).data('category');
            if (category === 'all') {
                updateUI(existingData);
            } else {
                const filteredTasks = existingData.filter(task => task.category === category);
                updateUI(filteredTasks);
            }
        });
    loadExistingData();
});
            