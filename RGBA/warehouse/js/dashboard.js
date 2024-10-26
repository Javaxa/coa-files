let currentDate = new Date();
let existingData = [];
let departmentMapping = {};
let isAllTasksView = false;

function updateAccountInfo() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            const fullName = `${loggedInUser.firstname} ${loggedInUser.lastname}`;
            $('#accountName').text(fullName);
            $('#accountTitle').text(loggedInUser.department);
        }
    }


    function updateProfilePicture() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.profilePicture) {
            const profilePicElement = document.getElementById('userProfilePicture');
            if (profilePicElement) {
                profilePicElement.src = loggedInUser.profilePicture;
            }
        }
    }


	document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            window.open(this.getAttribute('data-url'), '_blank');
        });
    });

	function updateDashboardTasks() {
    const taskTableBody = $('#taskTableBody');
    taskTableBody.empty();

    existingData.forEach(function(task, index) {
        const row = $('<tr>');
        const timeConstraint = getCountdownText(task.startDate, task.endDate);
        const timeConstraintClass = getTimeConstraintClass(timeConstraint);

        row.append($('<td>').append($('<span>').addClass(`time ${timeConstraintClass}`).text(timeConstraint)));
        row.append($('<td>').text(task.title));
        
        const associatedUser = task.assignedToName || departmentMapping[task.departmentId] || 'Unknown Department';
        row.append($('<td>').text(associatedUser));
        
        row.append($('<td>').text(task.category));
        
        const statusClass = getStatusClass(task.status);
        const statusIcon = getStatusIcon(task.status);
        const statusText = formatStatus(task.status);

        row.append($('<td>').append(
            $('<div>').addClass(`status ${statusClass}`).append(statusIcon, statusText)
        ));
        
        row.attr('data-description', task.description);
        
        taskTableBody.append(row);
    });

    addTooltipListeners();
}


function addTooltipListeners() {
    const taskRows = document.querySelectorAll('#calendar2 #taskTableBody tr:not(.no-tasks-row)');
    const tooltip = document.createElement('div');
    tooltip.className = 'task-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    function handleMouseEnter(e) {
        const description = this.getAttribute('data-description');
        if (description) {
            tooltip.textContent = description;
            tooltip.style.display = 'block';
            positionTooltip(e);
        }
    }

    function handleMouseMove(e) {
        positionTooltip(e);
    }

    function handleMouseLeave() {
        tooltip.style.display = 'none';
    }

    function positionTooltip(e) {
        const tooltipWidth = tooltip.offsetWidth;
        const windowWidth = window.innerWidth;
        let left = e.pageX - (tooltipWidth / 2);

        // Ensure tooltip doesn't go off screen
        if (left < 0) left = 0;
        if (left + tooltipWidth > windowWidth) left = windowWidth - tooltipWidth;

        tooltip.style.left = left + 'px';
        tooltip.style.top = (e.pageY - 40) + 'px';
    }

    taskRows.forEach(row => {
        row.addEventListener('mouseenter', handleMouseEnter);
        row.addEventListener('mousemove', handleMouseMove);
        row.addEventListener('mouseleave', handleMouseLeave);
    });
}

	function getStatusClass(status) {
        switch(status) {
            case 'completed': return 'is-green';
            case 'in-progress': return 'is-wait';
            case 'not-completed': return 'is-red';
            default: return '';
        }
    }


$(document).ready(function() {
    initializeDashboard();

    $(".my-tasks").click(function() {
        var url = $(this).data('url');
        window.location.href = url;
    });

    $('#createTaskButton').on('click', function(e) {
        e.preventDefault();
        const tasksUrl = $(this).data('url');
        localStorage.setItem('openTaskModal', 'true');
        window.location.href = tasksUrl;
    });
});

function initializeDashboard() {
    loadExistingData()
        .then(() => {
            initializeCalendar();
            loadDepartmentData();
            updateProfilePicture();
            updateAccountInfo();
            initializeTaskViewModal();
            setTimeout(() => {
                loadTasksForCurrentDate();
            }, 500);
        })
        .catch(error => {
            console.error('Error initializing dashboard:', error);
        });
}

