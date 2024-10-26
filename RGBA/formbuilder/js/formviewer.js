        let deleteMode = false;
        let userData = [];
        let departmentData = [];
        let userDropdownCounter = 0;
        let currentStep = 0;
        let formSections = [];
        let processViewFormData = {};

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

$('#toggleDeleteMode').click(function() {
            deleteMode = !deleteMode;
            $('.delete-checkbox').toggle(deleteMode);
            $('#deleteButton, #cancelDeleteButton').toggle(deleteMode);
            $('.list-group-item').toggleClass('delete-mode', deleteMode);
            if (deleteMode) {
                $('.form-link').on('click.deleteMode', function(e) {
                    e.preventDefault();
                });
            } else {
                $('.form-link').off('click.deleteMode');
            }
        });


        $('#cancelDeleteButton').click(function() {
            $('#toggleDeleteMode').click();
        });





        $(document).on('click', '.form-link', function(e) {
            if (deleteMode) {
                e.preventDefault();
            }
        });

$(document).ready(function() {
    $('.form-link').on('click', function(e) {
        e.preventDefault();
        var formFile = $(this).data('form');
        loadFormFromFile(formFile);
    });

    function displayForm(htmlContent, formId) {
    $("#formDisplayContainer").hide().html(htmlContent).slideDown(500, function() {
        $("#formDisplayContainer").attr('data-form-id', formId);
        setupColorPicker();
        updateSelectElementsWithDefaultOption();
        updateSelectElementsWithSubElements(); 
        loadLookupData();
        setupYesNoButtons();
        
        // Initialize User components
        loadData().then(function() {
            initializeUserComponents();
        }).catch(function(error) {
            console.error('Failed to initialize User components:', error);
            // Still try to initialize with empty data
            initializeUserComponents();
        });
        
        $('#formDisplayContainer .yes-no-container').each(function() {
            const $container = $(this);
            const $checkedRadio = $container.find('input[type="radio"]:checked');
            if ($checkedRadio.length) {
                updateYesNoContainerStyling($container, $checkedRadio.val());
            }
        });
    });
}

function initProcessView() {
    const htmlContent = $("#formDisplayContainer").html();
    const $tempContainer = $('<div>').html(htmlContent);
    processViewFormData = {};
    // Split the form into sections based on section-break-marker
    formSections = [];
    let currentSection = $('<div>');
    
    $tempContainer.children().each(function() {
        if ($(this).hasClass('section-break-marker')) {
            if (currentSection.children().length > 0) {
                formSections.push(currentSection);
                currentSection = $('<div>');
            }
        } else {
            currentSection.append($(this).clone());
        }
    });
    
    // Add the last section if it's not empty
    if (currentSection.children().length > 0) {
        formSections.push(currentSection);
    }

    currentStep = 0;

    // Hide the form and show the modal
    $("#formDisplayContainer").hide();
    $("#processViewModal").show();

    // Show the first step
    showCurrentStep();
}

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

    updateNavButtons();
    updateProgressBar();


    // Update slide counter
    $('.slide-counter').text(`Step ${currentStep + 1} of ${formSections.length}`);

    // Scroll to the top of the modal
    $(".process-view-modal").scrollTop(0);
    initializeSection($currentSection);
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

function initializeSection($section) {
    setupColorPicker($section);
    updateSelectElementsWithDefaultOption($section);
    updateSelectElementsWithSubElements($section);
    loadLookupData($section);
    setupYesNoButtons($section);
}

$("#processViewBtn").click(function() {
    if ($("#formDisplayContainer").children().length > 0) {
        showBootstrapModal('Warning', 'Starting the Process View will clear the current form. Do you want to continue?', function() {
            initProcessView();
        });
    } else {
        showBootstrapModal('No Form Loaded', 'Please load a form first.');
    }
});

$("#prevStep").click(function() {
    if (currentStep > 0) {
        showCurrentStep('prev');
    }
});


function closeProcessView() {
    showBootstrapModal('Confirm Close', 'Are you sure you want to close the Process View? Your progress will be lost.', function() {
        $("#processViewModal").hide();
        $("#formDisplayContainer").show();
        $("#processViewContainer").empty();
        currentStep = 0;
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

function loadLookupData() {
    $('#formDisplayContainer .lookup-container').each(function() {
        const $container = $(this);
        const lookupType = $container.data('lookup-type');
        const lookupId = $container.data('lookup-id');

        $.ajax({
            url: '/RGBA/warehouse/php/lookup_types.php',
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

function loadData() {
    return $.when(
        $.ajax({
            url: '/RGBA/warehouse/json/user_data.json',
            dataType: 'json',
            timeout: 5000 // 5 second timeout
        }).catch(function() {
            console.warn('Failed to load user data, using empty array');
            return [];
        }),
        $.ajax({
            url: '/RGBA/warehouse/json/departments.json',
            dataType: 'json',
            timeout: 5000 // 5 second timeout
        }).catch(function() {
            console.warn('Failed to load department data, using empty array');
            return { departments: [] };
        })
    ).then(function(userResponse, departmentResponse) {
        userData = userResponse[0] || [];
        departmentData = (departmentResponse[0] && departmentResponse[0].departments) || [];
        return { userData, departmentData };
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading data:', textStatus, errorThrown);
        return { userData: [], departmentData: [] };
    });
}

// Function to update User component
function updateUserComponent($component, initialDepartmentId) {
    // Create department select
    let $departmentSelect = $component.find('.department-select');
    if ($departmentSelect.length === 0) {
        $departmentSelect = $('<select class="form-control department-select"></select>');
        $component.append($departmentSelect);
    }
    
    // Create user select
    let $userSelect = $component.find('.user-select');
    if ($userSelect.length === 0) {
        $userSelect = $('<select class="form-control user-select" disabled></select>');
        $component.append($userSelect);
    }
    
    // Populate department select
    populateDepartments($departmentSelect, initialDepartmentId);
    
    // Populate users for the initial department
    const initialDepartment = departmentData.find(dept => dept.id === initialDepartmentId);
    if (initialDepartment) {
        populateUsers($userSelect, initialDepartment.name);
    }
    
    // Event listener for department selection
    $departmentSelect.off('change').on('change', function() {
        const selectedDepartmentId = $(this).val();
        const selectedDepartment = departmentData.find(dept => dept.id === selectedDepartmentId);
        if (selectedDepartment) {
            populateUsers($userSelect, selectedDepartment.name);
        }
    });
}

// Function to populate departments dropdown
function populateDepartments($select, initialDepartmentId) {
    $select.empty().append('<option value="">Select Department</option>');
    if (departmentData.length === 0) {
        $select.append('<option value="" disabled>No departments available</option>');
    } else {
        departmentData.forEach(dept => {
            $select.append(`<option value="${dept.id}" ${dept.id === initialDepartmentId ? 'selected' : ''}>${dept.name}</option>`);
        });
    }
}

function cleanupPreviousForm() {
    $('.user-component').off(); // Remove all event listeners from user components
    $('.user-component .user-select').remove(); // Remove any existing user select dropdowns
}

function initializeUserComponents() {
    cleanupPreviousForm(); // Clean up before initializing
    userDropdownCounter = 0; // Reset the counter

    $('.user-component').each(function() {
        const $component = $(this);
        const departmentId = $component.data('department-id');
        const $departmentInfo = $component.find('p');
        const departmentName = $departmentInfo.text().replace('Department: ', '');
        
        // Increment the global counter
        userDropdownCounter++;

        // Style the department info
        $departmentInfo.css({
            'font-weight': '500',
            'margin-bottom': '10px',
            'color': '#333'
        });

        // Create user select with a unique ID
        let $userSelect = $('<select class="form-control user-select"></select>');
        const selectId = `user-select-${userDropdownCounter}`;
        $userSelect.attr('id', selectId);
        $component.append($userSelect);
        
        // Populate users for the specified department
        populateUsers($userSelect, departmentName);

        // Store the select ID as a data attribute on the component
        $component.attr('data-select-id', selectId);
    });
}


    function populateUsers($select, departmentName) {
        $select.empty().append('<option value="">Select User</option>');
        
        const departmentUsers = userData.filter(user => user.department === departmentName);
        if (departmentUsers.length === 0) {
            $select.append('<option value="" disabled>No users available</option>');
        } else {
            departmentUsers.forEach(user => {
                $select.append(`<option value="${user.id}">${user.firstname} ${user.lastname}</option>`);
            });
        }
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

    function uploadStoredFiles() {
        const uploadPromises = [];
    
        $('.file-upload-wrapper').each(function() {
            const $wrapper = $(this);
            const file = $wrapper.data('fileToUpload');
            const originalFileName = $wrapper.data('originalFileName');
            
            if (file) {
                const uploadPromise = new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', file, originalFileName);
                    
                    $.ajax({
                        url: '/RGBA/formbuilder/php/upload_file.php',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            if (response.success) {
                                $wrapper.data('uploadedFile', response.filename);
                                resolve(response.filename);
                            } else {
                                reject(response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('Error uploading file:', error);
                            reject(error);
                        }
                    });
                });
    
                uploadPromises.push(uploadPromise);
            }
        });
    
        return Promise.all(uploadPromises);
    }

    function submitForm(isProcessView = false) {
        var formId = $('#formDisplayContainer').attr('data-form-id');
        var formData = {};
    
        if (!formId) {
            console.error('No form ID found');
            showBootstrapModal('No form Loaded', 'Please load a form first.');
            return;
        }
    
        showBootstrapModal('Confirm Submission', 'Are you sure you want to submit the form?', function() {
            // First, upload all stored files
            uploadStoredFiles().then((uploadedFilenames) => {
                if (isProcessView) {
                    saveStepData(currentStep);
                    formData = {...processViewFormData};
                }
                formData.formId = formId;
    
                var userInfo = JSON.parse(localStorage.getItem('loggedInUser')) || {};
                var userName = userInfo.firstname && userInfo.lastname ? 
                    `${userInfo.firstname}_${userInfo.lastname}` : 'Unknown';
    
                var submissionDate = new Date();
                formData.submissionDate = submissionDate.toISOString();
    
                var uniqueId = Math.random().toString(36).substr(2, 9);
    
                var filename = `${formId}_${submissionDate.getFullYear()}${(submissionDate.getMonth() + 1).toString().padStart(2, '0')}${submissionDate.getDate().toString().padStart(2, '0')}_${userName}_${uniqueId}`;
                formData.filename = filename;
    
                formData.submittedBy = userInfo.firstname && userInfo.lastname ? 
                    `${userInfo.firstname} ${userInfo.lastname}` : 'Unknown';
    
                var $formContainer = isProcessView ? $("#processViewContainer") : $("#formDisplayContainer");
    
                if (!isProcessView) {
                    $formContainer.find('input, select, textarea').each(function() {
                        var $input = $(this);
                        var name = $input.attr('name') || $input.attr('id');
                        var value = $input.val();
                        var type = $input.attr('type');
    
                        if (type === 'radio' || type === 'checkbox') {
                            if ($input.is(':checked')) {
                                if (formData[name]) {
                                    if (!Array.isArray(formData[name])) {
                                        formData[name] = [formData[name]];
                                    }
                                    formData[name].push(value);
                                } else {
                                    formData[name] = value;
                                }
                            }
                        } else if ($input.hasClass('picked-color')) {
                            formData['munsell_color'] = value;
                        } else if ($input.is('select')) {
                            formData[name] = value;
                        } else if (type === 'file') {
                            var $wrapper = $input.closest('.file-upload-wrapper');
                            var uploadedFile = $wrapper.data('uploadedFile');
                            formData[name] = uploadedFile || null; // Set to null if no file uploaded
                        } else {
                            formData[name] = value || ""; // Set to empty string if no value
                        }
                    });
    
                    // Handle dropdown selectors
                    $formContainer.find('.lookup-container select, select').each(function() {
                        var $select = $(this);
                        var lookupId = $select.closest('.lookup-container').data('lookup-id');
                        var name = $select.attr('name') || (lookupId ? 'dropdown_' + lookupId : null);
                        if (name) {
                            formData[name] = $select.val() || "";
                        }
                    });
    
                    $formContainer.find('.user-component').each(function() {
                        var $component = $(this);
                        var selectId = $component.data('select-id');
                        var $userSelect = $component.find('.user-select');
                        var selectedUserId = $userSelect.val();
                        var selectedUserName = $userSelect.find('option:selected').text();
    
                        formData[selectId] = {
                            department: $component.find('p').text().replace('Department: ', ''),
                            userId: selectedUserId || "",
                            userName: selectedUserName || ""
                        };
                    });
    
                    $formContainer.find('.yes-no-container').each(function() {
                        var $container = $(this);
                        var name = $container.attr('id') || 'yes_no_' + $container.index();
                        var $selectedButton = $container.find('.form-check.selected-yes, .form-check.selected-no');
                        formData[name] = $selectedButton.length ? ($selectedButton.hasClass('selected-yes') ? 'Yes' : 'No') : "";
                    });
                }
    
                // Ensure all file inputs are represented in the formData
                $formContainer.find('.file-upload-wrapper').each(function() {
                    var $wrapper = $(this);
                    var $fileInput = $wrapper.find('.file-input');
                    var fieldName = $fileInput.attr('name') || $fileInput.attr('id');
                    var uploadedFile = $wrapper.data('uploadedFile');
                    
                    if (!formData.hasOwnProperty(fieldName)) {
                        formData[fieldName] = uploadedFile || null;
                    }
                });
    
                $.ajax({
                    url: '/RGBA/formbuilder/php/save_submission.php',
                    method: 'POST',
                    data: JSON.stringify(formData),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            showBootstrapModal('Success', 'Form submitted successfully!');
                            localStorage.setItem('lastSubmissionFilename', response.filename);
                            if (isProcessView) {
                                $("#processViewModal").hide();
                                $("#formDisplayContainer").show();
                                $("#processViewContainer").empty();
                                currentStep = 0;
                            }
                            $("#formDisplayContainer").empty();
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

$('#nextStep').on('click', function() {
    if ($(this).text() === 'Submit') {
        submitForm(true);
    } else {
        showCurrentStep('next');
    }
});

$(".close, #processViewModal").click(function(e) {
    if (e.target === this) {
        closeProcessView();
    }
});

$('#submitForm').on('click', function(e) {
    e.preventDefault();
    submitForm(false);
});


function updateProgressBar() {
        const progress = ((currentStep + 1) / formSections.length) * 100;
        $('#progressBar').css('width', progress + '%');
        $('#currentSlide').text(currentStep + 1);
        $('#totalSlides').text(formSections.length);
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

$('#viewSubmissionsBtn').on('click', function() {
    var formId = $('#formDisplayContainer').attr('data-form-id');
    if (formId) {
        loadSubmissions(formId);
    } else {
        showBootstrapModal('No Form Loaded', 'Please load a form first.');
    }
});

function loadFormFromFile(formFile) {
    $.ajax({
        url: '/RGBA/formbuilder/php/load_form.php',
        method: 'GET',
        data: { formFile: formFile },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                cleanupPreviousForm(); // Clean up before loading new form
                displayForm(response.htmlContent, response.formId);
            } else {
                console.error("Error loading form: " + response.message);
                alert("Error loading form: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error: " + status + " - " + error);
            alert("An error occurred while loading the form.");
        }
    });
}

$('#deleteButton').click(function() {
    const selectedForms = $('.delete-checkbox:checked').map(function() {
        return $(this).data('form');
    }).get();
    
    if (selectedForms.length === 0) {
        showBootstrapModal('No Selection', 'No forms selected for deletion.');
        return;
    }
    
    showBootstrapModal('Confirm Deletion', 'Are you sure you want to delete the selected forms?', function() {
        $.ajax({
            url: '/RGBA/formbuilder/php/delete_forms.php',
            method: 'POST',
            data: { forms: selectedForms },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    showBootstrapModal('Error', 'Error deleting forms: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', status, error);
                showBootstrapModal('Error', 'An error occurred while deleting forms.');
            }
        });
    });
});

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
        displayAndStoreFile(file, $wrapper);
    } else {
        $wrapper.find('.file-chosen').text('No file chosen');
        $wrapper.find('.file-preview').remove();
        $wrapper.removeData('fileToUpload');
    }
});

function handlePhotoCapture(blob, $wrapper) {
    // Generate a random filename for the photo
    const randomName = 'photo_' + Math.random().toString(36).substring(2, 15) + '.jpg';
    const file = new File([blob], randomName, { type: "image/jpeg" });
    
    // Display the captured photo
    displayAndStoreFile(file, $wrapper);
    
    // Prepare the file for upload
    const formData = new FormData();
    formData.append('file', file, randomName);
    
    // Upload the file immediately
    $.ajax({
        url: '/RGBA/formbuilder/php/upload_file.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                $wrapper.data('uploadedFile', response.filename);
            } else {
                console.error('Failed to upload photo:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error uploading photo:', error);
        }
    });
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


function loadSubmissions(formId) {
    $.ajax({
        url: '/RGBA/formbuilder/php/get_submissions.php',
        method: 'GET',
        data: { formId: formId },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displaySubmissions(response.submissions);
            } else {
                showBootstrapModal('No Submissions', 'No submissions found for this form.');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error:', status, error);
            showBootstrapModal('Error', 'An error occurred while loading submissions.');
        }
    });
}

function displaySubmissions(submissions) {
    // Sort submissions by date, newest first
    submissions.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));

    var submissionsList = $('<ul class="list-group"></ul>');
    submissions.forEach(function(submission, index) {
        var listItem = $('<li class="list-group-item submission-item d-flex justify-content-between align-items-center"></li>');
        var submissionInfo = $('<span class="submission-info"></span>').text(`${index + 1}) ${submission.submittedBy} - ${new Date(submission.submissionDate).toLocaleString()}`);
        var deleteButton = $('<button class="btn btn-danger btn-sm delete-submission" style="display:none;"><i class="fa fa-trash"></i></button>');
        
        listItem.append(submissionInfo, deleteButton);
        listItem.data('submission', submission);
        submissionsList.append(listItem);
    });

    var modal = $('<div class="modal fade" id="submissionsModal" tabindex="-1"></div>');
    var modalDialog = $('<div class="modal-dialog modal-lg"></div>');
    var modalContent = $('<div class="modal-content"></div>');
    var modalHeader = $('<div class="modal-header"><h5 class="modal-title">Form Submissions</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>');
    var modalBody = $('<div class="modal-body"></div>').append(submissionsList);
    
    var deleteToggle = $('<button class="btn btn-primary mt-3" id="toggleDeleteSubmission">Toggle Delete Mode</button>');
    modalBody.append(deleteToggle);

    modalContent.append(modalHeader, modalBody);
    modalDialog.append(modalContent);
    modal.append(modalDialog);

    // Remove any existing modal before adding a new one
    $('#submissionsModal').remove();
    $('body').append(modal);
    
    var bootstrapModal = new bootstrap.Modal(modal[0]);
    bootstrapModal.show();

    // Add click event to submission items
    modal.on('click', '.submission-info', function() {
        var submission = $(this).closest('.submission-item').data('submission');
        openSubmissionViewer(submission);
    });

    // Toggle delete mode
    var deleteMode = false;
    modal.on('click', '#toggleDeleteSubmission', function() {
        deleteMode = !deleteMode;
        modal.find('.delete-submission').toggle(deleteMode);
        modal.find('.submission-item').toggleClass('delete-mode', deleteMode);
        $(this).text(deleteMode ? 'Cancel Delete Mode' : 'Toggle Delete Mode');
    });

    // Delete submission
    modal.on('click', '.delete-submission', function(e) {
        e.stopPropagation();
        var submissionItem = $(this).closest('.submission-item');
        var submission = submissionItem.data('submission');
        
        showBootstrapModal('Confirm Deletion', 'Are you sure you want to delete this submission?', function() {
            deleteSubmission(submission, function() {
                submissionItem.remove();
                if (modal.find('.submission-item').length === 0) {
                    bootstrapModal.hide();
                    showBootstrapModal('No Submissions', 'All submissions have been deleted.');
                }
            });
        });
    });
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

function deleteSubmission(submission, callback) {
    $.ajax({
        url: '/RGBA/formbuilder/php/delete_submission.php',
        method: 'POST',
        data: JSON.stringify({ filename: submission.filename }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                showBootstrapModal('Error', 'Error deleting submission: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error:', status, error);
            showBootstrapModal('Error', 'An error occurred while deleting the submission.');
        }
    });
}

function openSubmissionViewer(submission) {
    var viewerWindow = window.open('submission-viewer.php', '_blank');
    
    viewerWindow.onload = function() {
        viewerWindow.postMessage({
            type: 'submissionData',
            data: {
                ...submission,
                filename: submission.filename || localStorage.getItem('lastSubmissionFilename')
            }
        }, '*');
    };
}


});
