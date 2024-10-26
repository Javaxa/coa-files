// Calendar and Weather functionality
document.addEventListener('DOMContentLoaded', function() {
  const calendarWrapper = document.querySelector('.calendar-prototype');
  const monthYearElement = calendarWrapper.querySelector('.title');
  const prevButton = calendarWrapper.querySelector('.feather-chevron-left');
  const nextButton = calendarWrapper.querySelector('.feather-chevron-right');
  const daysContainer = calendarWrapper.querySelector('.items.numbers');
  const weatherElement = calendarWrapper.querySelector('.degree');
  const todayButton = document.querySelector('.today-dot');

  let currentDate = new Date();
  let displayedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  function updateCalendar() {
    monthYearElement.textContent = `${monthNames[displayedDate.getMonth()]} ${displayedDate.getFullYear()}`;
    
    const daysInMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
    
    daysContainer.innerHTML = '';

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'item disable';
      daysContainer.appendChild(emptyDay);
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'item';
      dayElement.textContent = i;

      const currentDay = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), i);
      
      // Check if the day is in the past
      if (currentDay < new Date().setHours(0, 0, 0, 0)) {
        dayElement.classList.add('past-day');
      }

      daysContainer.appendChild(dayElement);
    }

    updateCalendar1Highlight();
    attachCalendar1EventListeners();
  }

  function attachCalendar1EventListeners() {
    const dateItems = document.querySelectorAll('#calendar1 .items.numbers .item:not(.disable)');

    dateItems.forEach(item => {
      item.addEventListener('click', function() {
        const day = parseInt(this.textContent);
        currentDate = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
        window.currentDate = currentDate; // Ensure window.currentDate is set
        updateCalendarHeader();
        loadTasksForCurrentDate();

        // Deselect "All Tasks" view in calendar2
        deselectAllTasksView();

        updateCalendar1Highlight();
      });
    });
  }

  function updateCalendar1Highlight() {
    const dateItems = document.querySelectorAll('#calendar1 .items.numbers .item:not(.disable)');
    const today = new Date();

    dateItems.forEach(item => {
      item.classList.remove('is-active', 'displaying');
    });

    // Highlight today's date if it's in the displayed month
    if (today.getFullYear() === displayedDate.getFullYear() &&
        today.getMonth() === displayedDate.getMonth()) {
      const todayItem = Array.from(dateItems).find(item => parseInt(item.textContent) === today.getDate());
      if (todayItem) {
        todayItem.classList.add('is-active');
      }
    }

    // Highlight the selected date if it's in the displayed month
    if (currentDate.getFullYear() === displayedDate.getFullYear() &&
        currentDate.getMonth() === displayedDate.getMonth()) {
      const currentDateItem = Array.from(dateItems).find(item => parseInt(item.textContent) === currentDate.getDate());
      if (currentDateItem) {
        currentDateItem.classList.add('displaying');
      }
    }
  }

  function updateCalendar2(date) {
    currentDate = date;
    window.currentDate = date; // Ensure window.currentDate is set
    
    // Update displayedDate to show the month of the selected date
    displayedDate = new Date(date.getFullYear(), date.getMonth(), 1);
    updateCalendar();
    
    updateCalendarHeader();
    loadTasksForCurrentDate();
  }

  function deselectAllTasksView() {
    // Deselect "All Tasks" view in calendar2
    const allTasksBtn = document.getElementById('allTasksBtn');
    if (allTasksBtn) {
      allTasksBtn.classList.remove('active');
      allTasksBtn.textContent = 'All Tasks';
    }
    window.isAllTasksView = false;
  }

  function goToToday() {
    const today = new Date();
    currentDate = today;
    window.currentDate = today;
    displayedDate = new Date(today.getFullYear(), today.getMonth(), 1);
    updateCalendar();
    updateCalendarHeader();
    loadTasksForCurrentDate();
    deselectAllTasksView();
  }

  function navigateCalendar1(direction) {
    // Only change the displayed month, not the selected date
    displayedDate.setMonth(displayedDate.getMonth() + direction);
    updateCalendar();
  }

  function navigateCalendar2(direction) {
    currentDate.setDate(currentDate.getDate() + direction);
    window.currentDate = currentDate;

    // Update displayedDate if we've moved to a new month
    if (currentDate.getMonth() !== displayedDate.getMonth() || currentDate.getFullYear() !== displayedDate.getFullYear()) {
      displayedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      updateCalendar();
    }

    updateCalendarHeader();
    loadTasksForCurrentDate();
  }

  // Modify the prevButton and nextButton event listeners for calendar1
  prevButton.addEventListener('click', function() {
    navigateCalendar1(-1);
  });

  nextButton.addEventListener('click', function() {
    navigateCalendar1(1);
  });

  // Add event listener for the "Today" button
  if (todayButton) {
    todayButton.addEventListener('click', goToToday);
  }

  // Initial calendar and weather update
  updateCalendar();
  attachCalendar1EventListeners();

  // Expose necessary functions to the global scope
  window.updateCalendar1Highlight = updateCalendar1Highlight;
  window.updateCalendar2 = updateCalendar2;
  window.currentDate = currentDate;
  window.deselectAllTasksView = deselectAllTasksView;
  window.goToToday = goToToday;
  window.navigateCalendar2 = navigateCalendar2;
});