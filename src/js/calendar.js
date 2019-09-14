window.onload = function() {
  /* Calendar */
  var calendarBoxes = document.querySelectorAll('.calendar .day');
  var calendarBoxNumbers = document.querySelectorAll('.day-number');
  var monthHeader = document.querySelector('.curr-month');
  var yearHeader = document.querySelector('.curr-year');

  /* Tags */
  var addTagBtn = document.querySelector('.btn-add-tag');
  var tagModal = document.querySelector('.tag-modal');
  var tagEmoji = tagModal.querySelector('.tag-emoji');
  var emojiPicker = tagModal.querySelector('emoji-picker');

  /* Sets calendar to current month */
  var date = new Date();
  setCalendar(date.getMonth());

  /* Sets calendar to given month */
  function setCalendar(month) {
    var date = new Date();
    date.setMonth(month);
    monthHeader.innerHTML = date.toLocaleString('default', { month: 'long' });
    yearHeader.innerHTML = " " + (date.getYear() + 1900);

    date.setDate(1); // sets date to the 1st of current month
    var day = date.getDay(); // gets day of week for the 1st
  
    var lastDay = new Date(date.getYear(), month + 1, 0); // sets date to last day of current month
    var daysInMonth = lastDay.getDate(); // gets the number of days in current month
  
    date.setDate(0); // sets date to last day of previous month
    var endOfPrevDate = date.getDate();

    var today = (new Date()).getDate();

    /* Sets the calendar days */
    for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
      calendarBoxNumbers[i].textContent = endOfPrevDate - day + i + 1;
      calendarBoxes[i].classList.add('not-current');
    }
    for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
      calendarBoxNumbers[day + i].textContent = i + 1;
      if((i + 1) == today) calendarBoxes[day + i].classList.add('today');
    }
    for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
      calendarBoxNumbers[day + daysInMonth + i].textContent = i + 1;
      calendarBoxes[day + daysInMonth + i].classList.add('not-current');
    }
  }

  addTagBtn.addEventListener('click', function() {
    tagModal.classList.remove('hide');
  });

  tagEmoji.addEventListener('click', function() {
    emojiPicker.classList.toggle('hide');
  });

  // TODO: should we store the day values?
  // TODO: add class for current date
  // TODO: add class for days from other months
  // TODO: add pagination
  // TODO: add drag and drop
}