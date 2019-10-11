import { userId } from './calendar.js';
import { toggleDayModal } from './day-modal.js';

var tagsList = document.querySelector('.tags-list');

var calendarBoxes = document.querySelectorAll('.calendar .day');
var calendarBoxNumbers = document.querySelectorAll('.day-number');

var date = new Date();
var currentMonth = date.getMonth();
var currentYear = (date.getYear() + 1900);


export function setCalendar(month) {
  var monthHeader = document.querySelector('.curr-month');
  var yearHeader = document.querySelector('.curr-year');

  var currMonth = new Date();
  currMonth.setMonth(month);
  monthHeader.innerHTML = currMonth.toLocaleString('default', { month: 'long' });
  yearHeader.innerHTML = ` ${currMonth.getYear() + 1900}`;

  currMonth.setDate(1); // sets date to the 1st of current month
  var day = currMonth.getDay(); // gets day of week for the 1st

  var lastDay = new Date(currMonth.getYear(), month + 1, 0); // sets date to last day of current month
  var daysInMonth = lastDay.getDate(); // gets the number of days in current month

  var prevMonth = new Date();
  prevMonth.setMonth(month);
  prevMonth.setDate(0); // sets date to last day of previous month
  var endOfPrevDate = prevMonth.getDate();

  var today = (new Date()).getDate();

  // Sets the calendar days
  for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
    calendarBoxNumbers[i].textContent = endOfPrevDate - day + i + 1;
    calendarBoxes[i].classList.add('not-current');
    calendarBoxes[i].setAttribute('data-tag-day', '' + formatDigit(prevMonth.getMonth() + 1) + formatDigit(endOfPrevDate - day + i + 1));
  }
  for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
    calendarBoxNumbers[day + i].textContent = i + 1;
    if((i + 1) == today) calendarBoxes[day + i].classList.add('today');
    calendarBoxes[day + i].setAttribute('data-tag-day', '' + formatDigit(currMonth.getMonth() + 1) + formatDigit(i + 1));
  }
  for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
    calendarBoxNumbers[day + daysInMonth + i].textContent = i + 1;
    calendarBoxes[day + daysInMonth + i].classList.add('not-current');
    calendarBoxes[day + daysInMonth + i].setAttribute('data-tag-day', '' + formatDigit(currMonth.getMonth() + 2) + formatDigit(i + 1));
  }


  dbGetDayTags(userId, formatDigit(date.getMonth() + 1), currentYear).then((taggedDays) => {
    if(taggedDays) {
      var tags = Object.keys(taggedDays); // lists of days that have tags
      tags.forEach((tag) => {
        var days = Object.keys(taggedDays[tag]);
        days.forEach((day) => {
          appendDayTag(document.querySelector(`[data-tag-day="${day}"]`), tag);
        });
      });
    }
  });

  for(var i = 0; i < calendarBoxes.length; i++) { 
    calendarBoxes[i].addEventListener('click', toggleDayModal); // opens modal when clicking on a calendar day
  }
}

/* Creates tag element and appends it to calendar day the dom */
export function appendDayTag(target, tagId) {
  var toAdd = document.createElement('div');
  var tagFromList = tagsList.querySelector('#' + tagId);
  toAdd.className = "day-tag " + tagFromList.getAttribute('data-tag-color');
  toAdd.textContent = tagFromList.getAttribute('data-tag-icon');
  toAdd.setAttribute("data-day-tag-id", tagId);
  target.querySelector('.day-tags').appendChild(toAdd);
}


export function formatDigit(num) {
  return num < 10 ? ('0' + num) : num;
}

var droppedTagId; var droppedTag;
export function tagDrop(e) { // adds dropped tag to calendar for a specific day
  if(e.stopPropagation) {
    e.stopPropagation();
  }

  // create tag element
  if(e.currentTarget.classList.contains("day")) {
    e.currentTarget.classList.remove('chosen-day');
    droppedTagId = e.dataTransfer.getData('text/plain');
    droppedTag = document.querySelector(`#${droppedTagId}`);

    if(!(e.currentTarget.querySelector(`#day-tag-${droppedTagId}`))) {
      var toAdd = document.createElement('div');
      toAdd.className = "day-tag " + droppedTag.getAttribute('data-tag-color');
      toAdd.textContent = droppedTag.getAttribute('data-tag-icon');
      toAdd.setAttribute("data-day-tag-id", droppedTagId);
      e.currentTarget.querySelector('.day-tags').appendChild(toAdd);

      // store tag 
      dbCreateDayTag(userId, { id: droppedTagId, date: e.currentTarget.getAttribute('data-tag-day') }, formatDigit(currentMonth + 1), currentYear);
    }
  }
}


function tagDragOver(e) {
  if (e.preventDefault) e.preventDefault(); // allows drop
}

function tagDragEnter(e) {
  if(e.target.classList.contains("day")) {
    e.target.classList.add('chosen-day');
  }
}

function tagDragLeave(e) {
  if(e.target.classList.contains("day")) {
    e.target.classList.remove('chosen-day');
  }
}


for (var i = 0; i < calendarBoxes.length; i++) {
  calendarBoxes[i].addEventListener('dragover', tagDragOver, false);
  calendarBoxes[i].addEventListener('dragenter', tagDragEnter, false);
  calendarBoxes[i].addEventListener('dragleave', tagDragLeave, false);
  calendarBoxes[i].addEventListener('drop', tagDrop, false);
}