function getTimeUntilCompletion(endDate) {
    const now = new Date();
    const end = parseDate(endDate);
    
    if (!end) return null;
    
    const diff = end - now;
    if (diff <= 0) return "Task Due";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
}

function getDisplayedDate() {
    const dateText = $('#calendar2 .cards-header-date .title').text();
    return new Date(dateText);
}

function initializeCalendar() {
    window.updateCalendar2(new Date());  // Use the new updateCalendar2 function

    $('#calendar2 .feather-chevron-left').on('click', function() {
        if (isAllTasksView) {
            exitAllTasksView();
        }
        window.currentDate.setDate(window.currentDate.getDate() - 1);
        window.updateCalendar2(window.currentDate);
    });

    $('#calendar2 .feather-chevron-right').on('click', function() {
        if (isAllTasksView) {
            exitAllTasksView();
        }
        window.currentDate.setDate(window.currentDate.getDate() + 1);
        window.updateCalendar2(window.currentDate);
    });

    $('#allTasksBtn').on('click', function() {
        toggleAllTasksView();
    });

    $('.today-dot').on('click', function() {
        if (isAllTasksView) {
            exitAllTasksView();
        }
        currentDate = new Date();
        updateCalendarHeader();
        loadTasksForCurrentDate();
    });

    linkCalendars();
    updateCalendar1Highlight();
}

function toggleAllTasksView() {
    isAllTasksView = !isAllTasksView;
    if (isAllTasksView) {
        $('#viewModeText').text('All Tasks View');
        $('#allTasksBtn').addClass('active').text('Calendar View');
        loadAllTasks();
    } else {
        exitAllTasksView();
    }
}

function exitAllTasksView() {
    isAllTasksView = false;
    $('#allTasksBtn').removeClass('active').text('All Tasks');
    loadTasksForCurrentDate();
}

function loadAllTasks() {
    const taskTableBody = $('#calendar2 #taskTableBody');
    taskTableBody.empty();

    existingData.forEach(function(task) {
        const row = createTaskRow(task);
        taskTableBody.append(row);
    });

    addTooltipListeners();
}

function linkCalendars() {
    const dateItems = $('#calendar1 .items.numbers .item');

    dateItems.on('click', function() {
        const day = $(this).text();
        const monthYear = $('#calendar1 .cards-header-date .title').text().split(' ');
        let month = monthYear[0];
        let year = monthYear[1];

        if ($(this).hasClass('disable')) {
            if ($(this).index() < 7) {
                const prevMonth = new Date(year, monthYear.indexOf(month) - 1, 1);
                month = prevMonth.toLocaleString('default', { month: 'long' });
                year = prevMonth.getFullYear();
            } else {
                const nextMonth = new Date(year, monthYear.indexOf(month) + 1, 1);
                month = nextMonth.toLocaleString('default', { month: 'long' });
                year = nextMonth.getFullYear();
            }
        }

        const selectedDate = new Date(`${month} ${day}, ${year}`);

        currentDate = selectedDate;
        updateCalendarHeader();
        loadTasksForCurrentDate();

        if (isAllTasksView) {
            exitAllTasksView();
        }

        updateCalendar1Highlight();
    });
}


function updateCalendar1Highlight() {
    const dateItems = document.querySelectorAll('#calendar1 .items.numbers .item');
    const currentMonthYearElement = document.querySelector('#calendar1 .cards-header-date .title');
    
    if (!currentMonthYearElement) {
        console.error('Calendar header element not found');
        return;
    }

    const currentMonthYear = currentMonthYearElement.textContent.split(' ');
    const currentMonth = currentMonthYear[0];
    const currentYear = currentMonthYear[1];
    const today = new Date();

    dateItems.forEach(item => {
        item.classList.remove('is-active', 'displaying');
    });

    // Highlight today's date
    if (today.getFullYear().toString() === currentYear &&
        today.toLocaleString('default', { month: 'long' }) === currentMonth) {
        const todayItem = dateItems[today.getDate() - 1];
        if (todayItem) {
            todayItem.classList.add('is-active');
        }
    }

    // Highlight the date displayed in calendar2
    if (window.currentDate && 
        window.currentDate.getFullYear().toString() === currentYear &&
        window.currentDate.toLocaleString('default', { month: 'long' }) === currentMonth) {
        const currentDateItem = dateItems[window.currentDate.getDate() - 1];
        if (currentDateItem) {
            currentDateItem.classList.add('displaying');
        }
    }
}

