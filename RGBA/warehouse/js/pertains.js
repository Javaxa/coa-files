let currentStep = 0;
let formSections = [];
let processViewFormData = {};

function showCurrentStep(direction = 'none') {

    if (direction === 'next' && currentStep < formSections.length - 1) {
        currentStep++;
    } else if (direction === 'prev' && currentStep > 0) {
        currentStep--;
    }
    if (currentStep > 0) {
        saveStepData(currentStep - 1);
    }

    let $currentSection = $(formSections[currentStep]);
    $("#processViewContainer").empty().append($currentSection);
    $currentSection.show();

    // Always load data first before initializing components
    loadData().then(function(data) {
        userData = data.userData;
        departmentData = data.departmentData;
        
        if ($currentSection.find('.user-component').length > 0) {
            initializeUserComponents();
        }
        
        initializeSection($currentSection);
    }).catch(function(error) {
        console.error('Error loading data:', error);
        initializeSection($currentSection);
    });

    updateNavButtons();
    updateProgressBar();

    $('.slide-counter').text(`Step ${currentStep + 1} of ${formSections.length}`);
    $(".process-view-modal").scrollTop(0);
}

function initializeSection($section) {

    setupColorPicker($section);
    updateSelectElementsWithDefaultOption($section);
    updateSelectElementsWithSubElements($section);
    loadLookupData($section);
    setupYesNoButtons($section);
    
    // Double-check for user components after other initializations
    if ($section.find('.user-component').length > 0 && $section.find('.user-select').length === 0) {
        initializeUserComponents();
    }
}

// Remove initializeSection function since we've moved its contents directly into showCurrentStep

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

function setupColorPicker() {

$(document).off('click', '.color-palette-wrapper .pickable-color').on('click', '.color-palette-wrapper .pickable-color', function() {
    const $this = $(this);
    const color = $this.data('value');
    const $component = $this.closest('.actual-form.color-input-marker');
    $component.find('.color-palette-wrapper .pickable-color').removeClass('selected');
    $this.addClass('selected');
    const $colorPicker = $component.find('.picked-color');
    $colorPicker.val(color);
});

$(document).off('input', '.actual-form.color-input-marker .picked-color').on('input', '.actual-form.color-input-marker .picked-color', function() {
    const $this = $(this);
    const color = $this.val();
    const $component = $this.closest('.actual-form.color-input-marker');
    $component.find('.color-palette-wrapper .pickable-color').removeClass('selected');
    const $matchingColor = $component.find(`.color-palette-wrapper .pickable-color[data-value="${color}"]`);
    $matchingColor.addClass('selected');
});
}


function initializeUserComponents() {
    cleanupPreviousForm();
    userDropdownCounter = 0;

    $('#processViewContainer .user-component').each(function() {
        const $component = $(this);
        const departmentId = $component.data('department-id');
        const $departmentInfo = $component.find('p');
        const departmentName = $departmentInfo.text().replace('Department: ', '');
        
        userDropdownCounter++;
        
        let $userSelect = $('<select class="form-control user-select"></select>');
        const selectId = `user-select-${userDropdownCounter}`;
        $userSelect.attr('id', selectId);
        $component.append($userSelect);
        
        populateUsers($userSelect, departmentName);
        $component.attr('data-select-id', selectId);

    });
}

function updateNavButtons() {
    $("#prevStep").prop("disabled", currentStep === 0);
    if (currentStep === formSections.length - 1) {
        $("#nextStep").text("Submit").off('click').on('click', function() {
            submitForm(true);
        });
    } else {
        $("#nextStep").text("Next").off('click').on('click', function() {
            showCurrentStep('next');
        });
    }
}

$("#prevStep").click(function() {
    if (currentStep > 0) {
        showCurrentStep('prev');
    }
});



function updateSelectElementsWithDefaultOption() {
        $("#formDisplayContainer select").each(function() {
            var selectElement = $(this);
            var hasDefaultOption = selectElement.find("option[value='']").length > 0;
            if (!hasDefaultOption) {
                selectElement.prepend($('<option>', {
                    value: "",
                    text: "Select..",
                    disabled: true,
                    selected: true
                }));
            }
        });
    }

    function updateSelectElementsWithSubElements() {
    $('#formDisplayContainer .lookup-container').each(function() {
        const $container = $(this);
        const lookupId = $container.data('lookup-id');
        if (lookupId) {
            loadLookupData();
        }
    });
}

function cleanupPreviousForm() {
    $('.user-component').off(); // Remove all event listeners from user components
    $('.user-component .user-select').remove(); // Remove any existing user select dropdowns
}


