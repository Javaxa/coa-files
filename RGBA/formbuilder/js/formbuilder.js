let highestComponentId = 0;
let isEditing = false;
let hasUnsavedChanges = false;	

    $('#html-btn').click(function() {
        saveHtml();
    });

    function makeInputsReadOnly() {
        $('.actual-form input, .actual-form textarea').attr('readonly', true);
        $('.actual-form select').prop('disabled', true);
    }

    function setCurrentOpenedForm(formName, formId) {
        currentOpenedForm = {
            name: formName,
            id: formId
        };
    }

document.addEventListener("DOMContentLoaded", function() {
      var formViewButton = document.getElementById("form-view");
      formViewButton.addEventListener("click", function() {
          window.open("form-viewer", "_blank");
      });
  });

  


  $(document).ready(function() {
    let componentId = 0; 
    var currentEditingComponentId; 
    $(".component-card").draggable({
        helper: "clone",
        revert: "invalid",
        cursor: "grabbing",
        start: function(event, ui) {
            $('<div class="drop-indicator"></div>').hide().appendTo('.component-box');
        },
        drag: function(event, ui) {
            var $dropTarget = $('.component-box');
            var dropPosition = ui.offset.top - $dropTarget.offset().top;
            var $indicator = $('.drop-indicator');
    
            $dropTarget.find('.form-component').each(function() {
                var componentTop = $(this).position().top;
                var componentHeight = $(this).outerHeight();
                var componentMiddle = componentTop + (componentHeight / 2);
    
                if (dropPosition < componentMiddle) {
                    $indicator.show().insertBefore($(this));
                    return false;
                } else if ($(this).is(':last-child')) {
                    $indicator.show().insertAfter($(this));
                }
            });
    
            if ($dropTarget.children().length === 0) {
                $indicator.show().appendTo($dropTarget);
            }
        },
        stop: function(event, ui) {
            $('.drop-indicator').remove();
        }
    });

    $(".component-box").droppable({
        accept: ".component-card",
        greedy: true,
        tolerance: "pointer",
        drop: function(event, ui) {
            var $dropTarget = $(this);
            var $draggable = ui.draggable;
            var dropPosition = ui.offset.top - $dropTarget.offset().top;
            var closestComponent = null;
            var insertAfter = false;
    
            highestComponentId++;
            var componentTitle = $draggable.find("p").text();
            var iconHtml = $draggable.find("svg, .fa").prop('outerHTML') || '';
            var componentType = getComponentType(componentTitle);
            var markerClass = getMarkerClass(componentType);
            var newComponent = createNewComponentElement(highestComponentId, componentType, componentTitle, iconHtml, markerClass);
    
            // Check if the component-box is empty
            if ($dropTarget.children('.form-component').length === 0) {
                $dropTarget.append(newComponent);
            } else {
                // Check if we should insert at the top
                if (dropPosition < $dropTarget.find('.form-component:first').position().top) {
                    newComponent.prependTo($dropTarget);
                } else {
                    $dropTarget.find('.form-component').each(function() {
                        var componentTop = $(this).position().top;
                        var componentHeight = $(this).outerHeight();
                        var componentMiddle = componentTop + (componentHeight / 2);
    
                        if (dropPosition > componentMiddle) {
                            closestComponent = $(this);
                            insertAfter = true;
                        } else {
                            return false; // Break the loop
                        }
                    });
    
                    if (closestComponent) {
                        if (insertAfter) {
                            newComponent.insertAfter(closestComponent);
                        } else {
                            newComponent.insertBefore(closestComponent);
                        }
                    } else {
                        $dropTarget.append(newComponent);
                    }
                }
            }
    
            attachFormComponentEvents();
            makeInputsReadOnly();
            newComponent.find('.edit-btn').click();
            $('.modal input[type="radio"]').prop('checked', false);
            hasUnsavedChanges = true;
        }
    });
    
    
// Scroll settings
const SCROLL_SPEED = 300; // Increased for much faster scrolling
const SCROLL_SMOOTHNESS = 0.5; // Increased for faster response
const NEUTRAL_ZONE_SIZE = 1/3; // Middle third of the screen is neutral

let isCustomScrollActive = false;
let isDragging = false;
let currentY = 0;
let targetScrollY = 0;
let lastScrollTime = 0;
let animationFrameId = null;

// Function to enable custom scrolling
function enableCustomScroll(e) {
    isCustomScrollActive = true;
    currentY = e.clientY;
    updateTargetScroll(); // Start scrolling immediately
}

function disableCustomScroll() {
    isCustomScrollActive = false;
    isDragging = false;
}

// Event listener for mousedown on component-card and drag-handle
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.component-card') || e.target.closest('.drag-handle')) {
        isDragging = true;
        enableCustomScroll(e);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

function onMouseUp() {
    disableCustomScroll();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function handleMouseMove(e) {
    if (isDragging) {
        currentY = e.clientY;
        updateTargetScroll();
    }
}



function updateTargetScroll() {
    const windowHeight = window.innerHeight;
    const neutralZoneStart = windowHeight * ((1 - NEUTRAL_ZONE_SIZE) / 2);
    const neutralZoneEnd = windowHeight * ((1 + NEUTRAL_ZONE_SIZE) / 2);

    let scrollDelta = 0;

    if (currentY < neutralZoneStart) {
        // Top scroll zone
        const zoneProgress = 1 - (currentY / neutralZoneStart);
        scrollDelta = -zoneProgress * SCROLL_SPEED;
    } else if (currentY > neutralZoneEnd) {
        // Bottom scroll zone
        const zoneProgress = (currentY - neutralZoneEnd) / (windowHeight - neutralZoneEnd);
        scrollDelta = zoneProgress * SCROLL_SPEED;
    } else {
        // Neutral zone - no scrolling
        return;
    }

    targetScrollY = window.scrollY + scrollDelta;

    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(smoothScroll);
    }
}

function smoothScroll(timestamp) {
    if (!isCustomScrollActive) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
    }

    const elapsed = timestamp - lastScrollTime;
    if (elapsed > 16) { // Limit to ~60 FPS
        const currentScrollY = window.scrollY;
        const deltaY = targetScrollY - currentScrollY;
        
        if (Math.abs(deltaY) < 0.1) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            return;
        }

        window.scrollTo(0, currentScrollY + deltaY * SCROLL_SMOOTHNESS);
        lastScrollTime = timestamp;
    }

    animationFrameId = requestAnimationFrame(smoothScroll);
}

document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.component-card')) {
        e.preventDefault();
    }
});