function updateCalendarHeader() {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    $('#calendar2 .cards-header-date .title').text(window.currentDate.toLocaleDateString('en-US', options));
    window.updateCalendar1Highlight();
}

function loadTasksForCurrentDate() {
    const displayedDate = getDisplayedDate();
  
    if (isAllTasksView) {
        loadAllTasks();
        return;
    }

    const taskTableBody = $('#calendar2 #taskTableBody');
    taskTableBody.empty();

    let tasksFound = false;

    existingData.forEach(function(task) {
        if (isTaskActiveOnDate(task, displayedDate)) {
            const row = createTaskRow(task);
            taskTableBody.append(row);
            tasksFound = true;
        }
    });

    if (!tasksFound) {
        const noTasksMessage = $('<tr class="no-tasks-row"><td colspan="5" style="text-align: center; padding: 20px;">No tasks for selected date</td></tr>');
        taskTableBody.append(noTasksMessage);
    }

    addTooltipListeners();
}

function isTaskActiveOnDate(task, date) {
    const startDate = parseDate(task.startDate);
    const endDate = parseDate(task.endDate);
    const creationDate = parseDate(task.createdAt);
    const today = new Date();

    if (startDate && !endDate) {
        return isSameDate(startDate, date);
    }

    if (!startDate && !endDate) {
        return creationDate <= date;
    }

    if (!startDate && endDate) {
        if (endDate < today) {
            return isSameDate(endDate, date);
        } else {
            return creationDate <= date && date <= endDate;
        }
    }

    if (startDate && endDate) {
        return startDate <= date && date <= endDate;
    }

    return false;
}


function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function createTaskRow(task) {
    const row = $('<tr>');
    if (task.id === undefined) {
        console.error('Task is missing ID:', task);
    } else {
    }
    row.attr('data-task-id', task.id);

    const timeConstraint = getCountdownText(task.startDate, task.endDate);
    const timeConstraintClass = getTimeConstraintClass(timeConstraint);

    row.append($('<td>').append($('<span>').addClass(`time ${timeConstraintClass}`).text(timeConstraint)));
    row.append($('<td>').text(task.title));
    
    const associatedUser = task.assignedToName || departmentMapping[task.departmentId] || 'Unknown Department';
    row.append($('<td>').text(associatedUser));
    
    row.append($('<td>').text(task.category));
    
    const statusClass = getStatusClass(task.status);
    const statusIcon = getStatusIcon(task.status);
    const statusText = formatStatus(task.status);

    row.append($('<td>').append(
        $('<div>').addClass(`status ${statusClass}`).append(statusIcon, statusText)
    ));
    
    // Add data attribute for description (for tooltip)
    row.attr('data-description', task.description);
    
    return row;
}

function getCountdownText(startDate, endDate) {
    const now = new Date();
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start && !end) return 'In Process';
    if (start && now < start) {
        const countdown = getTimeUntilStart(start);
        return `Scheduled - Starting in ${countdown}`;
    }
    if (end && now > end) return `Task Due - ${formatDate(end)}`;
    
    if (end && now <= end) {
        const countdown = getTimeUntilCompletion(end);
        return `Time till completion: ${countdown}`;
    }
    if (start && now >= start && !end) return 'In Process (No End Date)';
    return 'In Process';
}