function updateOrCreateDropdown($container, data) {
    let $select = $container.find('select');
    if ($select.length === 0) {
        // If select doesn't exist, create it
        $select = $('<select class="form-control"></select>');
        $container.append($select);
    }
    
    let optionsHtml = '<option value="" disabled selected>Select an option</option>';
    data.forEach(function(option) {
        optionsHtml += `<option value="${option.id}">${option.name}</option>`;
    });
    
    $select.html(optionsHtml);
}

function updateCheckboxOrRadio($container, data, type) {
    // Remove existing options
    $container.find('.form-check').remove();
    
    let optionsHtml = '';
    data.forEach(function(option) {
        const uniqueId = `option_${type}_${option.id}`;
        optionsHtml += `
            <div class="form-check">
                <input class="form-check-input" type="${type}" name="options_${type}" id="${uniqueId}" value="${option.id}">
                <label class="form-check-label" for="${uniqueId}">${option.name}</label>
            </div>
        `;
    });
    
    $container.append(optionsHtml);
}

const formCloseConfirmationHTML = `
<div class="modal fade" id="formCloseConfirmation" tabindex="-1" aria-labelledby="formCloseConfirmationLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="formCloseConfirmationLabel">Close Form?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>You have unsaved changes. What would you like to do?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue Editing</button>
                <button type="button" class="btn btn-danger btn-blue" id="discardChanges">Discard Changes</button>
                <button type="button" class="btn btn-primary" id="submitForm">Submit Form</button>
            </div>
        </div>
    </div>
</div>`;

// Add the modal to the document body
$('body').append(formCloseConfirmationHTML);

// Function to show the close confirmation modal
function showCloseConfirmation() {
    const closeConfirmationModal = new bootstrap.Modal(document.getElementById('formCloseConfirmation'));
    closeConfirmationModal.show();

    // Handle discard changes
    $('#discardChanges').off('click').on('click', function() {
        closeConfirmationModal.hide();
        $("#processViewModal").hide();
        resetProcessView();
    });

    // Handle submit form
    $('#submitForm').off('click').on('click', function() {
        closeConfirmationModal.hide();
        submitForm();
    });
}



function submitForm() {
    // Save data from the current step before submission
    saveStepData(currentStep);
    
    // Ensure formId exists in processViewFormData
    if (!processViewFormData.formId) {
        const $currentSection = $(formSections[currentStep]);
        processViewFormData.formId = $currentSection.attr('data-form-id') || 
                                   $currentSection.closest('[data-form-id]').attr('data-form-id') ||
                                   'default_form';
    }

    showBootstrapModal('Confirm Submission', 'Are you sure you want to submit the form?', function() {
        // First, upload all stored files
        uploadStoredFiles().then((uploadedFilenames) => {
            // Add user and submission metadata
            var userInfo = JSON.parse(localStorage.getItem('loggedInUser')) || {};
            var userName = userInfo.firstname && userInfo.lastname ? 
                `${userInfo.firstname}_${userInfo.lastname}` : 'Unknown';

            var submissionDate = new Date();
            processViewFormData.submissionDate = submissionDate.toISOString();

            var uniqueId = Math.random().toString(36).substr(2, 9);
            var filename = `${processViewFormData.formId}_${submissionDate.getFullYear()}${(submissionDate.getMonth() + 1).toString().padStart(2, '0')}${submissionDate.getDate().toString().padStart(2, '0')}_${userName}_${uniqueId}`;
            processViewFormData.filename = filename;

            processViewFormData.submittedBy = userInfo.firstname && userInfo.lastname ? 
                `${userInfo.firstname} ${userInfo.lastname}` : 'Unknown';

            // Submit the form data
            $.ajax({
                url: '/formbuilder/php/save_submission.php',
                method: 'POST',
                data: JSON.stringify(processViewFormData),
                contentType: 'application/json',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showBootstrapModal('Success', 'Form submitted successfully!');
                        localStorage.setItem('lastSubmissionFilename', response.filename);
                        
                        // Close and reset the process view
                        $("#processViewModal").hide();
                        resetProcessView();
                    } else {
                        showBootstrapModal('Error', 'Error submitting form: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX error:', status, error);
                    showBootstrapModal('Error', 'An error occurred while submitting the form.');
                }
            });
        }).catch((error) => {
            console.error('Error uploading files:', error);
            showBootstrapModal('Error', 'An error occurred while uploading files.');
        });
    }, null, 'confirmSubmission');
}

$(document).on('click', '.file-label', function(e) {
    e.preventDefault();
    const $fileInput = $(this).siblings('.file-input');
    const $wrapper = $(this).closest('.file-upload-wrapper');
    
    showBootstrapModal('Upload Options', 'Would you like to take a photo or upload a file?', 
        function(action) {
            if (action === 'upload') {
                $fileInput.click();
            }
        }, 
        function(action) {
            if (action === 'photo') {
                openCamera($wrapper);
            }
        },
        'uploadOptions'
    );
});

