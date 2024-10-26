// Function to check if user is logged in
function isLoggedIn() {
    const loggedIn = localStorage.getItem('loggedInUser') !== null;
    return loggedIn;
}

// Function to get the current page name
function getCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();
    return currentPage;
}

// Function to redirect to login page
function redirectToLogin() {
    window.location.href = '/warehouse/login.html';
}

// Function to protect pages
function protectPage() {
    const currentPage = getCurrentPage();
    const isLoginPage = currentPage === 'login.html';

    if (!isLoggedIn() && !isLoginPage) {
        redirectToLogin();
    } else {
        console.log('Page access granted.');
    }
}

// Run protection check when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    protectPage();
});

// Also run protection check when the page is fully loaded (including all resources)
window.addEventListener('load', function() {
    protectPage();
});

// Add event listener for storage changes to handle logout in other tabs
window.addEventListener('storage', function(event) {
    if (event.key === 'loggedInUser' && event.newValue === null) {

        protectPage();
    }
});

// Expose logout function globally
window.logout = function() {
    localStorage.removeItem('loggedInUser');
    redirectToLogin();
};

// Initial check on script load
protectPage();

