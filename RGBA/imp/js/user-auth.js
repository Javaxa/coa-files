// user-auth.js

$(document).ready(function() {
    // Check if user is logged in
    function checkLoggedInUser() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            showLoggedInState(loggedInUser);
            loadNavbar();
        } else {
            showLoggedOutState();
        }
    }

    // Show logged-in state
    function showLoggedInState(user) {
        $('#userFirstName').text(user.firstname);
        $('.user-menu').removeClass('d-none');
        $('.login-button').addClass('d-none');
    }

    // Show logged-out state
    function showLoggedOutState() {
        $('.user-menu').addClass('d-none');
        $('.login-button').removeClass('d-none');
        // Ensure navbar is empty when logged out
        $("#navbar").empty();
    }

    // Load navbar
    function loadNavbar() {
        $("#navbar").load("/warehouse/navbar.html", function() {
            // This callback function runs after the navbar is loaded
        });
    }

 
    // Logout functionality
    function setupLogout() {
        $(document).on('click', '#logoutButton', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            showLoggedOutState();
            window.location.href = '/warehouse/login.html'; // Redirect to login page
        });
    }

    // Initialize
    function init() {
        checkLoggedInUser();
        setupLogout();
    }

    init();
});