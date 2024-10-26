function isLoggedIn() {
    const loggedIn = localStorage.getItem('loggedInUser') !== null;

    return loggedIn;
}

function getCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();
    return currentPage;
}

function redirectToLogin() {
    window.location.href = '/RGBA/warehouse/login.html';
}

function protectPage() {
    const currentPage = getCurrentPage();
    const isLoginPage = currentPage === 'login.html';

    if (!isLoggedIn() && !isLoginPage) {
        redirectToLogin();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    protectPage();
});

window.addEventListener('load', function() {
    protectPage();
});

window.addEventListener('storage', function(event) {
    if (event.key === 'loggedInUser' && event.newValue === null) {
        protectPage();
    }
});

window.logout = function() {
    localStorage.removeItem('loggedInUser');
    redirectToLogin();
};

protectPage();




