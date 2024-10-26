$(document).ready(function() {
    // Check if user is logged in
    checkLoginStatus();

    // Login form submission
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        performLogin();
    });

    // Logout functionality
    $(document).on('click', '#logoutButton', function(e) {
        e.preventDefault();
        logout();
    });
});

function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        showLoggedInState(loggedInUser);
    }
}

function performLogin() {
    const email = $('#email').val().trim().toLowerCase(); // Convert to lowercase
    const password = $('#password').val();

    if (!email || !password) {
        showError("Please enter both email and password.");
        return;
    }

    const loginButton = document.getElementById('loginButton');
    loginButton.innerHTML = '<div class="spinner"></div>';
    loginButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        $.ajax({
            url: '/RGBA/warehouse/json/user_data.json',
            dataType: 'json',
            success: function(users) {
                const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
                if (user) {
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    showLoggedInState(user);
                } else {
                    showError('Invalid email or password');
                }
            },
            error: function(xhr, status, error) {
                showError('An error occurred. Please try again later.');
                console.error("Error fetching user data:", status, error);
            },
            complete: function() {
                loginButton.innerHTML = 'Login';
                loginButton.disabled = false;
            }
        });
    }, 1000);
}

function showLoggedInState(user) {
    $('#loginForm').hide();
    $('.user-menu').removeClass('d-none');
    $('#userFirstName').text(user.firstname);
    
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('loggedInUser');
    $('.user-menu').addClass('d-none');
    $('#loginForm').show();
    $('#email').val('');
    $('#password').val('');
}

function showError(message) {
    const errorElement = $('<div class="alert alert-danger"></div>').text(message);
    $('.login-form').prepend(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
}