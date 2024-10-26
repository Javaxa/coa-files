$(document).ready(function() {
    let capturedImage = null; 

    $('#registerButton').on('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showCodeModal();
        }
    });

    $('#profilePicture').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                capturedImage = e.target.result;
                displayCapturedImage(capturedImage);
            };
            reader.readAsDataURL(file);
        }
    });

   
    function verifyCodeAndRegister() {
        const code = $('#registrationCode').val().trim();
        const formData = new FormData();
        formData.append('email', $('#email').val());
        formData.append('firstname', $('#firstname').val());
        formData.append('lastname', $('#lastname').val());
        formData.append('password', $('#password').val());
        formData.append('registrationCode', code);
        formData.append('phone', $('#phone').val());
        formData.append('address', $('#address').val());
        formData.append('birthday', $('#birthday').val());

        if (capturedImage) {
            formData.append('profilePicture', dataURItoBlob(capturedImage), 'profile.png');
        } else if ($('#profilePicture')[0].files[0]) {
            formData.append('profilePicture', $('#profilePicture')[0].files[0]);
        }



        $.ajax({
            url: '/RGBA/warehouse/php/registerUser.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert("Registration successful! You may now log in.");
                window.location.href = 'login.html';
            },
            error: function(xhr, status, error) {
                alert("Registration failed: " + xhr.responseText);
                if (xhr.status === 403) {
                    $('#registrationCode').val('');
                } else {
                    $('#codeModal').hide();
                }
            }
        });
    }

    $('#captureButton').on('click', function() {
        const video = $('#cameraStream')[0];
        const canvas = $('#photoCanvas')[0];
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedImage = canvas.toDataURL('image/png');
        displayCapturedImage(capturedImage);

        $('#cameraStream').hide();
        $('#captureButton').hide();
    });

    $('#openCameraButton').on('click', function() {
        const video = $('#cameraStream')[0];
        const constraints = { video: true };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                video.srcObject = stream;
                $('#cameraStream').show();
                $('#captureButton').show();
            })
            .catch(function(err) {
                console.log('Error accessing camera: ' + err);
            });
    });

   
    function displayCapturedImage(imageSrc) {
        $('.captured-image-container').remove();
        const imageContainer = $('<div>').addClass('captured-image-container');
        const image = $('<img>').attr('src', imageSrc).addClass('captured-image');
        const deleteIcon = $('<i>').addClass('fas fa-times delete-icon');
        imageContainer.append(image).append(deleteIcon);
        $('#cameraArea').prepend(imageContainer);
        deleteIcon.on('click', function() {
            imageContainer.remove();
            capturedImage = null;
            $('#cameraStream').show();
            $('#captureButton').show();
            $('#openCameraButton').show();
        });
    }
  

    $('#password').on('input', function() {
        validatePassword();
    });

    $('.close').on('click', function() {
        closeModal();
    });

    $('#submitCode').on('click', function() {
        verifyCodeAndRegister();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#codeModal')) {
            closeModal();
        }
    });
});

function validateForm() {
    var requiredFields = ['email', 'firstname', 'lastname', 'password'];
    var isValid = true;
    requiredFields.forEach(function(field) {
        var $field = $('#' + field);
        if ($field.val().trim() === '') {
            isValid = false;
            $field.addClass('is-invalid');
            if (!$field.next('.invalid-feedback').length) {
                $field.after('<div class="invalid-feedback">This field is required.</div>');
            }
            $field.next('.invalid-feedback').show();
        } else {
            $field.removeClass('is-invalid');
            $field.next('.invalid-feedback').hide();
        }
    });

    var email = $('#email').val().trim();
    if (!validateEmail(email)) {
        isValid = false;
        $('#email').addClass('is-invalid');
        if (!$('#email').next('.invalid-feedback').length) {
            $('#email').after('<div class="invalid-feedback">Please enter a valid email address.</div>');
        }
        $('#email').next('.invalid-feedback').show();
    } else {
        $('#email').removeClass('is-invalid');
        $('#email').next('.invalid-feedback').hide();
    }
    var passwordValid = validatePassword();
    return isValid && passwordValid;
}


function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword() {
    const password = $('#password').val();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    if (!passwordRegex.test(password)) {
        $('#password').addClass('is-invalid');
        $('#passwordFeedback').text('Password must contain at least 8 characters, including 1 uppercase letter, 1 number, and 1 special character.').show();
        return false;
    } else {
        $('#password').removeClass('is-invalid');
        $('#passwordFeedback').hide();
        return true;
    }
}

function showCodeModal() {
    $('#codeModal').show();
}

function closeModal() {
    $('#codeModal').hide();
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}