function openCamera($wrapper) {
    // Create camera elements
    const $cameraModal = $(`
        <div class="modal fade" id="cameraModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Take Photo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <video id="video" width="100%" autoplay></video>
                        <canvas id="canvas" style="display:none;"></canvas>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="captureBtn">Capture</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $('body').append($cameraModal);
    const modal = new bootstrap.Modal($cameraModal[0]);
    modal.show();

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err) {

            showBootstrapModal('Camera Error', 'Unable to access the camera. Please make sure you have given permission to use the camera.');
        });

        captureBtn.addEventListener('click', function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to blob
            canvas.toBlob(function(blob) {
                handlePhotoCapture(blob, $wrapper);
                modal.hide();
                
                // Stop all video streams
                video.srcObject.getTracks().forEach(track => track.stop());
            }, 'image/jpeg');
        });

    $cameraModal.on('hidden.bs.modal', function() {
        // Stop all video streams when modal is closed
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        $cameraModal.remove();
    });
}


$(document).on('change', '.file-input', function() {
    const file = this.files[0];
    const $wrapper = $(this).closest('.file-upload-wrapper');
    
    if (file) {
        handleFileUpload(file, $wrapper);
    } else {
        $wrapper.find('.file-chosen').text('No file chosen');
        $wrapper.find('.file-preview').remove();
        $wrapper.removeData('fileToUpload');
    }
});


function handlePhotoCapture(blob, $wrapper) {
    const timestamp = new Date().getTime();
    const file = new File([blob], `photo_${timestamp}.jpg`, { type: 'image/jpeg' });
    handleFileUpload(file, $wrapper);
}

function displayAndStoreFile(file, $wrapper) {
    const $fileChosen = $wrapper.find('.file-chosen');
    $fileChosen.text(file.name);
    
    // Display preview
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $wrapper.find('.file-preview').remove(); // Remove existing preview
            $wrapper.append(`<div class="file-preview"><img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;"></div>`);
        }
        reader.readAsDataURL(file);
    } else {
        $wrapper.find('.file-preview').remove(); // Remove existing preview
        $wrapper.append(`<div class="file-preview"><i class="fa fa-file"></i> ${file.name}</div>`);
    }
    
    // Store the file for later upload (for uploaded files) or reference (for captured photos)
    $wrapper.data('fileToUpload', file);
    $wrapper.data('originalFileName', file.name);
}

