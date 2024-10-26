// Global state
let currentTooltip = null;
let isTooltipPinned = false;
let currentTooltipElement = null;

// Create tooltip element
function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-i';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    return tooltip;
}

// Position tooltip relative to element
function positionTooltip(element, tooltip) {
    if (!element || !tooltip) return;

    const rect = element.getBoundingClientRect();
    let top, left;

    if (element.closest('.left-side')) {
        // Position to the right for sidebar elements
        top = rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2);
        left = rect.right + 10;
    } else {
        // Position above for other elements
        top = rect.top - tooltip.offsetHeight - 5;
        left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
        left = Math.max(5, Math.min(left, window.innerWidth - tooltip.offsetWidth - 5));
    }

    top = Math.max(5, top);
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.classList.add('visible');
}

// Update or create tooltip
function updateTooltip(element) {
    if (!element) return;

    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;

    removeTooltip();

    currentTooltip = createTooltip(tooltipText);
    currentTooltipElement = element;
    positionTooltip(element, currentTooltip);

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
}

// Scroll handler
function handleScroll() {
    if (currentTooltipElement && currentTooltip) {
        positionTooltip(currentTooltipElement, currentTooltip);
    }
}

// Remove tooltip
function removeTooltip() {
    if (currentTooltip && currentTooltip.parentNode) {
        currentTooltip.parentNode.removeChild(currentTooltip);
        window.removeEventListener('scroll', handleScroll);
    }
    currentTooltip = null;
}

function toggleMenu(event) {
    const menu = document.getElementById("collapseLookup");
    const processItems = menu.querySelector('.process-items');
    const regularItems = Array.from(menu.querySelectorAll('.collapse-item')).filter(item => !item.closest('.process-items'));
    
    // Check which icon was clicked
    const clickedIcon = event.target.closest('.task-page, .dashboard-page');
    const isTaskIcon = clickedIcon.classList.contains('task-page');
    const isDashboardIcon = clickedIcon.classList.contains('dashboard-page');

    // If menu is already visible and we click a different icon, just switch content
    if (menu.style.display === "block") {
        if ((isTaskIcon && regularItems[0].style.display !== 'none') || 
            (isDashboardIcon && regularItems[0].style.display === 'none')) {
            // Switch menu contents
            if (isTaskIcon) {
                regularItems.forEach(item => item.style.display = 'none');
                processItems.style.display = 'block';
            } else {
                regularItems.forEach(item => item.style.display = 'block');
                processItems.style.display = 'none';
            }
            // Update position for new icon
            const iconRect = clickedIcon.getBoundingClientRect();
            menu.style.left = `${iconRect.right}px`;
            menu.style.top = `${iconRect.top}px`;

            isTooltipPinned = true;
            updateTooltip(clickedIcon);
            return;
        }
    }

    // Normal toggle behavior if clicking same icon or menu is closed
    const isVisible = menu.style.display === "block";
    menu.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
        // Show appropriate menu items
        if (isTaskIcon) {
            regularItems.forEach(item => item.style.display = 'none');
            processItems.style.display = 'block';
        } else {
            regularItems.forEach(item => item.style.display = 'block');
            processItems.style.display = 'none';
        }

        const iconRect = clickedIcon.getBoundingClientRect();
        menu.style.left = `${iconRect.right}px`;
        menu.style.top = `${iconRect.top}px`;
        menu.style.animation = "growIn 200ms forwards";
        
        isTooltipPinned = true;
        updateTooltip(clickedIcon);
    } else {
        menu.style.animation = "none";
        isTooltipPinned = false;
        removeTooltip();
        currentTooltipElement = null;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mouseover handler
    document.body.addEventListener('mouseover', function(event) {
        const target = event.target.closest('[data-tooltip]');
        if (target && !isTooltipPinned) {
            updateTooltip(target);
        }
    });

    // Mouseout handler
    document.body.addEventListener('mouseout', function(event) {
        const relatedTarget = event.relatedTarget;
        if (!isTooltipPinned && (!relatedTarget || !relatedTarget.closest('[data-tooltip]'))) {
            removeTooltip();
            currentTooltipElement = null;
        }
    });

    // Click handler for document
    document.body.addEventListener('click', function(event) {
        const menu = document.getElementById("collapseLookup");
        if (event.target.closest(".dashboard-page") === null && 
            event.target.closest(".task-page") === null && 
            !menu.contains(event.target)) {
            menu.style.display = "none";
            menu.style.animation = "none";
            isTooltipPinned = false;
            removeTooltip();
            currentTooltipElement = null;
        }
    }, true);


});