function initializeTaskViewModal() {
    $(document).on('click', '#calendar2 #taskTableBody tr:not(.no-tasks-row)', function() {
        const taskId = $(this).data('task-id');
        if (taskId === undefined) {
            console.error('Task ID is undefined. Row HTML:', $(this).prop('outerHTML'));
            return;
        }

        const taskToView = existingData.find(task => task.id === taskId);
        
        if (!taskToView) {
            console.error('Task not found:', taskId);
            return;
        }
        updateTaskViewModal(taskToView);
        $('#taskViewModal').modal('show');
    });
}

  function getPriorityText(priorityLevel) {
    switch(priorityLevel) {
      case 'critical1':
        return 'Critical 1 - Send Reminder Email Every Hour';
      case 'critical2':
        return 'Critical 2 - Send Reminder Email Every Day';
      case 'critical3':
        return 'Critical 3 - Send Reminder Email Every Week';
      default:
        return 'Unknown Priority';
    }
  }

  function formatDateTimeForDisplay(dateString) {
    const date = parseDate(dateString);
    if (!date) return 'Not set';
    
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

    function getTimeUntilStart(start) {
        const now = new Date();
        const diff = start - now;
        
        if (diff <= 0) return "Starting now";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
    }

    function getTimeUntilCompletion(end) {
        const now = new Date();
        const diff = end - now;
        
        if (diff <= 0) return "Task Due";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
    }

    function updateTaskViewModal(task) {
        $('#viewTitle').text(task.title);
        $('#viewDescription').text(task.description);
        $('#viewDepartment').text(task.departmentName || departmentMapping[task.departmentId] || 'Unknown Department');
        $('#viewAssignedTo').text(task.assignedToName || 'Not Assigned');
        
        const priorityText = getPriorityText(task.priorityLevel);
        $('#viewPriority').html(`<span class="priority-badge ${task.priorityLevel}">${priorityText}</span>`);
        
        const statusClass = getStatusClass(task.status);
        const statusText = formatStatus(task.status);
        $('#viewTaskStatus').html(`<span class="status-badge ${statusClass}">${statusText}</span>`);
        
        $('#viewStartDate').text(formatDateTimeForDisplay(task.startDate));
        $('#viewEndDate').text(formatDateTimeForDisplay(task.endDate));
        
        $('#viewCategory').text(task.category);
        $('#viewCategory').attr('class', `task-category category-${task.category.toLowerCase()}`);
        
        $('#viewCreatedAt').text(formatDateTimeForDisplay(task.createdAt));
        $('#viewUpdatedAt').text(formatDateTimeForDisplay(task.updatedAt));
        
        if (task.createdBy) {
            $('#viewCreatedBy').text(`${task.createdBy.firstname} ${task.createdBy.lastname} (${task.createdBy.department})`);
        } else {
            $('#viewCreatedBy').text('Unknown User');
        }
    }

function updateCountdowns() {
    $('.task-card').each(function() {
        const $card = $(this);
        const startDate = $card.data('start-date');
        const endDate = $card.data('end-date');
        const $countdown = $card.find('.countdown');
        const countdownText = getCountdownText(startDate, endDate);
        
    
        if (countdownText) {
            $countdown.text(countdownText).show();
            
            // Update the class based on the countdown text
            $countdown.removeClass('is-scheduled is-due is-deadline in-process');
            if (countdownText.includes('Scheduled')) {
                $countdown.addClass('is-scheduled');
            } else if (countdownText.includes('Task Due')) {
                $countdown.addClass('is-due');
            } else if (countdownText.includes('Time till completion')) {
                $countdown.addClass('is-deadline');
            } else {
                $countdown.addClass('in-process');
            }
        } else {
            $countdown.hide();
        }
    });
}


function getTimeConstraintClass(timeConstraint) {
        if (timeConstraint.includes('In Process')) return 'is-in-process';
        if (timeConstraint.includes('Scheduled')) return 'is-scheduled';
        if (timeConstraint.includes('Task Due')) return 'is-due';
        if (timeConstraint.includes('Time till completion')) return 'is-deadline';
        return '';
    }

  function getStatusIcon(status) {
        let iconSvg;
        switch(status) {
            case 'completed':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>';
                break;
            case 'in-progress':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>';
                break;
            case 'not-completed':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>';
                break;
            default:
                iconSvg = '';
        }
        return $(iconSvg);
    }

    function updateEmployeeCard() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) return;
    
        const completedTasks = existingData.filter(task => 
            task.assignedToId == loggedInUser.id && 
            task.status === 'completed'
        ).length;
    
        const activeTasks = existingData.filter(task => 
            task.assignedToId == loggedInUser.id && 
            task.status !== 'completed'
        ).length;
    
        // Calculate completion percentage
        const totalTasks = completedTasks + activeTasks;
        const completionPercentage = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;
    
        // Get the most recently completed task
        const lastCompletedTask = existingData
            .filter(task => 
                task.assignedToId == loggedInUser.id && 
                task.status === 'completed'
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    
        // Update the UI
        $('.employee-info .subtitle-count').first().text(completedTasks);
        $('.employee-info .subtitle-count.dist').text(activeTasks);
        $('.counter').text(completionPercentage + '%');
        
        // Update the pie chart
        updatePieChart(completionPercentage);
        
        // Update last completed task info
        if (lastCompletedTask) {
            $('.employee-profile .employee-type').text(lastCompletedTask.title);
        } else {
            $('.employee-profile .employee-type').text('No completed tasks');
        }
    }
    
    function updatePieChart(percentage) {
        const circle = document.querySelector('.circle circle');
        if (!circle) return;
    
        const radius = parseInt(circle.getAttribute('r'));
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference * (1 - percentage / 100);
    }
    
    // Add click handler for "View My Tasks" button
    $(document).ready(function() {
        // Inject updated SVG structure into the existing circle div
        $('.circle').html(`
            <div class="pie">
                <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke-width="12" />
                </svg>
            </div>
            <div class="counter">0%</div>
        `);
    
        // Add to your existing ready function
        $('.my-tasks').click(function(e) {
            e.preventDefault();
            window.location.href = '/RGBA/warehouse/mypage.html';
        });
    
        // Update the employee card whenever data is loaded
        loadExistingData().then(() => {
            updateEmployeeCard();
        });
    });
    
    // Update styles
    const style = document.createElement('style');
    style.textContent = `
        .circle {
            position: relative;
            width: 120px;
            height: 120px;
        }
    
        .pie {
            position: relative;
            width: 100%;
            height: 100%;
        }
    
        .pie svg {
            width: 100%;
            height: 100%;
            transform: rotate(90deg);
            overflow: visible;
        }
    
        .pie circle {
            fill: none;
            stroke: #2c64cd;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.8s ease-in-out;
            transform-origin: center;
        }
    
        .counter {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.2em;
            font-weight: bold;
            color: #2c64cd;
        }
    
        /* Add a background circle */
        .pie::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 12px solid #eee;
        }
    `;
    document.head.appendChild(style);
    
    // Update the loadExistingData function to trigger employee card update
    function loadExistingData() {
        return new Promise((resolve, reject) => {
            $.getJSON('json/process_data.json?' + new Date().getTime(), function(data) {
                existingData = data;
                updateEmployeeCard(); // Update whenever data is loaded
                resolve(existingData);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Error loading existing data:', textStatus, errorThrown);
                if (jqXHR.status === 404) {
                    existingData = [];
                    updateEmployeeCard(); // Update even if no data
                    resolve(existingData);
                } else {
                    reject(errorThrown);
                }
            });
        });
    }

 function loadDepartmentData() {
        $.getJSON('json/departments.json', function(data) {
            data.departments.forEach(function(department) {
                departmentMapping[department.id] = department.name;
            });
            updateDashboardTasks();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading department data:', textStatus, errorThrown);
        });
    }


    function parseDate(dateString) {
        if (!dateString) return null;
        
        // Try parsing as ISO format first
        let date = new Date(dateString);
        
        // If invalid, try parsing custom format "DD/MM/YYYY HH:mm"
        if (isNaN(date.getTime())) {
            const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
            if (parts) {
                date = new Date(parts[3], parts[2] - 1, parts[1], parts[4], parts[5]);
            }
        }
        
        return isNaN(date.getTime()) ? null : date;
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }


function formatCountdown(now, end) {
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Time till completion: ${days}d ${hours}h ${minutes}m`;
}

function formatStatus(status) {
        const statusMap = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'not-completed': 'Not Completed'
        };
        return statusMap[status] || status;
    }
