
function loadSubElements(selectElement, lookupTypeId) {
    $.ajax({
        url: '/warehouse/php/lookup_types.php',
        method: 'GET',
        data: { lookupTypeId: lookupTypeId },
        dataType: 'json',
        success: function(response) {
            if (response.success && Array.isArray(response.data)) {
                selectElement.empty();
                response.data.forEach(function(subElement) {
                    selectElement.append($('<option>', {
                        value: subElement.id,
                        text: subElement.name
                    }));
                });
            } else {
                console.error('Failed to load sub-elements:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching sub-elements:', status, error);
        }
    }); 
}

function createDropdownHtml(data, lookupId) {
let html = `<select class="form-control" name="dropdown_${lookupId}">`;
html += '<option value="" disabled selected>Select an option</option>';
data.forEach(function(option) {
    html += `<option value="${option.id}">${option.name}</option>`;
});
html += '</select>';
return html;
}

function createCheckboxOrRadioHtml(data, type, lookupId) {
let html = '';
data.forEach(function(option) {
    const uniqueId = `option_${type}_${lookupId}_${option.id}`;
    html += `
        <div class="form-check">
            <input class="form-check-input" type="${type}" name="options_${type}" id="${uniqueId}" value="${option.id}">
            <label class="form-check-label" for="${uniqueId}">${option.name}</label>
        </div>
    `;
});
return html;
}


function loadLookupData() {
return new Promise((resolve, reject) => {
    let lookupContainers = $('#formContainer .lookup-container');
    let loadedCount = 0;

    if (lookupContainers.length === 0) {
        resolve();
        return;
    }

    lookupContainers.each(function() {
        const $container = $(this);
        const lookupType = $container.data('lookup-type');
        const lookupId = $container.data('lookup-id');

        $.ajax({
            url: '/warehouse/php/lookup_types.php',
            method: 'GET',
            data: { lookupTypeId: lookupId },
            dataType: 'json',
            success: function(response) {
                if (response.success && Array.isArray(response.data)) {
                    let lookupHtml = '';
                    const existingLookupName = $container.find('.lookup-type-name').text();
                    if (lookupType === 'dropdown') {
                        lookupHtml = createDropdownHtml(response.data, lookupId);
                    } else if (lookupType === 'radio') {
                        lookupHtml = createCheckboxOrRadioHtml(response.data, 'radio', lookupId);
                    } else if (lookupType === 'checkbox') {
                        lookupHtml = createCheckboxOrRadioHtml(response.data, 'checkbox', lookupId);
                    }
                    $container.html(`<p class="lookup-type-name">${existingLookupName}</p>${lookupHtml}`);
                } else {
                    console.error('Failed to load lookup data:', response.message);
                    $container.append('<p>Failed to load options</p>');
                }

                loadedCount++;
                if (loadedCount === lookupContainers.length) {
                    resolve();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading lookup data:', status, error);
                $container.append('<p>Error loading options</p>');
                loadedCount++;
                if (loadedCount === lookupContainers.length) {
                    resolve();
                }
            }
        });
    });
});
}


function setupYesNoButtons() {
$(document).off('click', '.yes-no-container .form-check').on('click', '.yes-no-container .form-check', function(e) {
    if ($(this).hasClass('disabled')) {
        e.preventDefault();
        return;
    }
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
  


window.addEventListener('message', function(event) {
if (event.data.type === 'submissionData') {
    var submission = event.data.data;
    if (submission && submission.formId) {
        loadForm(submission.formId, submission);
    } else {
        alert('Error: Invalid submission data received');
    }
}
});

function loadForm(formId, submissionData) {
if (!formId || !submissionData.filename) {
    alert('Error: Form ID or filename is undefined');
    return;
}
var ajaxUrl = 'php/load_form_submission.php';
$.ajax({
    url: ajaxUrl,
    method: 'GET',
    data: { 
        formId: formId,
        submissionFile: submissionData.filename
    },
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            submissionData.formName = response.formName;
            displayForm(response.htmlContent, submissionData);
        } else {
            alert("Error loading form: " + response.message + "\n\nPlease check the debug log for more information.");
        }
    },
    error: function(xhr, status, error) {
        console.error("Full XHR object:", xhr);
        alert("An error occurred while loading the form: " + error + "\n\nPlease check the console for more information.");
    }
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


function displayForm(htmlContent, submissionData) {
$('#formContainer').html(htmlContent);
loadLookupData().then(() => {
    populateFormWithSubmissionData(submissionData);
});
}

function populateFormWithSubmissionData(submissionData) {
$('#formContainer').find('input, select, textarea').prop('disabled', true);

$('#formContainer').find('.yes-no-container .form-check').addClass('disabled').css('pointer-events', 'none');

for (var key in submissionData) {
    var $input = $('#formContainer').find(`[name="${key}"], #${key}, [data-field="${key}"]`);
    if ($input.length) {
        if ($input.is(':radio') || $input.is(':checkbox')) {
            $input.filter(`[value="${submissionData[key]}"]`).prop('checked', true);
            if ($input.closest('.yes-no-container').length) {
                updateYesNoContainerStyling($input.closest('.yes-no-container'), submissionData[key]);
            }
        } else if ($input.is('select')) {
            $input.val(submissionData[key]);
            $input.find('option:not(:selected)').prop('disabled', true);
        } else if ($input.hasClass('file-input')) {
            var $wrapper = $input.closest('.file-upload-wrapper');
            if (submissionData[key]) {
                var fileInfo = {
                    name: submissionData[key],
                    url: `uploads/${submissionData[key]}`,
                    type: submissionData[key].split('.').pop().toLowerCase() === 'jpg' ? 'image/jpeg' : 'application/octet-stream'
                };
                displayFilePreview(fileInfo, $wrapper);
            }
        } else {
            $input.val(submissionData[key]);
        }
    } else if (key.startsWith('dropdown_') || key.startsWith('options_checkbox') || key.startsWith('options_radio')) {
        handleLookupInput(key, submissionData[key], key.startsWith('dropdown_') ? 'dropdown' : (key.includes('checkbox') ? 'checkbox' : 'radio'));
    }
}

if (submissionData.munsell_color) {
    $('.picked-color').val(submissionData.munsell_color);
}

let userDropdownCounter = 0;
$('.user-component').each(function() {
    var $component = $(this);
    userDropdownCounter++;
    var selectId = `user-select-${userDropdownCounter}`;
    var userData = submissionData[selectId];

    if (userData) {
        $component.find('p').html(`<strong>Department:</strong> ${userData.department}`);
        var $userSelect = $(`<select class="form-control user-select" id="${selectId}" disabled></select>`);
        $userSelect.append(`<option value="${userData.userId}" selected>${userData.userName}</option>`);
        $component.append($userSelect);
    } else {
        var departmentName = $component.find('p').text().replace('Department: ', '');
        $component.find('p').html(`<strong>Department:</strong> ${departmentName}`);
        var $userSelect = $(`<select class="form-control user-select" id="${selectId}" disabled></select>`);
        $userSelect.append('<option selected>No user selected</option>');
        $component.append($userSelect);
    }
});

var metadataHtml = `
<div class="container-wrapper">
    <div class="alert alert-info mt-3">
        <strong>Title:</strong> ${submissionData.formName || 'Unnamed Form'}<br>
        <strong>User:</strong> ${submissionData.submittedBy}<br>
        <strong>Date:</strong> ${new Date(submissionData.submissionDate).toLocaleString()}
    </div>
</div>
`;
$('#formContainer').prepend(metadataHtml);
}

function displayFilePreview(fileInfo, $wrapper) {
    $wrapper.find('.file-preview').remove();

    if (fileInfo.name) {
        $wrapper.find('.file-chosen').hide();
    } else {
        $wrapper.find('.file-chosen').show().text('No file chosen');
    }

    const fileExtension = fileInfo.name.split('.').pop().toLowerCase();
    let iconClass = 'file-icon-default'; 

    switch (fileExtension) {
        case 'pdf':
            iconClass = 'file-icon-pdf';
            break;
        case 'doc':
        case 'docx':
            iconClass = 'file-icon-word';
            break;
        case 'xls':
        case 'xlsx':
            iconClass = 'file-icon-excel';
            break;
        case 'ppt':
        case 'pptx':
            iconClass = 'file-icon-powerpoint';
            break;
        case 'txt':
            iconClass = 'file-icon-text';
            break;
        case 'jpg':
        case 'jpeg':
        case 'webp':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'tiff':
        case 'heic':
        case 'heif':
            iconClass = 'file-icon-image';
            break;
        case 'mp3':
        case 'm4a':
        case 'wav':
        case 'ogg':
            iconClass = 'file-icon-audio';
            break;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            iconClass = 'file-icon-video';
            break;
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            iconClass = 'file-icon-archive';
            break;
        case 'html':
        case 'css':
        case 'js':
        case 'php':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
            iconClass = 'file-icon-code';
            break;
    }

    const fileUrl = fileInfo.url || `uploads/${fileInfo.name}`;

    // Updated image formats array to include HEIC/HEIF
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'heic', 'heif'];
    
    if (imageFormats.includes(fileExtension)) {
        const previewHtml = `
            <div class="file-preview">
                <img src="${fileUrl}" alt="Preview" class="img-preview" style="max-width: 200px; max-height: 200px; cursor: pointer;">
            </div>
        `;
        $wrapper.append(previewHtml);

        // Add error handling for image loading
        $wrapper.find('.img-preview').on('error', function() {
            $(this).parent().html(`
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i> Unable to load image preview
                    <br>
                    <a href="${fileUrl}" target="_blank" class="btn btn-sm btn-primary mt-2">Download Image</a>
                </div>
            `);
        });

        $wrapper.find('.img-preview').on('click', function() {
            showImageModal(fileUrl, fileInfo.name);
        });
    } else {
        const previewHtml = `
            <div class="file-preview">
                <a href="#" class="file-download-link" data-file-url="${fileUrl}" data-file-name="${fileInfo.name}" data-file-type="${fileExtension}">
                    <div class="file-icon ${iconClass}"></div>
                    <span class="file-name">${fileInfo.name}</span>
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
}

function showDocumentViewer(fileUrl, fileName, fileType) {
    const viewerUrl = getViewerUrl(fileUrl, fileType);
    $('#documentViewerModalLabel').text(fileName);
    $('#documentViewer').attr('src', viewerUrl);
    
    var documentViewerModal = new bootstrap.Modal(document.getElementById('documentViewerModal'));
    documentViewerModal.show();
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

var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
imageModal.show();
}

function handleLookupInput(key, value, type) {
var lookupId = key.split('_').pop();
var $container = $(`[data-lookup-id="${lookupId}"]`);

if ($container.length === 0) {
    return;
}

var $input = type === 'dropdown' ? $container.find('select') : $container.find(`input[type="${type}"]`);

if ($input.length > 0) {
    if (type === 'dropdown') {
        $input.val(value);
    } else {
        $input.filter(`[value="${value}"]`).prop('checked', true);
    }
    
    if (type === 'dropdown') {
        $input.find('option:not(:selected)').prop('disabled', true);
    } else {
        $input.not(':checked').prop('disabled', true);
    }
}
}
