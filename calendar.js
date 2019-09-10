window.onload = function() {
  var calendarBoxes = document.querySelectorAll('.calendar .day');
  var monthHeader = document.querySelector('.curr-month');

  // sets calendar to current month
  var date = new Date();
  setCalendar(date.getMonth());

  function setCalendar(month) {
    var date = new Date();
    date.setMonth(month);
    monthHeader.textContent = date.toLocaleString('default', { month: 'long' });

    date.setDate(1); // sets date to the 1st of current month
    var day = date.getDay(); // gets day of week for the 1st
  
    var lastDay = new Date(date.getYear(), month + 1, 0); // sets date to last day of current month
    var daysInMonth = lastDay.getDate(); // gets the number of days in current month
  
    date.setDate(0); // sets date to last day of previous month
    var endOfPrevDate = date.getDate();

    /* Sets the calendar days */
    for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
      calendarBoxes[i].textContent = endOfPrevDate - day + i + 1;
    }
    for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
      calendarBoxes[day + i].textContent = i + 1;
    }
    for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
      calendarBoxes[day + daysInMonth + i].textContent = i + 1;
    }
  }

  // TODO: should we store the day values?
  // TODO: add class for current date
  // TODO: add class for days from other months
  // TODO: add pagination
  // TODO: add drag and drop
}