window.addEventListener('keydown', (e) => {
    if (isCustomScrollActive && ['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
        const direction = e.code === 'ArrowUp' ? -1 : 1;
        window.scrollBy(0, direction * 200);
    }
});

  
    $('#load-form-btn').click(function() {
        if (hasUnsavedChanges) {
            showSaveConfirmationModal();
        } else {
            loadFormList();
        }
    });

    $(document).on('click', '.edit-btn', function() {
        var $component = $(this).closest('.form-component');
        var componentType = $component.data('type');
        currentEditingComponentId = $component.data('id');
        isEditing = true;
        var componentData = extractComponentData($component);
        switch(componentType) {
            case "input-field":
                populateInputFieldModal(componentData, isEditing);
                $('#inputFieldModal').modal('show');
                break;
            case "yes-no":
                populateYesNoModal(componentData);
                $('#yesNoModal').modal('show');
                break;
            case "document-upload":
                populateDocumentUploadModal(componentData);
                $('#documentUploadModal').modal('show');
                break;
            case "multiple-choice":
                populateMultipleChoiceModal(componentData, isEditing);
                $('#multipleChoiceModal').modal('show');
                break;
            case "date-time":
                populateDateTimeModal(componentData, isEditing);
                $('#dateTimeModal').modal('show');
                break;
            case "title":
                populateTitleModal(componentData);
                $('#titleInputModal').modal('show');
                break;
            case "description":
                populateDescriptionModal(componentData);
                $('#descriptionInputModal').modal('show');
                break;
        }
    });

    function checkModalChanges(modalId, saveButtonId, initialData) {
        const $modal = $(modalId);
        const $saveButton = $(saveButtonId);
    
        function compareData() {
            let hasChanges = false;
            $modal.find('input, select, textarea').each(function() {
                const $input = $(this);
                const initialValue = initialData[$input.attr('id') || $input.attr('name')];
                let currentValue = $input.val();
                if ($input.attr('type') === 'radio' || $input.attr('type') === 'checkbox') {
                    currentValue = $input.prop('checked');
                }
                if (initialValue !== currentValue) {
                    hasChanges = true;
                    return false;
                }
            });
            if (saveButtonId !== '#saveFormButton') {
                $saveButton.prop('disabled', !hasChanges);
            }
        }
        $modal.find('input, select, textarea').on('change keyup', compareData);
    }

    function extractComponentData($component) {
        var $actualForm = $component.find('.actual-form');
        var componentType = $component.data('type');
        var data = {};
        switch(componentType) {
            case "multiple-choice":
                var $label = $actualForm.find('label.component-label').first();
                data.label = $label.length ? $label.text() : '';
                if ($actualForm.find('select').length) {
                    data.type = 'dropdown';
                } else if ($actualForm.find('input[type="checkbox"]').length) {
                    data.type = 'checkbox';
                } else {
                    data.type = 'radio';
                }
                data.lookupTypeId = $actualForm.find('.lookup-container').data('lookup-id') || '';
                break;
            case "input-field":
                data.label = $actualForm.find('label').first().text();
                data.inputType = $actualForm.find('input').attr('type');
                break;
            case "yes-no":
                data.label = $actualForm.find('label.component-label').text();
                data.question = $actualForm.find('p.yes-no-question').text();
                break;
            case "document-upload":
                data.label = $actualForm.children('label').first().text() || '';
                break;
            case "date-time":
                data.label = $actualForm.find('label.component-label').text();
                data.type = $actualForm.find('.time-stamp-label').length === 2 ? 'start-end' :
                            ($actualForm.find('.time-stamp-label').text().includes('Start') ? 'start' : 'end');
                break;
            case "title":
                data.title = $actualForm.find('h2').text();
                break;
            case "description":
                data.description = $actualForm.find('label').text();
                break;
        }
        return data;
    }
    
    function populateYesNoModal(data) {
        const $modal = $('#yesNoModal');
        const $saveButton = $('#saveInputOptions4');
    
        $modal.find('.component-label').first().val(data.label || '');
        $modal.find('.component-label').last().val(data.question || '');
    
        $saveButton.prop('disabled', true);
    
        const initialData = {
            'component-label-1': data.label || '',
            'component-label-2': data.question || ''
        };
    
        checkModalChanges('#yesNoModal', '#saveInputOptions4', initialData);
    }

    function populateDocumentUploadModal(data) {
        $('#documentUploadModal input[type="text"].component-label').val(data.label || '');
    }

    function populateInputFieldModal(data, isEditing) {
        $('#inputFieldModal #inputtype1').val(data.label || '');
        $('#inputFieldModal input[name="inputType"]').prop('checked', false);
        if (isEditing && data.inputType) {
            $('#inputFieldModal input[name="inputType"][value="' + data.inputType + '"]').prop('checked', true);
        }
    }

    function populateMultipleChoiceModal(data, isEditing) {
        const $modal = $('#multipleChoiceModal');
        const $saveButton = $('#saveMultipleChoiceOptions');
        
        $modal.find('#multipleChoiceLabel').val(data.label || '');
        $modal.find('input[name="multipleChoiceType"]').prop('checked', false);
        
        if (isEditing && data.type) {
            $modal.find(`input[name="multipleChoiceType"][value="${data.type}"]`).prop('checked', true);
        }
        
        if (data.lookupTypeId) {
            setTimeout(() => {
                $modal.find('#selectionLookupDropdown').val(data.lookupTypeId);
            }, 100);
        } else {
            $modal.find('#selectionLookupDropdown').val('');
        }
        
        $saveButton.prop('disabled', true);
        const initialData = {
            multipleChoiceLabel: data.label || '',
            multipleChoiceType: data.type || '',
            selectionLookupDropdown: data.lookupTypeId || ''
        };
        checkModalChanges('#multipleChoiceModal', '#saveMultipleChoiceOptions', initialData);
    }

function populateDateTimeModal(data, isEditing) {
    const $modal = $('#dateTimeModal');
    const $saveButton = $('#saveDateTimeOptions');
    $modal.find('#dateTimeLabel').val(data.label || '');
    $modal.find('input[name="dateTimeOption"]').prop('checked', false);
    if (isEditing && data.type) {
        $modal.find(`input[name="dateTimeOption"][value="${data.type}"]`).prop('checked', true);
    }
    $saveButton.prop('disabled', true);
    const initialData = {
        dateTimeLabel: data.label || '',
        dateTimeOption: data.type || ''
    };
    checkModalChanges('#dateTimeModal', '#saveDateTimeOptions', initialData);
}
    
    function populateTitleModal(data) {
        const $modal = $('#titleInputModal');
        const $saveButton = $('#saveTitle');
        $modal.find('#titleInput').val(data.title || '');
        $saveButton.prop('disabled', true);
        const initialData = {
            titleInput: data.title || ''
        };
        checkModalChanges('#titleInputModal', '#saveTitle', initialData);
    }
    
    function populateDescriptionModal(data) {
        const $modal = $('#descriptionInputModal');
        const $saveButton = $('#saveDescription');
        $modal.find('#descriptionInput').val(data.description || '');
        $saveButton.prop('disabled', true);
        const initialData = {
            descriptionInput: data.description || ''
        };
        checkModalChanges('#descriptionInputModal', '#saveDescription', initialData);
    }
 
 function setupModalEnterKeySubmit(modalId, saveButtonId) {
     $(modalId).keypress(function(event) {
         var keycode = (event.keyCode ? event.keyCode : event.which);
         if(keycode == '13'){
             $(saveButtonId).click();
         }
     });
 }
 
 $(document).ready(function() {
     setupModalEnterKeySubmit('#titleInputModal', '#saveTitle');
     setupModalEnterKeySubmit('#descriptionInputModal', '#saveDescription');
     setupModalEnterKeySubmit('#inputFieldModal', '#saveInputOptions3');
     setupModalEnterKeySubmit('#dateTimeModal', '#saveDateTimeOptions');
     setupModalEnterKeySubmit('#yesNoModal', '#saveInputOptions4'); 
     setupModalEnterKeySubmit('#multipleChoiceModal', '#saveMultipleChoiceOptions');
     setupModalEnterKeySubmit('#documentUploadModal', '#saveDocumentUpload'); 
     setupModalEnterKeySubmit('#formDetailsModal', '#nextToHtmlModal'); 
 });

 $(document).on('click', '.open-title-modal-btn', function() {
     currentEditingComponentId = $(this).closest('.form-component').data('id');
     $('#titleInputModal').modal('show');
 });

 $('#saveDocumentUpload').click(function() {
    componentSaved = true;
    var label = $('#documentUploadModal input[type="text"].component-label').val().trim();
    var uniqueFileId = generateUniqueInputId('fileUpload');
    var htmlContent = `${label ? `<label for="${uniqueFileId}">${label}</label>` : ''}
    <div class="file-upload-wrapper">
        <input type="file" id="${uniqueFileId}" class="file-input">
        <label for="${uniqueFileId}" class="file-label">
            <i class="fa fa-upload"></i> Choose a file
        </label>
        <span class="file-chosen">No file chosen</span>
    </div>`;
    if (currentEditingComponentId) {
        $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
    } else {
        var newComponent = createNewComponent('document-upload', 'Document Upload', htmlContent);
        $('.component-box').append(newComponent);
        attachFormComponentEvents();
    }
    $('#documentUploadModal').modal('hide');
    resetDocumentUploadModal();
});

function resetDocumentUploadModal() {
    $('#documentUploadModal input[type="text"].component-label').val('');
    $('#saveDocumentUpload').prop('disabled', false); // Enable by default
}

$('#documentUploadModal').on('show.bs.modal', function() {
    $('#saveDocumentUpload').prop('disabled', false);
});
 
$('#saveTitle').click(function() {
    var titleText = $('#titleInput').val().trim();
    if (titleText) {
        componentSaved = true; 
        var titleHtml = `<h2>${titleText}</h2>`;
        if (currentEditingComponentId) {
            $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(titleHtml);
        } else {
            var newComponent = createNewComponent('title', 'Title', titleHtml);
            $('.component-box').append(newComponent);
            attachFormComponentEvents();
        }
        $('#titleInputModal').modal('hide');
        $('#titleInput').val('');
    } else {
        showBootstrapModal('Error', 'Please enter a title.');
    }
});

function resetUserModal() {
    $('#userLabel').val('');
    $('#userDepartment').val('');
    $('#saveUserOptions').prop('disabled', true);
    $('#userModal').removeData('initial-label').removeData('initial-department');
}

// Add this to the modal hidden event
$('#userModal').on('hidden.bs.modal', function () {
    resetUserModal();
});

 $(document).on('click', '.open-description-modal-btn', function() {
     currentEditingComponentId = $(this).closest('.form-component').data('id');
     $('#descriptionInputModal').modal('show');
 });
 
 $('#saveDescription').click(function() {
    componentSaved = true;
    var descriptionText = $('#descriptionInput').val().trim();
    if (descriptionText) {
        var descriptionHtml = `<label>${descriptionText}</label>`;
        if (currentEditingComponentId) {
            $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(descriptionHtml);
        } else {
            var newComponent = createNewComponent('description', 'Description', descriptionHtml);
            $('.component-box').append(newComponent);
            attachFormComponentEvents();
        }
        $('#descriptionInputModal').modal('hide');
        $('#descriptionInput').val('');
    } else {
        showBootstrapModal('Error', 'Please enter a description.');
    }
});

function getComponentType(componentTitle) {
    const typeMap = {
        'Input Field': 'input-field',
        'Yes/No': 'yes-no',
        'Document Upload': 'document-upload',
        'Multiple Choice': 'multiple-choice',
        'Date/Time': 'date-time',
        'Title': 'title',
        'Description': 'description',
        'Section Break': 'section-break',
        'Color Input': 'color-input' 
    };
    if (componentTitle === 'User') return 'user';
    return typeMap[componentTitle] || '';
}

function getMarkerClass(componentType) {
    return componentType + '-marker';
}

function createNewComponentElement(id, type, title, iconHtml, markerClass) {
    let component = $(`
        <div class="form-component" data-id="${id}" data-type="${type}">
            <div class="form-component-header">
                <span class="drag-handle"><i class="fa fa-bars"></i></span>
                <p>${title}</p>
                <span class="form-component-icon">${iconHtml}</span>
            </div>
            <div class="form-component-content">
                <div class="actual-form ${markerClass}"></div>
                <div class="action-buttons">
                    ${type !== 'section-break' && type !== 'color-input' ? '<button class="edit-btn"><i class="fa fa-edit"></i></button>' : ''}
                    <button class="delete-btn"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).css({
        "margin-bottom": "10px",
        "border": "1px solid rgb(172 172 172)",
        "border-radius": "7px",
    });

    if (type === 'section-break') {
        component.find('.actual-form').html('<div class="line-section-break"></div>');
    } else if (type === 'color-input') {
        const uniqueId = generateUniqueInputId('color-input');
        component.find('.actual-form').html(`
            <div class="form-control-wrapper">
                <div class="selector-title">
                    Selected Color: 
                    <input type="color" id="${uniqueId}-colorPicker" class="picked-color" value="#ffffff">
                </div>
                <div class="color-palette-wrapper" id="${uniqueId}-palette">
                    <p class="selector-title-big">Munsell Color Chart</p>
                    ${munsellColorChartHtml}
                </div>
            </div>
        `);
    }


    return component;
}

const munsellColorChartHtml = `
                <div class="palette-stripe is-stackable">
                    <div class="color-value">8/</div>
                    <div class="palette-stripe_colors" style="width: 80%;">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#d1cbca" style="background-color: #d1cbca"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#dec2b9" style="background-color: #dec2b9"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#ebbaa3" style="background-color: #ebbaa3"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#fcb689" style="background-color: #fcb689"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">7/</div>
                    <div class="palette-stripe_colors">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#adacb2" style="background-color: #adacb2"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#c2a6a1" style="background-color: #c2a6a1"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#d29e8c" style="background-color: #d29e8c"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#da9572" style="background-color: #da9572"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#e59155" style="background-color: #e59155"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">6/</div>
                    <div class="palette-stripe_colors">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#949297" style="background-color: #949297"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#a78885" style="background-color: #a78885"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#b28170" style="background-color: #b28170"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#be794d" style="background-color: #be794d"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#cb752b" style="background-color: #cb752b"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">5/</div>
                    <div class="palette-stripe_colors">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#7c7a7e" style="background-color: #7c7a7e"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#896b69" style="background-color: #896b69"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#956146" style="background-color: #956146"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#a25324" style="background-color: #a25324"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#ab4c13" style="background-color: #ab4c13"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">4/</div>
                    <div class="palette-stripe_colors" style="width: 80%;">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#636165" style="background-color: #636165"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#6a3d39" style="background-color: #6a3d39"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#792a15" style="background-color: #792a15"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#9a4814" style="background-color: #9a4814"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">3/</div>
                    <div class="palette-stripe_colors" style="width: 60%;">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#20212d" style="background-color: #20212d"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#531c1a" style="background-color: #531c1a"><span>•</span></div>
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#511304" style="background-color: #511304"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="palette-stripe is-stackable">
                    <div class="color-value">2/</div>
                    <div class="palette-stripe_colors" style="width: 20%;">
                        <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#0a0b14" style="background-color: #0a0b14; border-radius: 8px;"><span>•</span></div>
                    </div>
                    <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
                </div>
                <div class="chroma-wrapper">
                    <div class="color-chroma">0/</div>
                    <div class="color-chroma">2/</div>
                    <div class="color-chroma">4/</div>
                    <div class="color-chroma">6/</div>
                    <div class="color-chroma">8/</div>
                </div>
                <div class="color-value-title">◀━━━━━COLOR VALUE━━━━━▶</div>
                <div class="color-chroma-title">◀━━━COLOR CHROMA━━━▶</div>
         
`;

$(document).ready(function() {
    $(document).on('click', '.color-palette-wrapper .pickable-color', function() {
        const $this = $(this);
        const color = $this.data('value');
        const $component = $this.closest('.form-component');
        $component.find('.color-palette-wrapper .pickable-color').removeClass('selected');
        $this.addClass('selected');
        const $colorPicker = $component.find('.picked-color');
        $colorPicker.val(color);
        
    });

    $(document).on('change', '.form-component[data-type="color-input"] .picked-color', function() {
        const $this = $(this);
        const color = $this.val();
        const $component = $this.closest('.form-component');
        
        updateSelectedColor($component, color);
    });

    function updateSelectedColor($component, color) {
        const $colorPicker = $component.find('.picked-color');
        $colorPicker.val(color);
        $component.find('.color-palette-wrapper .pickable-color').removeClass('selected');
        $component.find(`.color-palette-wrapper .pickable-color[data-value="${color}"]`).addClass('selected');
    }
});

 function observeFormChanges() {
     const target = document.querySelector('.component-box');
     const observer = new MutationObserver(mutations => {
         mutations.forEach(mutation => {
             if (mutation.type === 'childList') {
                 makeInputsReadOnly();
             }
         });
     });
     const config = { childList: true, subtree: true };
     observer.observe(target, config);
 }
 
 $(document).ready(function() {
    $(".component-box").sortable({
        handle: ".drag-handle",
        placeholder: "drop-indicator",
        axis: "y",
        opacity: 0.6,
        cursor: "move",
        update: function(event, ui) {
            hasUnsavedChanges = true;
        },
        start: function(event, ui) {
            ui.item.addClass("dragging");
            ui.placeholder.height(ui.item.height());
        },
        stop: function(event, ui) {
            ui.item.removeClass("dragging");
        }
    });
    initSortable();
     observeFormChanges();
     makeInputsReadOnly();
 });

 function initSortable() {
    $(".component-box").sortable({
        handle: ".drag-handle",
        placeholder: "ui-state-highlight",
        axis: "y",
        opacity: 0.6,
        cursor: "move",
        update: function(event, ui) {
        },
        start: function(event, ui) {
            ui.item.addClass("dragging");
        },
        stop: function(event, ui) {
            ui.item.removeClass("dragging");
        }
    });
}

$('#saveInputOptions3').click(function() {
    componentSaved = true;
    var labelText = $('#inputFieldModal #inputtype1').val().trim();
    var inputType = $('#inputFieldModal input[name="inputType"]:checked').val();
    var inputTypeLabel = $('#inputFieldModal input[name="inputType"]:checked').next('label').text().trim();
    if (!inputType) {
        showBootstrapModal('Error', 'Please select an input type.');
        return false;
    }
    var uniqueInputId = generateUniqueInputId(`input_${inputType}`);
    var htmlContent = '';
    if (labelText) {
        htmlContent += `<label for="${uniqueInputId}">${labelText}</label>`;
    } 
    if (inputTypeLabel) {
        htmlContent += `<label class="input-type-label">${inputTypeLabel} Input</label>`;
    }
    htmlContent += `<input type="${inputType}" id="${uniqueInputId}" class="form-control">`;
    if (currentEditingComponentId) {
        $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
    } else {
        var newComponent = createNewComponent('input-field', 'Input Field', htmlContent);
        $('.component-box').append(newComponent);
        attachFormComponentEvents();
    }
    $('#inputFieldModal').modal('hide');
});

function populateLookupDropdown() {
    $.ajax({
        url: '/RGBA/warehouse/php/lookup_types.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && Array.isArray(response.data)) {
                var dropdown = $('#selectionLookupDropdown');
                dropdown.empty();
                dropdown.append($('<option>', {
                    value: '',
                    text: 'Select',
                    selected: true,
                    disabled: true
                }));
                response.data.forEach(function(lookupType) {
                    dropdown.append($('<option>', {
                        value: lookupType.id,
                        text: lookupType.name
                    }));
                });
            } else {
                console.error('Failed to load lookup types:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading lookup types:', status, error);
        }
    });
}

$(document).ready(function() {
    $('.modal').on('hidden.bs.modal', function (e) {
        isEditing = false;
        if ($(this).attr('id') === 'htmlModal') {
            closeAllModals();
        }
    });

    $('#saveInputOptions4').click(function() {
        componentSaved = true;
        var yesNoLabel = $('#yesNoModal .component-label:first').val().trim();
        var yesNoQuestion = $('#yesNoModal .component-label:last').val().trim();
    
        if (!yesNoQuestion) {
            showBootstrapModal('Error', 'Please enter a question for the Yes/No component.');
            return;
        }
        var uniqueYesId = generateUniqueInputId('yes');
        var uniqueNoId = generateUniqueInputId('no');
        var htmlContent = '';
        if (yesNoLabel) {
            htmlContent += `<label class="component-label">${yesNoLabel}</label>`;
        }
        htmlContent += `
            <p class="yes-no-question">${yesNoQuestion}</p>
            <div class="yes-no-container">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="yesno_${currentEditingComponentId || 'new'}" id="${uniqueYesId}" value="Yes">
                    <label class="form-check-label" for="${uniqueYesId}">Yes</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="yesno_${currentEditingComponentId || 'new'}" id="${uniqueNoId}" value="No">
                    <label class="form-check-label" for="${uniqueNoId}">No</label>
                </div>
            </div>
        `;
        if (currentEditingComponentId) {
            $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
        } else {
            var newComponent = createNewComponent('yes-no', 'Yes/No', htmlContent);
            $('.component-box').append(newComponent);
            attachFormComponentEvents();
        }
        $('#yesNoModal').modal('hide');
    });
    $('#htmlModal .close, #htmlModal .btn-secondary').on('click', function() {
        closeAllModals();
    });
});




function populateInputFieldModal(data, isEditing) {
    const $modal = $('#inputFieldModal');
    const $saveButton = $('#saveInputOptions3');
    $modal.find('#inputtype1').val(data.label || '');
    $modal.find('input[name="inputType"]').prop('checked', false);
    if (isEditing && data.inputType) {
        $modal.find(`input[name="inputType"][value="${data.inputType}"]`).prop('checked', true);
    }
    $saveButton.prop('disabled', true);
    const initialData = {
        inputtype1: data.label || '',
        inputType: data.inputType || ''
    };
    checkModalChanges('#inputFieldModal', '#saveInputOptions3', initialData);
}

$('.modal').on('hidden.bs.modal', function () {
    $(this).find('.btn-primary').prop('disabled', true);
    isEditing = false;
    var modalId = $(this).attr('id');
    var modalsTriggeringDeletion = [
        'titleInputModal',
        'descriptionInputModal',
        'inputFieldModal',
        'dateTimeModal',
        'yesNoModal',
        'multipleChoiceModal',
        'userModal'  // Make sure this is included
    ];

    if (modalsTriggeringDeletion.includes(modalId)) {
        var $component = $('.form-component[data-id="' + currentEditingComponentId + '"]');
        if ($component.length && !componentSaved) {
            if ($component.find('.actual-form').children().length === 0) {
                $component.remove();
            }
        }
    }
    componentSaved = false; 
    $(this).find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
    resetModalForm(this); 
});

 $('#inputFieldModal').on('show.bs.modal', function() {
    checkInputFieldModalSaveButtonState(); 
});

$('#inputFieldModal input[name="inputType"]').change(function() {
    checkInputFieldModalSaveButtonState();
});


function checkDateTimeOptionsSaveButtonState() {
    var isDateTimeOptionSelected = $('#dateTimeModal input[name="dateTimeOption"]:checked').length > 0;
    $('#saveDateTimeOptions').prop('disabled', !isDateTimeOptionSelected);
}

$('#dateTimeModal input[name="dateTimeOption"]').change(function() {
    checkDateTimeOptionsSaveButtonState();
});

$('#dateTimeModal').on('show.bs.modal', function() {
    checkDateTimeOptionsSaveButtonState();
});

$(document).ready(function() {
    checkDateTimeOptionsSaveButtonState();
});


function checkInputFieldModalSaveButtonState() {
    var isInputTypeSelected = $('#inputFieldModal input[name="inputType"]:checked').length > 0;
    $('#saveInputOptions3').prop('disabled', !isInputTypeSelected);
}


$('#saveDateTimeOptions').click(function() {
    componentSaved = true;
    var dateTimeLabel = $('#dateTimeLabel').val().trim(); 
    var selectedOption = $('#dateTimeModal input[name="dateTimeOption"]:checked').val();
    var htmlContent = '';
    if (dateTimeLabel) {
        htmlContent += `<label class="component-label">${dateTimeLabel}</label>`; 
    }

    switch(selectedOption) {
        case 'start':
            var uniqueStartId = generateUniqueInputId('start_time');
            htmlContent += `
                <div class="date-time-container">
                    <label class="time-stamp-label" for="${uniqueStartId}">Start Time</label>
                    <input type="datetime-local" id="${uniqueStartId}" class="form-control">
                </div>`;
            break;
        case 'end':
            var uniqueEndId = generateUniqueInputId('end_time');
            htmlContent += `
                <div class="date-time-container">
                    <label class="time-stamp-label" for="${uniqueEndId}">End Time</label>
                    <input type="datetime-local" id="${uniqueEndId}" class="form-control">
                </div>`;
            break;
        case 'start-end':
            var uniqueStartId = generateUniqueInputId('start_time');
            var uniqueEndId = generateUniqueInputId('end_time');
            htmlContent += `
                <div class="date-time-container">
                    <label class="time-stamp-label" for="${uniqueStartId}">Start Time</label>
                    <input type="datetime-local" id="${uniqueStartId}" class="form-control">
                    <label class="time-stamp-label" for="${uniqueEndId}">End Time</label>
                    <input type="datetime-local" id="${uniqueEndId}" class="form-control">
                </div>`;
            break;
    }

    if (currentEditingComponentId) {
        $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
    } else {
        var newComponent = createNewComponent('date-time', 'Date/Time', htmlContent);
        $('.component-box').append(newComponent);
        attachFormComponentEvents();
    }

    $('#dateTimeModal').modal('hide');
});

$('#multipleChoiceModal').on('show.bs.modal', function() {
    $('#saveMultipleChoiceOptions').prop('disabled', true); 
    populateLookupDropdown();
});
 
 $('#multipleChoiceModal').on('hide.bs.modal', function () {
     resetMultipleChoiceModalForm();
 });
 
 function resetMultipleChoiceModalForm() {
     $('#multipleChoiceModal #multipleChoiceLabel').val(''); 
     $('#multipleChoiceModal input[name="multipleChoiceType"]').prop('checked', false);
     $('#multipleChoiceModal #selectionLookupDropdown').val(''); 
     $('#saveMultipleChoiceOptions').prop('disabled', true);
 }
 
 $('#multipleChoiceModal input[name="multipleChoiceType"]').change(function() {
     var isInputTypeSelected = $('#multipleChoiceModal input[name="multipleChoiceType"]:checked').length > 0;
     $('#saveMultipleChoiceOptions').prop('disabled', !isInputTypeSelected);
 });

 $('#createRadioButton, #createCheckbox, #createDropdown').on('click', function() {
      var modalId = $(this).closest('.modal').attr('id');
      $('#' + modalId).modal('hide');
      switch($(this).attr('id')) {
          case 'createRadioButton':
              break;
          case 'createCheckbox':
              break;
          case 'createDropdown':
              break;
      }
  });

    var componentSaved = false; 

    $('#saveMultipleChoiceOptions').click(function() {
        componentSaved = true;
        var selectedInputType = $('#multipleChoiceModal input[name="multipleChoiceType"]:checked').val();
        var label = $('#multipleChoiceModal #multipleChoiceLabel').val().trim();
        var lookupTypeId = $('#selectionLookupDropdown').val();
        var lookupTypeName = $('#selectionLookupDropdown option:selected').text();
    
        if (!selectedInputType) {
            showBootstrapModal('Error', 'Please select an input type (radio, checkbox, or dropdown.');
            return;
        }
    
        if (!lookupTypeId || lookupTypeId === '') {
            showBootstrapModal('Error', 'Please select a valid option from the dropdown.');
            return;
        }
    
        var htmlContent = '';
        if (label) {
            htmlContent += `<label class="component-label">${label}</label>`; 
        }
    
        // Include the lookup type name in the container
        htmlContent += `<div class="lookup-container" data-lookup-type="${selectedInputType}" data-lookup-id="${lookupTypeId}" data-label="${label}">
            <p class="lookup-type-name">${lookupTypeName}</p>
        </div>`;
    
        // Fetch and display the current lookup data
        $.ajax({
            url: '/RGBA/warehouse/php/lookup_types.php',
            method: 'GET',
            data: { lookupTypeId: lookupTypeId },
            dataType: 'json',
            success: function(response) {
                if (response.success && Array.isArray(response.data)) {
                    var lookupHtml = '';
                    if (selectedInputType === 'dropdown') {
                        var uniqueSelectId = generateUniqueInputId('select');
                        lookupHtml += `<select class="form-control" id="${uniqueSelectId}">`;
                        response.data.forEach(function(option) {
                            lookupHtml += `<option value="${option.id}">${option.name}</option>`;
                        });
                        lookupHtml += `</select>`;
                    } else {
                        response.data.forEach(function(option) {
                            var uniqueOptionId = generateUniqueInputId(`option_${selectedInputType}`);
                            lookupHtml += `<div class="form-check">
                                <input class="form-check-input" type="${selectedInputType}" name="options_${currentEditingComponentId || 'new'}" id="${uniqueOptionId}" value="${option.id}">
                                <label class="form-check-label" for="${uniqueOptionId}">${option.name}</label>
                            </div>`;
                        });
                    }
    
                    // Append the lookup data to the htmlContent
                    htmlContent += lookupHtml;
    
                    // Update or create the component
                    if (currentEditingComponentId) {
                        $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
                    } else {
                        var newComponent = createNewComponent('multiple-choice', 'Multiple Choice', htmlContent);
                        $('.component-box').append(newComponent);
                        attachFormComponentEvents();
                    }
    
                    $('#multipleChoiceModal').modal('hide');
                } else {
                    console.error('Failed to load options:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading options:', status, error);
            }
        });
    });

    window.generateUniqueInputId = function(baseId) {
        const existingIds = new Set();
        $('.component-box input, .component-box select, .component-box textarea').each(function() {
            existingIds.add($(this).attr('id'));
        });
    
        let uniqueId = baseId;
        let counter = 1;
        while (existingIds.has(uniqueId)) {
            uniqueId = `${baseId}_${counter}`;
            counter++;
        }
        return uniqueId;
    };

  window.attachFormComponentEvents = function() {
    $('.form-component .edit-btn').off('click').on('click', function() {
        var componentType = $(this).closest('.form-component').data('type');
        currentEditingComponentId = $(this).closest('.form-component').data('id');
        switch(componentType) {
            case "input-field":
                $('#inputFieldModal').modal('show');
                break;
            case "yes-no":
                $('#yesNoModal').modal('show');
                break;
            case "document-upload":
                $('#documentUploadModal').modal('show');
                break;
            case "multiple-choice":
                $('#multipleChoiceModal').modal('show');
                break;
            case "date-time":
                $('#dateTimeModal').modal('show');
                break;
            case "title":
                $('#titleInputModal').modal('show');
                break;
            case "description":
                $('#descriptionInputModal').modal('show');
                break;
        }
        initSortable();
    });


    $('.form-component .delete-btn').off('click').on('click', function() {
        componentToDelete = $(this).closest('.form-component');
        $('#deleteConfirmationModal').modal('show');
    });

    $('#confirmDelete').off('click').on('click', function() {
        if (componentToDelete) {
            componentToDelete.remove();
            $('#deleteConfirmationModal').modal('hide');
            componentToDelete = null;
        }
    });

    $(".component-box").sortable({
        handle: ".drag-handle",
        placeholder: "ui-state-highlight",
        update: function(event, ui) {
        }
    });

};
    $(".lookup-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".grid-container .component-card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

function resetModalForm(modalId) {
    $('#inputtype1').val('');
}

let currentOpenedForm = null;

function saveHtml() {
    let formName, formId;

    if (currentOpenedForm) {
        formName = currentOpenedForm.name;
        formId = currentOpenedForm.id;
    } else {
        formName = '';
        formId = '';
    }

    let htmlContent = '';
    $('.form-component').each(function() {
        const $actualForm = $(this).find('.actual-form');
        const $clonedForm = $actualForm.clone();

        // For multiple-choice components, only keep the lookup-container
        if ($clonedForm.find('.lookup-container').length) {
            const $lookupContainer = $clonedForm.find('.lookup-container');
            $clonedForm.html($lookupContainer[0].outerHTML);
        }

        $clonedForm.find('input, textarea').removeAttr('readonly');
        $clonedForm.find('select').removeAttr('disabled');
        htmlContent += $clonedForm.prop('outerHTML') + '\n';
    });
    
    $('#formName').val(formName);
    $('#formId').val(formId);
    $('#formDetailsContent').show();
    $('#formExistsContent').hide();
    $('#saveFormButton').show().prop('disabled', false);
    $('#overwriteFormButton').hide();
    $('#formDetailsModal').modal('show');
    $('#saveFormButton').off('click');
    $('#overwriteFormButton').off('click');
    $('#saveFormButton').on('click', function() {
        const updatedFormName = $('#formName').val().trim();
        const updatedFormId = $('#formId').val().trim();
        if (!updatedFormName || !updatedFormId) {
            showBootstrapModal('Error', 'Both Form Name and Form ID are required.');
            return;
        }
        if (htmlContent.length === 0) {
            showBootstrapModal('Error', 'The form is empty. Please add some components before saving.');
            return;
        }
        checkFormExistence(updatedFormName, updatedFormId, htmlContent);
    });

    $('#overwriteFormButton').on('click', function() {
        const updatedFormName = $('#formName').val().trim();
        const updatedFormId = $('#formId').val().trim();
        saveFormToServer(updatedFormName, updatedFormId, htmlContent, 'replace');
    });

    $('#formDetailsModal').on('shown.bs.modal', function() {
        $('#formName, #formId').prop('disabled', false);
    });

    $('#formDetailsModal').on('hidden.bs.modal', function () {
        $('#saveFormButton').prop('disabled', false);
    });

    $('#formName, #formId').on('input', function() {
        $('#saveFormButton').prop('disabled', false);
    });
}


function showFormExistsModal(formName, formId, htmlContent) {
    $('#newFormId').val(formId);
    updateSaveButton(formId);
    
    $('#formExistsModal').modal('show');

    $('#newFormId').off('input').on('input', function() {
        updateSaveButton(formId);
    });

    $('#saveFormButton').off('click').on('click', function() {
        var newId = $('#newFormId').val().trim();
        var saveMode = newId === formId ? 'replace' : 'new';
        saveFormToServer(formName, newId, htmlContent, saveMode);
        $('#formExistsModal').modal('hide');
    });
}

function updateSaveButton(originalId) {
    var newId = $('#newFormId').val().trim();
    var saveButton = $('#saveFormButton');
    
    if (newId === originalId) {
        saveButton.text('Overwrite');
    } else if (newId !== '') {
        saveButton.text('Save as New Form');
    } else {
        saveButton.text('Save');
    }
}


function checkFormExistence(formName, formId, htmlContent) {
    $.ajax({
        url: 'php/check_form_exists.php',
        method: 'POST',  // Make sure this is set to 'POST'
        data: { formId: formId },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                const currentForm = getCurrentOpenedForm();
                if (response.exists && (!currentForm || formId !== currentForm.id)) {
                    showFormExistsContent(formName, formId, htmlContent);
                } else {
                    saveFormToServer(formName, formId, htmlContent, 'replace');
                }
            } else {
                alert("Error checking for existing forms: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            alert("An error occurred while checking for existing forms.");
        }
    });
}

function showFormExistsContent(formName, formId, htmlContent) {
    $('#formDetailsContent').hide();
    $('#formExistsContent').show();
    $('#saveFormButton').hide();
    $('#overwriteFormButton').show();
    $('#newFormId').val(formId).off('input').on('input', function() {
        const newId = $(this).val().trim();
        if (newId && newId !== formId) {
            $('#saveFormButton').show().text('Save as New Form');
            $('#overwriteFormButton').hide();
        } else {
            $('#saveFormButton').hide();
            $('#overwriteFormButton').show();
        }
    });
    $('#saveFormButton').off('click').on('click', function() {
        const newId = $('#newFormId').val().trim();
        saveFormToServer(formName, newId, htmlContent, 'new');
    });
}

function saveFormToServer(formName, formId, htmlContent, saveMode) {
    var $tempDiv = $('<div>').html(htmlContent);
    $tempDiv.find('.lookup-container').each(function() {
        var $container = $(this);
        var label = $container.data('label');
        if (label) {
            $container.before(`<label class="component-label">${label}</label>`);
        }
    });

    // Update htmlContent with the processed content
    htmlContent = $tempDiv.html();

    $.ajax({
        url: 'php/save_form.php',
        method: 'POST',
        data: {
            formName: formName,
            formId: formId,
            htmlContent: htmlContent,
            saveMode: saveMode
        },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#formDetailsModal').modal('hide');
                alert("Form saved successfully!");
                location.reload();
                hasUnsavedChanges = false;
                if ($('#loadFormModal').data('shouldLoadAfterSave')) {
                    loadFormList();
                    $('#loadFormModal').data('shouldLoadAfterSave', false);
                }
            } else {
                console.error("Error saving form:", response.message);
                alert("Error saving form: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error in saveFormToServer:", status, error);
            console.error("XHR response:", xhr.responseText);
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                alert("An error occurred while saving the form: " + errorResponse.message);
            } catch (e) {
                alert("An unexpected error occurred while saving the form.");
            }
        }
    });
}

function closeAllModals() {
    $('.modal').modal('hide');
}

function clearCurrentOpenedForm() {
    currentOpenedForm = null;
}

function getCurrentOpenedForm() {
    return currentOpenedForm;
}

function showSaveConfirmationModal() {
    $('#saveConfirmationModal').modal('show');
}

$('#saveAndLoadBtn').click(function() {
    $('#saveConfirmationModal').modal('hide');
    $('#loadFormModal').data('shouldLoadAfterSave', true);
    saveHtml();
});

$('#discardAndLoadBtn').click(function() {
    $('#saveConfirmationModal').modal('hide');
    hasUnsavedChanges = false;
    loadFormList();
});


// Load departments from JSON file
function loadDepartments() {
    $.getJSON('/RGBA/warehouse/json/departments.json')
        .done(function(data) {
            if (data && data.departments) {
                populateDepartments(data.departments);
            } else {
                console.error("Unexpected data structure in departments.json");
                handleDepartmentLoadError();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Failed to load departments from JSON file:", textStatus, errorThrown);
            handleDepartmentLoadError();
        });
}

function populateDepartments(departments) {
    var select = $('#userDepartment');
    select.empty();
    select.prop('disabled', false);
    
    // Sort departments by name
    departments.sort((a, b) => a.name.localeCompare(b.name));

    // Add a default "Select Department" option
    select.append($('<option></option>').val('').text('Select Department').prop('disabled', true).prop('selected', true));

    $.each(departments, function(index, department) {
        select.append($('<option></option>').val(department.id).text(department.name));
    });
}


function handleDepartmentLoadError() {
    var select = $('#userDepartment');
    select.empty();
    select.append($('<option></option>').val('').text('Error loading departments'));
    select.prop('disabled', true);
}






// Ensure getComponentType is defined in the global scope
window.getComponentType = function($element) {
    const text = $element.find('p').text().trim();
    return getComponentTypeFromTitle(text);
};

function getComponentTypeFromTitle(componentTitle) {
    const typeMap = {
        'Input Field': 'input-field',
        'Yes/No': 'yes-no',
        'Document Upload': 'document-upload',
        'Multiple Choice': 'multiple-choice',
        'Date/Time': 'date-time',
        'Title': 'title',
        'Description': 'description',
        'Section Break': 'section-break',
        'Color Input': 'color-input',
        'User': 'user'
    };
    return typeMap[componentTitle] || '';
}

function getMarkerClass(componentType) {
    return componentType + '-marker';
}

function createNewComponent(type, title, htmlContent) {
    highestComponentId++;
    const iconHtml = getComponentIcon(type);
    const markerClass = getMarkerClass(type);
    return createNewComponentElement(highestComponentId, type, title, iconHtml, markerClass, htmlContent);
}

function createNewComponentElement(id, type, title, iconHtml, markerClass, htmlContent) {
    let component = $(`
        <div class="form-component" data-id="${id}" data-type="${type}">
            <div class="form-component-header">
                <span class="drag-handle"><i class="fa fa-bars"></i></span>
                <p>${title}</p>
                <span class="form-component-icon">${iconHtml}</span>
            </div>
            <div class="form-component-content">
                <div class="actual-form ${markerClass}">${htmlContent || ''}</div>
                <div class="action-buttons">
                    ${type !== 'section-break' && type !== 'color-input' ? '<button class="edit-btn"><i class="fa fa-edit"></i></button>' : ''}
                    <button class="delete-btn"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).css({
        "margin-bottom": "10px",
        "border": "1px solid rgb(172 172 172)",
        "border-radius": "7px",
    });

    return component;
}

// Update the click handler for component cards
$('.grid-container').on('click', '.component-card', function(e) {
    const componentType = getComponentType($(this));
    if (componentType) {
        simulateComponentDrop(componentType);
    }
});

function simulateComponentDrop(componentType) {
    const componentTitle = getComponentTitleFromType(componentType);
    const iconHtml = getComponentIcon(componentType);
    const markerClass = getMarkerClass(componentType);
    const newComponent = createNewComponentElement(++highestComponentId, componentType, componentTitle, iconHtml, markerClass);

    const munsellColorChartHtml = `
    <div class="palette-stripe is-stackable">
        <div class="color-value">8/</div>
        <div class="palette-stripe_colors" style="width: 80%;">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#d1cbca" style="background-color: #d1cbca"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#dec2b9" style="background-color: #dec2b9"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#ebbaa3" style="background-color: #ebbaa3"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#fcb689" style="background-color: #fcb689"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">7/</div>
        <div class="palette-stripe_colors">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#adacb2" style="background-color: #adacb2"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#c2a6a1" style="background-color: #c2a6a1"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#d29e8c" style="background-color: #d29e8c"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#da9572" style="background-color: #da9572"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#e59155" style="background-color: #e59155"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">6/</div>
        <div class="palette-stripe_colors">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#949297" style="background-color: #949297"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#a78885" style="background-color: #a78885"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#b28170" style="background-color: #b28170"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#be794d" style="background-color: #be794d"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#cb752b" style="background-color: #cb752b"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">5/</div>
        <div class="palette-stripe_colors">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#7c7a7e" style="background-color: #7c7a7e"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#896b69" style="background-color: #896b69"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#956146" style="background-color: #956146"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#a25324" style="background-color: #a25324"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#ab4c13" style="background-color: #ab4c13"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">4/</div>
        <div class="palette-stripe_colors" style="width: 80%;">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#636165" style="background-color: #636165"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#6a3d39" style="background-color: #6a3d39"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#792a15" style="background-color: #792a15"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#9a4814" style="background-color: #9a4814"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">3/</div>
        <div class="palette-stripe_colors" style="width: 60%;">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#20212d" style="background-color: #20212d"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#531c1a" style="background-color: #531c1a"><span>•</span></div>
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#511304" style="background-color: #511304"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="palette-stripe is-stackable">
        <div class="color-value">2/</div>
        <div class="palette-stripe_colors" style="width: 20%;">
            <div class="pickable-color color_5223c768d0024ea5b18be497149692b0" data-value="#0a0b14" style="background-color: #0a0b14; border-radius: 8px;"><span>•</span></div>
        </div>
        <div class="palette-stripe_more-btn btn-float"><i class="icon icon-dots-24px"></i></div>
    </div>
    <div class="chroma-wrapper">
        <div class="color-chroma">0/</div>
        <div class="color-chroma">2/</div>
        <div class="color-chroma">4/</div>
        <div class="color-chroma">6/</div>
        <div class="color-chroma">8/</div>
    </div>
    <div class="color-value-title">◀━━━━━COLOR VALUE━━━━━▶</div>
    <div class="color-chroma-title">◀━━━COLOR CHROMA━━━▶</div>

`;

    // Add specific content for section break and color input
    if (componentType === 'section-break') {
        newComponent.find('.actual-form').html('<div class="line-section-break"></div>');
    } else if (componentType === 'color-input') {
        const uniqueId = generateUniqueInputId('color-input');
        newComponent.find('.actual-form').html(`
            <div class="form-control-wrapper">
                <div class="selector-title">
                    Selected Color: 
                    <input type="color" id="${uniqueId}-colorPicker" class="picked-color" value="#ffffff">
                </div>
                <div class="color-palette-wrapper" id="${uniqueId}-palette">
                    <p class="selector-title-big">Munsell Color Chart</p>
                    ${munsellColorChartHtml}
                </div>
            </div>
        `);
    }

    

    // Append the new component to the end of the component box
    $('.component-box').append(newComponent);

    // Trigger any necessary post-drop actions
    attachFormComponentEvents();
    makeInputsReadOnly();
    if (componentType !== 'section-break' && componentType !== 'color-input') {
        newComponent.find('.edit-btn').click();
    }
    $('.modal input[type="radio"]').prop('checked', false);
    hasUnsavedChanges = true;

    // For components that require additional input, open their respective modals
    switch(componentType) {
        case 'input-field':
            $('#inputFieldModal').modal('show');
            break;
        case 'yes-no':
            $('#yesNoModal').modal('show');
            break;
        case 'document-upload':
            $('#documentUploadModal').modal('show');
            break;
        case 'multiple-choice':
            $('#multipleChoiceModal').modal('show');
            break;
        case 'date-time':
            $('#dateTimeModal').modal('show');
            break;
        case 'user':
            $('#userModal').modal('show');
            loadDepartments();
            break;
        // For components that don't need additional input, we don't need to do anything extra
        case 'title':
        case 'description':
        case 'section-break':
        case 'color-input':
            break;
        default:
            console.error('Unknown component type:', componentType);
    }
}

// Make sure this function is defined
function getComponentTitleFromType(componentType) {
    const titleMap = {
        'input-field': 'Input Field',
        'yes-no': 'Yes/No',
        'document-upload': 'Document Upload',
        'multiple-choice': 'Multiple Choice',
        'date-time': 'Date/Time',
        'title': 'Title',
        'description': 'Description',
        'section-break': 'Section Break',
        'color-input': 'Color Input',
        'user': 'User'
    };
    return titleMap[componentType] || 'Unknown Component';
}










$('#saveUserOptions').click(function() {
    componentSaved = true;
    var label = $('#userLabel').val().trim();
    var departmentId = $('#userDepartment').val();
    var departmentName = $('#userDepartment option:selected').text();

    if (!departmentId) {
        showBootstrapModal('Error', 'Please select a department.');
        return;
    }

    var htmlContent = '';
    if (label) {
        htmlContent += `<label>${label}</label>`;
    }
    htmlContent += `
        <div class="user-component" data-department-id="${departmentId}">
            <p>Department: ${departmentName}</p>
        </div>
    `;

    if (currentEditingComponentId) {
        $('.form-component[data-id="' + currentEditingComponentId + '"] .actual-form').html(htmlContent);
    } else {
        var newComponent = createNewComponent('user', 'User', htmlContent);
        $('.component-box').append(newComponent);
        attachFormComponentEvents();
    }

    $('#userModal').modal('hide');
});

$(document).on('click', '.form-component[data-type="user"] .edit-btn', function() {
    var $component = $(this).closest('.form-component');
    currentEditingComponentId = $component.data('id');
    
    var label = $component.find('label').text();
    var departmentId = $component.find('.user-component').data('department-id');

    $('#userLabel').val(label);
    $('#userModal').data('initial-label', label);
    $('#userModal').data('initial-department', departmentId);

    loadDepartments();
    
    // Set the selected department after the options are loaded
    setTimeout(function() {
        $('#userDepartment').val(departmentId);
        checkUserModalChanges(); // Check initial state
    }, 100);

    $('#userModal').modal('show');
});



function checkUserModalChanges() {
    var hasChanges = false;
    var initialLabel = $('#userModal').data('initial-label') || '';
    var initialDepartment = $('#userModal').data('initial-department') || '';

    var currentLabel = $('#userLabel').val();
    var currentDepartment = $('#userDepartment').val();

    if (currentLabel !== initialLabel || currentDepartment !== initialDepartment) {
        hasChanges = true;
    }

    $('#saveUserOptions').prop('disabled', !hasChanges);
}

// Add event listeners to trigger the check
$('#userLabel, #userDepartment').on('input change', checkUserModalChanges);


// Reset modal state when it's hidden
$('#userModal').on('hidden.bs.modal', function () {
    $('#saveUserOptions').prop('disabled', true);
    $('#userModal').removeData('initial-label').removeData('initial-department');
});







// Add this function to create and show a Bootstrap modal
function showBootstrapModal(title, message, confirmCallback = null) {
    // Remove any existing modal with the same ID
    $('#dynamicModal').remove();

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
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        ${confirmCallback ? '<button type="button" class="btn btn-primary" id="modalConfirm">Confirm</button>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modalElement = document.getElementById('dynamicModal');
    const modal = new bootstrap.Modal(modalElement);

    if (confirmCallback) {
        $('#modalConfirm').on('click', function() {
            modal.hide();
            confirmCallback();
        });
    }

    modal.show();
}








  function loadForm(formFile) {
    $.ajax({
        url: 'php/load_form.php',
        method: 'GET',
        data: { formFile: formFile },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                transformAndDisplayForm(response.htmlContent);
                setCurrentOpenedForm(response.formName, response.formId);
                setHighestComponentId();
                $('#loadFormModal').modal('hide');
            } else {
                console.error("Error loading form:", response.message);
                alert('Error loading form: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", status, error);
            alert('An error occurred while loading the form.');
        }
    });
}

function setHighestComponentId() {
    let highestId = 0;
    $('.form-component').each(function() {
        let id = parseInt($(this).data('id'));
        if (id > highestId) {
            highestId = id;
        }
    });
    componentId = highestId;
}

function loadFormList() {
    $.ajax({
      url: 'php/get_form_list.php',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          populateFormList(response.forms);
          $('#loadFormModal').modal('show');
        } else {
          alert('Error loading form list: ' + response.message);
        }
      },
      error: function() {
        alert('An error occurred while loading the form list.');
      }
    });
  }

  function populateFormList(forms) {
    const formList = $('#formList');
    formList.empty();
    forms.forEach(form => {
      formList.append(`
        <a href="#" class="list-group-item list-group-item-action" data-form-file="${form.file}">
          ${form.name}
        </a>
      `);
    });
  }


  $('#formList').on('click', 'a', function(e) {
    e.preventDefault();
    const formFile = $(this).data('form-file');
    loadForm(formFile);
  });


  function transformAndDisplayForm(htmlContent) {
    try {
        const $componentBox = $('.component-box');
        $componentBox.empty();
        
        const $tempDiv = $('<div>').html(htmlContent);
        
        $tempDiv.children('.actual-form').each(function(index) {
            const $actualForm = $(this);
            const componentType = $actualForm.attr('class').split(/\s+/).find(cls => cls.endsWith('-marker')).replace('-marker', '');
            const componentTitle = getComponentTitle(componentType);
            const iconHtml = getComponentIcon(componentType);
            highestComponentId++; 
            const newComponent = $(`
                <div class="form-component" data-id="${highestComponentId}" data-type="${componentType}">
                    <div class="form-component-header">
                        <span class="drag-handle"><i class="fa fa-bars"></i></span>
                        <p>${componentTitle}</p>
                        <span class="form-component-icon">${iconHtml}</span>
                    </div>
                    <div class="form-component-content">
                        <div class="actual-form ${componentType}-marker"></div>
                        <div class="action-buttons">
                            <button class="edit-btn"><i class="fa fa-edit"></i></button>
                            <button class="delete-btn"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `).css({
                "margin-bottom": "10px",
                "border": "1px solid rgb(172 172 172)",
                "border-radius": "7px",
            });
            
            newComponent.find('.actual-form').html($actualForm.html());
            
            if (componentType === 'multiple-choice') {
                const $lookupContainer = newComponent.find('.lookup-container');
                if ($lookupContainer.length) {
                    $lookupContainer.after('<div class="loading-options">Loading options...</div>');
                    const lookupType = $lookupContainer.data('lookup-type');
                    const lookupId = $lookupContainer.data('lookup-id');

                    // Fetch and display the current lookup data
                    $.ajax({
                        url: '/RGBA/warehouse/php/lookup_types.php',
                        method: 'GET',
                        data: { lookupTypeId: lookupId },
                        dataType: 'json',
                        success: function(response) {
                            if (response.success && Array.isArray(response.data)) {
                                var lookupHtml = '';
                                if (lookupType === 'dropdown') {
                                    var uniqueSelectId = window.generateUniqueInputId('select');
                                    lookupHtml += `<select class="form-control" id="${uniqueSelectId}">`;
                                    response.data.forEach(function(option) {
                                        lookupHtml += `<option value="${option.id}">${option.name}</option>`;
                                    });
                                    lookupHtml += `</select>`;
                                } else {
                                    response.data.forEach(function(option) {
                                        var uniqueOptionId = window.generateUniqueInputId(`option_${lookupType}`);
                                        lookupHtml += `<div class="form-check">
                                            <input class="form-check-input" type="${lookupType}" name="options_${highestComponentId}" id="${uniqueOptionId}" value="${option.id}">
                                            <label class="form-check-label" for="${uniqueOptionId}">${option.name}</label>
                                        </div>`;
                                    });
                                }
                                $lookupContainer.siblings('.loading-options').remove();
                                
                                // Add the lookup type name if it's not already present
                                if (!$lookupContainer.find('.lookup-type-name').length) {
                                    $lookupContainer.prepend(`<p class="lookup-type-name">${response.lookupTypeName || 'Lookup Selection'}</p>`);
                                }
                                
                                $lookupContainer.after(lookupHtml);
                                makeInputsReadOnly();
                            } else {
                                $lookupContainer.siblings('.loading-options').text('Failed to load options');
                                console.error('Failed to load options:', response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            $lookupContainer.siblings('.loading-options').text('Error loading options');
                            console.error('Error loading options:', status, error);
                        }
                    });
                }
            }
            
            $componentBox.append(newComponent);
        });
        
        attachFormComponentEvents();
        makeInputsReadOnly();
    } catch (error) {
        console.error("Error in transformAndDisplayForm:", error);
    }
}

function simulateComponentAddition($container) {
    const tempComponent = $('<div class="form-component temp-component">').hide();
    $container.append(tempComponent);
    tempComponent.show().remove();
    attachFormComponentEvents();
}


function getComponentTitle(componentType) {
    const titles = {
        'input-field': 'Input Field',
        'yes-no': 'Yes/No',
        'document-upload': 'Document Upload',
        'multiple-choice': 'Multiple Choice',
        'date-time': 'Date/Time',
        'title': 'Title',
        'color-input': 'Color Input',
        'section-break': 'Section Break',
        'description': 'Description'
    };
    return titles[componentType] || 'Unknown Component';
}

window.transformAndDisplayForm = transformAndDisplayForm;
  

function getComponentIcon(componentType) {
    const icons = {
        'input-field': `<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 3C8 2.44772 8.44772 2 9 2L15 2C15.5523 2 16 2.44772 16 3C16 3.55229 15.5523 4 15 4L13 4L13 20H15C15.5523 20 16 20.4477 16 21C16 21.5523 15.5523 22 15 22H9C8.44772 22 8 21.5523 8 21C8 20.4477 8.44772 20 9 20H11L11 4H9C8.44772 4 8 3.55228 8 3ZM7.788 6L8 6C8.55229 6 9 6.44772 9 7C9 7.55228 8.55229 8 8 8H7.83C6.95898 8 6.36686 8.0008 5.90945 8.03879C5.46401 8.07578 5.23663 8.1428 5.07805 8.22517C4.71277 8.41492 4.41493 8.71276 4.22517 9.07805C4.1428 9.23663 4.07578 9.46401 4.03879 9.90945C4.0008 10.3669 4 10.959 4 11.83V12.17C4 13.041 4.0008 13.6331 4.03879 14.0905C4.07578 14.536 4.1428 14.7634 4.22517 14.9219C4.41493 15.2872 4.71277 15.5851 5.07805 15.7748C5.23663 15.8572 5.46402 15.9242 5.90945 15.9612C6.36686 15.9992 6.95898 16 7.83 16H8C8.55229 16 9 16.4477 9 17C9 17.5523 8.55229 18 8 18H7.78798C6.96946 18 6.29393 18 5.74393 17.9543C5.17258 17.9069 4.64774 17.805 4.1561 17.5497C3.42553 17.1702 2.82985 16.5745 2.45035 15.8439C2.19496 15.3523 2.0931 14.8274 2.04565 14.2561C1.99998 13.7061 1.99999 13.0305 2 12.212V11.788C1.99999 10.9695 1.99998 10.2939 2.04565 9.74393C2.0931 9.17258 2.19496 8.64774 2.45035 8.1561C2.82985 7.42553 3.42553 6.82985 4.1561 6.45035C4.64774 6.19496 5.17258 6.0931 5.74393 6.04565C6.29393 5.99998 6.96947 5.99999 7.788 6ZM18.0905 8.03879C17.6331 8.0008 17.041 8 16.17 8H16C15.4477 8 15 7.55228 15 7C15 6.44772 15.4477 6 16 6L16.212 6C17.0305 5.99999 17.7061 5.99998 18.2561 6.04565C18.8274 6.0931 19.3523 6.19496 19.8439 6.45035C20.5745 6.82985 21.1702 7.42553 21.5497 8.1561C21.805 8.64774 21.9069 9.17258 21.9543 9.74393C22 10.2939 22 10.9695 22 11.788V12.212C22 13.0305 22 13.7061 21.9543 14.2561C21.9069 14.8274 21.805 15.3523 21.5497 15.8439C21.1702 16.5745 20.5745 17.1702 19.8439 17.5497C19.3523 17.805 18.8274 17.9069 18.2561 17.9543C17.7061 18 17.0305 18 16.212 18H16C15.4477 18 15 17.5523 15 17C15 16.4477 15.4477 16 16 16H16.17C17.041 16 17.6331 15.9992 18.0905 15.9612C18.536 15.9242 18.7634 15.8572 18.9219 15.7748C19.2872 15.5851 19.5851 15.2872 19.7748 14.9219C19.8572 14.7634 19.9242 14.536 19.9612 14.0905C19.9992 13.6331 20 13.041 20 12.17V11.83C20 10.959 19.9992 10.3669 19.9612 9.90945C19.9242 9.46401 19.8572 9.23663 19.7748 9.07805C19.5851 8.71277 19.2872 8.41492 18.9219 8.22517C18.7634 8.1428 18.536 8.07578 18.0905 8.03879Z" fill="#0F1729"></path></svg>`,
        'yes-no': '<svg class="component-icon" width="29px" height="29px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M42,12H18C8.075,12,0,20.075,0,30s8.075,18,18,18h24c9.925,0,18-8.075,18-18S51.925,12,42,12z M18,38c0,0.553-0.447,1-1,1  s-1-0.447-1-1V22c0-0.553,0.447-1,1-1s1,0.447,1,1V38z M42,43c-7.168,0-13-5.832-13-13s5.832-13,13-13s13,5.832,13,13  S49.168,43,42,43z"/></svg>',
        'document-upload': '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="23px" height="23px" viewBox="0 0 32 32" version="1.1"><path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h4v-4h-4q-0.832 0-1.44-0.576t-0.576-1.408v-14.016h24v14.016q0 0.832-0.576 1.408t-1.408 0.576h-4v4h4q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 10.016v-4q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v4h-24zM6.016 8h1.984v-1.984h-1.984v1.984zM10.016 24h4v8h4v-8h4l-6.016-8zM10.016 8h1.984v-1.984h-1.984v1.984zM14.016 8h12v-1.984h-12v1.984z"/></svg>',
        'multiple-choice': '<svg class="component-icon" width="27px" height="27px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 2.5 2 C 2.224 2 2 2.224 2 2.5 L 2 4.5 C 2 4.776 2.224 5 2.5 5 L 4.5 5 C 4.776 5 5 4.776 5 4.5 L 5 2.5 C 5 2.224 4.776 2 4.5 2 L 2.5 2 z M 7 3 L 7 4 L 14 4 L 14 3 L 7 3 z M 2.5 6 A 0.50005 0.50005 0 0 0 2 6.5 L 2 8.5 A 0.50005 0.50005 0 0 0 2.5 9 L 4.5 9 A 0.50005 0.50005 0 0 0 5 8.5 L 5 6.5 A 0.50005 0.50005 0 0 0 4.5 6 L 2.5 6 z M 3 7 L 4 7 L 4 8 L 3 8 L 3 7 z M 7 7 L 7 8 L 14 8 L 14 7 L 7 7 z M 2.5 10 C 2.224 10 2 10.224 2 10.5 L 2 12.5 C 2 12.776 2.224 13 2.5 13 L 4.5 13 C 4.776 13 5 12.776 5 12.5 L 5 10.5 C 5 10.224 4.776 10 4.5 10 L 2.5 10 z M 7 11 L 7 12 L 14 12 L 14 11 L 7 11 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/></svg>',
        'date-time': '<svg class="component-icon" width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>',
        'title': '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="21px" width="21px" version="1.1" id="Capa_1" viewBox="0 0 25.531 25.531" xml:space="preserve"><g><g id="c179_text"><path d="M25.198,6.273c-0.014,0.23-0.045,0.389-0.087,0.467c-0.045,0.084-0.176,0.145-0.392,0.183    c-0.469,0.104-0.781-0.074-0.935-0.533C23.239,4.7,22.59,3.578,21.84,3.016c-1.041-0.773-2.862-1.161-5.469-1.161    c-1.054,0-1.633,0.115-1.734,0.343c-0.036,0.075-0.057,0.184-0.057,0.324v18.999c0,0.812,0.188,1.383,0.571,1.709    c0.382,0.32,1.069,0.731,2.201,0.999c0.483,0.103,0.97,0.2,1.034,0.239c0.46,0,0.504,1.057-0.376,1.057    c-0.025,0.016-10.375-0.008-10.375-0.008s-0.723-0.439-0.074-1.023c0.271-0.121,0.767-0.343,0.767-0.343s1.83-0.614,2.211-1.009    c0.434-0.445,0.648-1.164,0.648-2.154V2.521c0-0.369-0.229-0.585-0.687-0.647c-0.049-0.015-0.425-0.02-1.122-0.02    c-2.415,0-4.191,0.418-5.338,1.259C3.176,3.735,2.411,4.877,1.737,6.545C1.52,7.065,1.22,7.234,0.84,7.058    C0.408,6.957,0.251,6.719,0.363,6.353c0.445-1.374,0.668-3.31,0.668-5.814c0-0.292,0.387-0.586,1.163-0.533L23.56,0.064    c0.709-0.104,1.096,0.012,1.16,0.343C25.076,2.096,25.234,4.052,25.198,6.273z"/></g></g></svg>',
        'description': '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="27px" height="27px" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve"><path d="M44,4H8C5.8,4,4,5.8,4,8v36c0,2.2,1.8,4,4,4h36c2.2,0,4-1.8,4-4V8C48,5.8,46.2,4,44,4z M12,14  c0-0.6,0.4-1,1-1h10c0.6,0,1,0.4,1,1v10c0,0.6-0.4,1-1,1H13c-0.6,0-1-0.4-1-1V14z M36,40c0,0.6-0.4,1-1,1H13c-0.6,0-1-0.4-1-1v-2  c0-0.6,0.4-1,1-1h22c0.6,0,1,0.4,1,1V40z M40,32c0,0.6-0.4,1-1,1H13c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h26c0.6,0,1,0.4,1,1V32z   M40,24c0,0.6-0.4,1-1,1H29c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h10c0.6,0,1,0.4,1,1V24z M40,16c0,0.6-0.4,1-1,1H29  c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h10c0.6,0,1,0.4,1,1V16z"/></svg>',
        'section-break': '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line></svg>',
        'color-input': '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="24" width="24" viewBox="0 0 60 60"><g><path d="M8.212,49.758c-0.391-0.391-1.023-0.391-1.414,0l-2.5,2.5c-0.856,0.855-1.328,1.995-1.328,3.207   c0,1.211,0.472,2.351,1.328,3.207S6.293,60,7.505,60c1.211,0,2.351-0.472,3.207-1.328c1.768-1.77,1.768-4.646,0-6.414L8.212,49.758   z"></path><path d="M55.164,10.403c2.243-2.245,2.498-5.845,0.578-8.196C54.598,0.805,52.901,0,51.087,0c-1.606,0-3.112,0.622-4.242,1.751   l-3.526,3.527c-1.119,1.119-3.069,1.119-4.187,0l-0.583-0.583c-0.839-0.837-2.299-0.837-3.134,0.001L31.48,8.632   c-0.419,0.419-0.649,0.976-0.649,1.567c0,0.593,0.23,1.149,0.649,1.568l1.968,1.968L18.183,29l-0.999,0.999   c-1.562,1.562-2.727,3.501-3.395,5.688c-0.258,0.845-0.623,1.655-1.066,2.418c-0.028,0.048-0.048,0.099-0.076,0.146   c-0.022,0.036-0.05,0.069-0.072,0.105c-0.224,0.363-0.462,0.718-0.724,1.055c-0.289,0.37-0.6,0.723-0.932,1.055l-4.413,4.413   l5.656,5.656l4.375-4.374c1.354-1.353,3.037-2.355,4.87-2.898c1.289-0.383,2.501-0.979,3.618-1.721   c0.748-0.496,1.46-1.046,2.097-1.683L37.982,29h0l5.366-5.365l1.967,1.967c0.419,0.42,0.976,0.65,1.568,0.65   c0.592,0,1.148-0.23,1.567-0.649l3.936-3.936c0.864-0.864,0.864-2.271,0-3.136l-0.581-0.581c-0.56-0.56-0.867-1.303-0.867-2.094   s0.308-1.534,0.867-2.093L55.164,10.403z M35.153,29H21.011l13.851-13.851l7.071,7.071L35.153,29z"></path></g></svg>'
    };
    if (componentType === 'user') {
        return '<svg class="component-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    }
    return icons[componentType] || '';
}
