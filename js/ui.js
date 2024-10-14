
document.addEventListener('DOMContentLoaded', function() {
    let tooltip;
    let isTooltipPinned = false;
    let currentTooltipElement = null;
    document.body.addEventListener('mouseover', function(event) {
        const target = event.target.closest('[data-tooltip]');
        if (target && !isTooltipPinned) {
            createAndPositionTooltip(target);
            currentTooltipElement = target; 
        }
    });

    document.body.addEventListener('mouseout', function(event) {
        const relatedTarget = event.relatedTarget;
        if (currentTooltipElement && !isTooltipPinned && (!relatedTarget || !relatedTarget.closest('[data-tooltip]'))) {
            removeTooltip();
            currentTooltipElement = null;
        }
    });

    document.body.addEventListener('click', function(event) {
        const target = event.target.closest('[data-tooltip]');
        if (target) {
            if (target.classList.contains('dashboard-page')) {
                isTooltipPinned = !isTooltipPinned;
                if (isTooltipPinned) {
                    if (currentTooltipElement !== target) {
                        createAndPositionTooltip(target);
                        currentTooltipElement = target;
                    }
                } else {
                    removeTooltip();
                    currentTooltipElement = null;
                }
            }
        } else if (!event.target.closest('.tooltip-i') && !event.target.closest('.collapse-inner')) {
            isTooltipPinned = false;
            removeTooltip();
            currentTooltipElement = null;
        }
    });

    function createAndPositionTooltip(element) {
        if (tooltip) {
            tooltip.parentNode.removeChild(tooltip);
            tooltip = null;
        }
        
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip-i';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        positionTooltip(element);

        // Add event listener for scroll events
        window.addEventListener('scroll', () => positionTooltip(element));
    }

    function positionTooltip(element) {
        if (!tooltip) return;

        const rect = element.getBoundingClientRect();
        let top, left;

        if (element.closest('.left-side')) {
            top = rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2);
            left = rect.right + 10;
        } else {
            top = rect.top - tooltip.offsetHeight - 5;
            left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
            left = Math.max(5, Math.min(left, window.innerWidth - tooltip.offsetWidth - 5));
            top = Math.max(5, top);
        }

        tooltip.style.position = 'fixed';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.classList.add('visible');
    }

    function removeTooltip() {
        if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
            tooltip = null;
        }
        // Remove scroll event listener when tooltip is removed
        window.removeEventListener('scroll', positionTooltip);
    }
});