function displayFilePreview(file, $wrapper) {
    const $fileChosen = $wrapper.find('.file-chosen');
    $fileChosen.text(file.name);
    
    // Remove existing preview
    $wrapper.find('.file-preview').remove();
    
    // Create preview container
    const $preview = $('<div class="file-preview"></div>');
    
    // Add loading indicator
    $preview.append('<div class="upload-status"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $preview.prepend(`
                <div class="file-info">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">
                    <div class="file-name mt-2">${file.name}</div>
                </div>
            `);
        };
        reader.readAsDataURL(file);
    } else {
        $preview.prepend(`
            <div class="file-info">
                <i class="fas fa-file fa-2x"></i>
                <div class="file-name mt-2">${file.name}</div>
            </div>
        `);
    }
    
    $wrapper.append($preview);
}


function handleFileUpload(file, $wrapper) {
    // Display preview immediately
    displayFilePreview(file, $wrapper);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the file
    $.ajax({
        url: '/formbuilder/php/upload_file.php',  // Use consistent path
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            try {
                const result = typeof response === 'string' ? JSON.parse(response) : response;
                if (result.success) {
                    console.log('File uploaded successfully:', result);
                    $wrapper.data('uploadedFile', result.filename);
                    
                    // Update preview with success status
                    const $preview = $wrapper.find('.file-preview');
                    const $status = $preview.find('.upload-status') || $('<div class="upload-status"></div>').appendTo($preview);
                    $status.html(`
                        <div class="text-success">
                            <i class="fas fa-check"></i> Upload complete
                        </div>
                    `);
                } else {
                    console.error('Upload failed:', result.message);
                    showUploadError($wrapper, result.message);
                }
            } catch (e) {
                console.error('Error processing response:', e);
                showUploadError($wrapper, 'Error processing server response');
            }
        },
        error: function(xhr, status, error) {
            console.error('Upload failed:', error);
            showUploadError($wrapper, 'Failed to upload file');
        }
    });
}

// Update the uploadStoredFiles function to use the same path
function showUploadError($wrapper, message) {
    const $preview = $wrapper.find('.file-preview');
    const $status = $preview.find('.upload-status') || $('<div class="upload-status"></div>').appendTo($preview);
    $status.html(`
        <div class="text-danger">
            <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
    `);
}

// Update the stored files upload function to use the same handler
function uploadStoredFiles() {
    const uploadPromises = [];

    $('.file-upload-wrapper').each(function() {
        const $wrapper = $(this);
        const file = $wrapper.data('fileToUpload');
        
        if (file && !$wrapper.data('uploadedFile')) {
            const uploadPromise = new Promise((resolve, reject) => {
                handleFileUpload(file, $wrapper);
                // Listen for changes to uploadedFile data
                const checkInterval = setInterval(() => {
                    const uploadedFile = $wrapper.data('uploadedFile');
                    if (uploadedFile) {
                        clearInterval(checkInterval);
                        resolve(uploadedFile);
                    }
                }, 100);
                
                // Set timeout to avoid infinite waiting
                setTimeout(() => {
                    clearInterval(checkInterval);
                    reject('Upload timeout');
                }, 30000);
            });

            uploadPromises.push(uploadPromise);
        } else if ($wrapper.data('uploadedFile')) {
            uploadPromises.push(Promise.resolve($wrapper.data('uploadedFile')));
        }
    });

    return Promise.all(uploadPromises);
}

    function updateYesNoContainerStyling($container, value) {
            const $yesCheck = $container.find('.form-check:has(input[value="Yes"])');
            const $noCheck = $container.find('.form-check:has(input[value="No"])');

            if (value === 'Yes') {
                $yesCheck.addClass('selected-yes');
                $noCheck.removeClass('selected-no');
            } else if (value === 'No') {
                $noCheck.addClass('selected-no');
                $yesCheck.removeClass('selected-yes');
            } else {
                $yesCheck.removeClass('selected-yes');
                $noCheck.removeClass('selected-no');
            }
        }


    function loadLookupData() {
    $('#formDisplayContainer .lookup-container, #processViewContainer .lookup-container').each(function() {
        const $container = $(this);
        const lookupType = $container.data('lookup-type');
        const lookupId = $container.data('lookup-id');

        $.ajax({
            url: '/RGBA/warehouse/php/lookup_types.php',  // Correct path
            method: 'GET',
            data: { lookupTypeId: lookupId },
            dataType: 'json',
            success: function(response) {
                if (response.success && Array.isArray(response.data)) {
                    if (lookupType === 'dropdown') {
                        updateOrCreateDropdown($container, response.data);
                    } else {
                        updateCheckboxOrRadio($container, response.data, lookupType);
                    }
                } else {
                    console.error('Failed to load lookup data:', response.message);
                    $container.append('<p>Failed to load options</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading lookup data:', status, error);
                $container.append('<p>Error loading options</p>');
            }
        });
    });
}

function loadData() {
    return $.when(
        $.ajax({
            url: '/RGBA/warehouse/json/user_data.json',  // Correct path
            dataType: 'json',
            timeout: 5000
        }).catch(function() {
            console.warn('Failed to load user data, using empty array');
            return [];
        }),
        $.ajax({
            url: '/RGBA/warehouse/json/departments.json',  // Correct path
            dataType: 'json',
            timeout: 5000
        }).catch(function() {
            console.warn('Failed to load department data, using empty array');
            return { departments: [] };
        })
    ).then(function(userResponse, departmentResponse) {
        userData = userResponse[0] || [];
        departmentData = (departmentResponse[0] && departmentResponse[0].departments) || [];
        return { userData, departmentData };
    });
}

function setupYesNoButtons() {
    $(document).off('click', '.yes-no-container .form-check').on('click', '.yes-no-container .form-check', function() {
        const $container = $(this).closest('.yes-no-container');
        const $input = $(this).find('input[type="radio"]');
        
        $container.find('.form-check').removeClass('selected-yes selected-no');
        $input.prop('checked', true);
        
        if ($input.val() === 'Yes') {
            $(this).addClass('selected-yes');
        } else {
            $(this).addClass('selected-no');
        }
        
        updateYesNoContainerStyling($container, $input.val());
    });
}

$(document).off('click', '#processViewModal .close').on('click', '#processViewModal .close', function(e) {
    e.preventDefault();
    showCloseConfirmation();
});



    function resetProcessView() {
    $("#processViewContainer").empty();
    currentStep = 0;
    processViewFormData = {};
    formSections = [];
}

function saveStepData(stepIndex) {
    let $stepContainer = $(formSections[stepIndex]);
    
    // Handle all input types
    $stepContainer.find('input, select, textarea').each(function() {
        let $input = $(this);
        let name = $input.attr('name') || $input.attr('id');
        let value = $input.val();
        let type = $input.attr('type');

        if (type === 'radio' || type === 'checkbox') {
            if ($input.is(':checked')) {
                processViewFormData[name] = value;
            }
        } else if ($input.hasClass('picked-color')) {
            processViewFormData['munsell_color'] = value;
        } else if ($input.is('select')) {
            processViewFormData[name] = value;
        } else {
            processViewFormData[name] = value;
        }
    });

    $stepContainer.find('.file-upload-wrapper').each(function() {
        var $wrapper = $(this);
        var $fileInput = $wrapper.find('.file-input');
        var fieldName = $fileInput.attr('name') || $fileInput.attr('id');
        var uploadedFile = $wrapper.data('uploadedFile');
        
        if (uploadedFile) {
            processViewFormData[fieldName] = uploadedFile;
        }
    });


    $stepContainer.find('.lookup-container select, select').each(function() {
        var $select = $(this);
        var lookupId = $select.closest('.lookup-container').data('lookup-id');
        var name = $select.attr('name') || (lookupId ? 'dropdown_' + lookupId : null);
        if (name) {
            processViewFormData[name] = $select.val();
        }
    });

    // Handle color palette
    $stepContainer.find('.color-palette-wrapper .pickable-color.selected').each(function() {
        let $selectedColor = $(this);
        processViewFormData['munsell_color'] = $selectedColor.data('value');
    });

    // Handle user components
    $stepContainer.find('.user-component').each(function() {
        var $component = $(this);
        var selectId = $component.data('select-id');
        var $userSelect = $component.find('.user-select');
        var selectedUserId = $userSelect.val();
        var selectedUserName = $userSelect.find('option:selected').text();

        processViewFormData[selectId] = {
            department: $component.find('p').text().replace('Department: ', ''),
            userId: selectedUserId,
            userName: selectedUserName
        };
    });

    $stepContainer.find('.yes-no-container').each(function() {
        var $container = $(this);
        var name = $container.attr('id') || 'yes_no_' + $container.index();
        var $selectedButton = $container.find('.form-check.selected-yes, .form-check.selected-no');
        if ($selectedButton.length) {
            processViewFormData[name] = $selectedButton.hasClass('selected-yes') ? 'Yes' : 'No';
        }
    });
}

function populateUsers($select, departmentName) {
    
    $select.empty().append('<option value="">Select User</option>');
    
    const departmentUsers = userData.filter(user => {
        return user.department === departmentName;
    });
     
    if (departmentUsers.length === 0) {
        $select.append('<option value="" disabled>No users available</option>');
    } else {
        departmentUsers.forEach(user => {
            $select.append(`<option value="${user.id}">${user.firstname} ${user.lastname}</option>`);
        });
    }
}

$('.slide-counter').on('click', function() {
        showStepNavigation();
    });

    function showStepNavigation() {
        let navigationHtml = '<div class="step-navigation">';
        for (let i = 0; i < formSections.length; i++) {
            navigationHtml += `<div class="step-block" data-step="${i}">Step ${i + 1}</div>`;
        }
        navigationHtml += '</div>';
    
        let modal = $('<div class="modal fade" id="stepNavigationModal" tabindex="-1" role="dialog">');
        let modalDialog = $('<div class="modal-dialog" role="document">');
        let modalContent = $('<div class="modal-content">');
        let modalHeader = $('<div class="modal-header"><h5 class="modal-title">Navigate to Step</h5><button type="button" class="close" data-dismiss="modal">&times;</button></div>');
        let modalBody = $('<div class="modal-body">').html(navigationHtml);
    
        modalContent.append(modalHeader, modalBody);
        modalDialog.append(modalContent);
        modal.append(modalDialog);
    
        $('body').append(modal);
        modal.modal('show');
    
        // Add click event to step blocks
        $('.step-block').off('click').on('click', function() {
            let targetStep = $(this).data('step');
            
            // Simulate next button behavior for data storage
            $("#nextStep").trigger('click');
            
            // Override navigation to target step
            currentStep = targetStep;
            showCurrentStep();
            
            modal.modal('hide');
        });
    }
    
    // Update slide counter click handler
    $('.slide-counter').off('click').on('click', function() {
        // Simulate next button click for data storage
        $("#nextStep").trigger('click');
        showStepNavigation();
    });


function updateProgressBar() {
        const progress = ((currentStep + 1) / formSections.length) * 100;
        $('#progressBar').css('width', progress + '%');
        $('#currentSlide').text(currentStep + 1);
        $('#totalSlides').text(formSections.length);
    }

    $(document).ready(function() {
        let tasks = [];
        let currentViewType = 'users'; // Default to user's tasks
        let currentDelegationType = 'all';
        let loggedInUser = null;
    
        function initializeUserData() {
            loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                console.error('No logged in user found');
                return false;
            }
            return true;
        }
    
        // Load tasks data
        function loadTasks() {
            if (!initializeUserData()) return;
    
            $.getJSON('json/process_data.json?' + new Date().getTime(), function(data) {
                tasks = data;
                updateTasksList();
                updateFilterSection();
            });
        }
    
        function updateFilterSection() {
            const $assigneesList = $('#assigneesList');
            $assigneesList.empty();
            
            // Add user section
            $assigneesList.append(`
                <div class="mb-2 mt-3"><strong>My Tasks</strong></div>
                <div class="assignee-item" data-type="user">
                    <div>${loggedInUser.firstname} ${loggedInUser.lastname}</div>
                    <div class="assignee-type">${loggedInUser.department}</div>
                    <span class="assignee-count">${getTaskCount('user')} tasks</span>
                </div>
            `);
    
            // Add department section
            $assigneesList.append(`
                <div class="mb-2 mt-3"><strong>Department Tasks</strong></div>
                <div class="assignee-item" data-type="department">
                    <div>${loggedInUser.department}</div>
                    <span class="assignee-count">${getTaskCount('department')} tasks</span>
                </div>
            `);
        }
    
        function getTaskCount(type) {
            if (type === 'user') {
                return tasks.filter(task => String(task.assignedToId) === String(loggedInUser.id)).length;
            } else {
                return tasks.filter(task => 
                    task.departmentName === loggedInUser.department && 
                    (!task.assignedToName || String(task.assignedToId) !== String(loggedInUser.id))
                ).length;
            }
        }
    
        function updateTasksList() {
            const $tasksList = $('#tasksList');
            $tasksList.empty();
    
            let filteredTasks = tasks.filter(task => {
                if (currentViewType === 'users') {
                    return String(task.assignedToId) === String(loggedInUser.id);
                } else if (currentViewType === 'departments') {
                    return task.departmentName === loggedInUser.department && 
                           (!task.assignedToName || String(task.assignedToId) !== String(loggedInUser.id));
                }
                return (String(task.assignedToId) === String(loggedInUser.id)) || 
                       (task.departmentName === loggedInUser.department);
            });
    
            if (currentDelegationType !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.delegationType === currentDelegationType);
            }
    
            if (filteredTasks.length === 0) {
                $tasksList.append(`
                    <div class="alert alert-info">
                        No ${currentViewType === 'users' ? 'personal' : 'department'} tasks found.
                    </div>
                `);
                return;
            }
    
            filteredTasks.forEach(task => {
                $tasksList.append(`
                    <div class="task-card" data-id="${task.id}">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="mb-0">${task.title}</h5>
                            <span class="task-status status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                        </div>
                        <p>${task.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <small class="text-muted">
                                    <i class="fas fa-${getDelegationIcon(task.delegationType)}"></i>
                                    ${task.delegationType}
                                    ${task.attachedForm ? '<i class="fas fa-paperclip ms-1" title="Form attached"></i>' : ''}
                                </small>
                            </div>
                            <div>
                                <small class="text-muted">
                                    <i class="fas fa-${task.assignedToName ? 'user' : 'building'}"></i>
                                    ${task.assignedToName || task.departmentName}
                                </small>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    
        function getDelegationIcon(type) {
            switch (type) {
                case 'attachForm': return 'file-alt';
                case 'document': return 'upload';
                case 'dependency': return 'link';
                default: return 'tasks';
            }
        }
    
        // Event handlers for view type toggle
        $('.view-type-toggle button').click(function() {
            $('.view-type-toggle button').removeClass('active');
            $(this).addClass('active');
            currentViewType = $(this).data('view');
            updateTasksList();
        });
    
        // Event handlers for delegation type
        $('.delegation-type').click(function() {
            $('.delegation-type').removeClass('active');
            $(this).addClass('active');
            currentDelegationType = $(this).data('type');
            updateTasksList();
        });
    
        // Initial load
        loadTasks();



            // Process assignees from tasks
 function processAssignees() {
    const users = new Map();
    const departments = new Map();

    tasks.forEach(task => {
        if (task.assignedToName) {
            users.set(task.assignedToId, {
                id: task.assignedToId,
                name: task.assignedToName,
                department: task.departmentName,
                type: 'user'
            });
        } else if (task.departmentId) {
            departments.set(task.departmentId, {
                id: task.departmentId,
                name: task.departmentName,
                type: 'department'
            });
        }
    });

    updateAssigneesList(Array.from(users.values()), Array.from(departments.values()));
}

            // Update assignees list in sidebar
            function updateAssigneesList(users, departments) {
                const $assigneesList = $('#assigneesList');
                $assigneesList.empty();

                if (currentViewType === 'all' || currentViewType === 'users') {
                    $assigneesList.append('<div class="mb-2 mt-3"><strong>Users</strong></div>');
                    users.forEach(user => {
                        const tasksCount = tasks.filter(t => t.assignedToId === user.id).length;
                        $assigneesList.append(`
                            <div class="assignee-item ${selectedAssignee?.id === user.id ? 'active' : ''}" 
                                 data-id="${user.id}" 
                                 data-type="user">
                                <div>${user.name}</div>
                                <div class="assignee-type">${user.department}</div>
                                <span class="assignee-count">${tasksCount} tasks</span>
                            </div>
                        `);
                    });
                }

                if (currentViewType === 'all' || currentViewType === 'departments') {
                    $assigneesList.append('<div class="mb-2 mt-3"><strong>Departments</strong></div>');
                    departments.forEach(dept => {
                        const tasksCount = tasks.filter(t => t.departmentId === dept.id && !t.assignedToName).length;
                        $assigneesList.append(`
                            <div class="assignee-item ${selectedAssignee?.id === dept.id ? 'active' : ''}" 
                                 data-id="${dept.id}" 
                                 data-type="department">
                                <div>${dept.name}</div>
                                <span class="assignee-count">${tasksCount} tasks</span>
                            </div>
                        `);
                    });
                }
            }

            function updateTasksList() {
                const $tasksList = $('#tasksList');
                $tasksList.empty();
            
                let filteredTasks = tasks.filter(task => {
                    if (currentViewType === 'users') {
                        return String(task.assignedToId) === String(loggedInUser.id);
                    } else if (currentViewType === 'departments') {
                        return task.departmentName === loggedInUser.department && 
                               (!task.assignedToName || String(task.assignedToId) !== String(loggedInUser.id));
                    }
                    return (String(task.assignedToId) === String(loggedInUser.id)) || 
                           (task.departmentName === loggedInUser.department);
                });
            
                if (currentDelegationType !== 'all') {
                    filteredTasks = filteredTasks.filter(task => task.delegationType === currentDelegationType);
                }
            
                // Load user data for profile pictures
                $.ajax({
                    url: '/RGBA/warehouse/json/user_data.json',
                    method: 'GET',
                    dataType: 'json',
                    success: function(userData) {
                        filteredTasks.forEach(task => {
                            const user = userData.find(u => String(u.id) === String(task.assignedToId));
                            
                            if (task.delegationType === 'attachForm' && task.attachedForm) {
                                const formId = task.attachedForm.split('-')[0];
                                $.ajax({
                                    url: '/formbuilder/php/get_form_list.php',
                                    method: 'GET',
                                    data: { formId: formId },
                                    dataType: 'json',
                                    success: function(response) {
                                        renderTaskCard(task, response.success ? response.form : null, user);
                                    },
                                    error: function() {
                                        renderTaskCard(task, null, user);
                                    }
                                });
                            } else {
                                renderTaskCard(task, null, user);
                            }
                        });
                    },
                    error: function() {
                        filteredTasks.forEach(task => renderTaskCard(task, null, null));
                    }
                });
            
                if (filteredTasks.length === 0) {
                    $tasksList.append(`
                        <div class="alert alert-info">
                            No ${currentViewType === 'users' ? 'personal' : 'department'} tasks found.
                        </div>
                    `);
                }
            }
            
            function renderTaskCard(task, formData, user) {
                const $tasksList = $('#tasksList');
                
                let delegationDisplay = '';
                let formDisplay = '';
                
                if (task.delegationType === 'attachForm') {
                    if (task.attachedForm && formData) {
                        formDisplay = `
                            <span class="ms-2 badge bg-info" title="Attached Form">
                                <i class="fas fa-paperclip"></i> ${formData.name || 'Form'}
                            </span>
                        `;
                    } else {
                        formDisplay = `
                            <span class="ms-2" style="color: #6c757d;">
                                <i class="fas fa-file-alt"></i> No Form
                            </span>
                        `;
                    }
                } else {
                    delegationDisplay = `
                        <i class="fas fa-${getDelegationIcon(task.delegationType)}"></i>
                        ${task.delegationType}
                    `;
                }
            
                let assigneeDisplay = '';
                if (task.assignedToName && user && user.profilePicture) {
                    assigneeDisplay = `
                        <div class="d-flex align-items-center">
                            <img src="/RGBA/warehouse/${user.profilePicture}" 
                                 alt="${task.assignedToName}" 
                                 style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 8px;"
                                 onerror="this.onerror=null; this.src='/RGBA/warehouse/images/user.jpg'; this.style.display='none'; this.nextElementSibling.style.display='inline-block';"
                            >
                            <i class="fas fa-user" style="display: none; margin-right: 8px;"></i>
                            <span>${task.assignedToName}</span>
                        </div>
                    `;
                } else {
                    assigneeDisplay = `
                        <div class="d-flex align-items-center">
                            <i class="fas fa-${task.assignedToName ? 'user' : 'building'}" style="margin-right: 8px;"></i>
                            <span>${task.assignedToName || task.departmentName}</span>
                        </div>
                    `;
                }
            
                const cardHtml = `
                    <div class="task-card" data-id="${task.id}">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="mb-0">${task.title}</h5>
                            <span class="task-status status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                        </div>
                        <p>${task.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <small class="text-muted">
                                    ${delegationDisplay}
                                    ${formDisplay}
                                </small>
                            </div>
                            <div>
                                <small class="text-muted">
                                    ${assigneeDisplay}
                                </small>
                            </div>
                        </div>
                    </div>
                `;
            
                // Check if the card already exists
                const existingCard = $tasksList.find(`[data-id="${task.id}"]`);
                if (existingCard.length) {
                    existingCard.replaceWith(cardHtml);
                } else {
                    $tasksList.append(cardHtml);
                }
            }
            
            // Add click handler for task cards
          // Keep the updateTasksList and renderTaskCard functions as they are, but replace the click handler:

$(document).on('click', '.task-card', function(e) {
    if ($(e.target).closest('.card-buttons').length) {
        return;
    }

    const taskId = $(this).data('id');
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        console.error('Task not found:', taskId);
        showBootstrapModal('Error', 'Could not find task details');
        return;
    }
    
    if (task.delegationType === 'attachForm') {
        if (task.attachedForm) {
            $.ajax({
                url: `../formbuilder/forms/${task.attachedForm}`,
                type: 'GET',
                success: function(response) {
                    try {
                        const formData = JSON.parse(response);
                        const htmlContent = formData.htmlContent;
                        
                        // Store the form ID in processViewFormData immediately
                        processViewFormData = {
                            formId: formData.formId || task.attachedForm.replace('.json', '')
                        };
                        
                        const $tempContainer = $('<div>').html(htmlContent);
                        $tempContainer.attr('data-form-id', processViewFormData.formId);
                        
                        formSections = [];
                        let currentSection = $('<div>');
                        currentSection.attr('data-form-id', processViewFormData.formId);
                        
                        $tempContainer.children().each(function() {
                            if ($(this).hasClass('section-break-marker')) {
                                if (currentSection.children().length > 0) {
                                    formSections.push(currentSection);
                                    currentSection = $('<div>');
                                    currentSection.attr('data-form-id', processViewFormData.formId);
                                }
                            } else {
                                currentSection.append($(this).clone());
                            }
                        });
                        
                        if (currentSection.children().length > 0) {
                            formSections.push(currentSection);
                        }

                        currentStep = 0;
                        
                        // Show the process view modal
                        $("#processViewModal").show();
                        
                        showCurrentStep();
                        
                        setTimeout(() => {
                            loadData().then(function(data) {
                                userData = data.userData;
                                departmentData = data.departmentData;
                                showCurrentStep();
                            }).catch(function(error) {
                                console.error('Failed to load user/department data:', error);
                                showCurrentStep();
                            });
                        }, 100);
                        
                        $('#totalSlides').text(formSections.length);
                        
                    } catch (e) {
                        console.error('Error parsing form data:', e);
                        showBootstrapModal('Error', 'Failed to parse form content');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error loading form:', error);
                    showBootstrapModal('Error', 'Failed to load the attached form');
                }
            });
        } else {
            showBootstrapModal('Info', 'No form is currently attached to this task.');
        }
    }
});
            
            function getDelegationIcon(type) {
                switch (type) {
                    case 'attachForm': return 'file-alt';
                    case 'document': return 'upload';
                    case 'dependency': return 'link';
                    default: return 'tasks';
                }
            }

             // Event handler for assignee selection
             $(document).on('click', '.assignee-item', function() {
    const $this = $(this);
    $('.assignee-item').removeClass('active');
    
    const clickedId = $this.data('id');
    const clickedType = $this.data('type');
    
    if (selectedAssignee && String(selectedAssignee.id) === String(clickedId)) {
        selectedAssignee = null;
    } else {
        $this.addClass('active');
        selectedAssignee = {
            id: clickedId,
            type: clickedType
        };
    }
    updateTasksList();
});

    // Other event handlers remain unchanged
    $('.view-type-toggle button').click(function() {
        $('.view-type-toggle button').removeClass('active');
        $(this).addClass('active');
        currentViewType = $(this).data('view');
        processAssignees();
        updateTasksList();
    });

    $('.delegation-type').click(function() {
        $('.delegation-type').removeClass('active');
        $(this).addClass('active');
        currentDelegationType = $(this).data('type');
        updateTasksList();
    });


            // Initial load
            loadTasks();
        });