import { userId } from './calendar.js';
import { toggleDayModal } from './day-modal.js';

/*=================== Variables ===================*/

const tagsList = document.querySelector('.tags-list');

const calendarBoxes = document.querySelectorAll('.calendar .day');
const calendarBoxNumbers = document.querySelectorAll('.day-number');

var date = new Date();
var currentMonth = date.getMonth();
var currentYear = (date.getYear() + 1900);

/*=================== Functions ===================*/

/**
 * Sets calendar to given month w/ correct dates and tags
 * TODO: split up & clean up code
 */
export function setCalendar(month) {
  const monthHeader = document.querySelector('.curr-month');
  const yearHeader = document.querySelector('.curr-year');

  let currMonth = new Date();
  currMonth.setMonth(month);
  monthHeader.innerHTML = currMonth.toLocaleString('default', { month: 'long' });
  yearHeader.innerHTML = ` ${currMonth.getYear() + 1900}`;

  currMonth.setDate(1); // sets date to the 1st of current month
  let day = currMonth.getDay(); // gets day of week for the 1st

  let lastDay = new Date(currMonth.getYear(), month + 1, 0); // sets date to last day of current month
  let daysInMonth = lastDay.getDate(); // gets the number of days in current month

  let prevMonth = new Date();
  prevMonth.setMonth(month);
  prevMonth.setDate(0); // sets date to last day of previous month
  let endOfPrevDate = prevMonth.getDate();

  let today = (new Date()).getDate();

  // Sets the calendar days
  for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
    calendarBoxNumbers[i].textContent = endOfPrevDate - day + i + 1;
    calendarBoxes[i].classList.add('not-current');
    calendarBoxes[i].setAttribute('data-tag-day', '' + formatDigit(prevMonth.getMonth() + 1) + formatDigit(endOfPrevDate - day + i + 1));
  }
  for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
    calendarBoxNumbers[day + i].textContent = i + 1;
    if ((i + 1) == today) calendarBoxes[day + i].classList.add('today');
    calendarBoxes[day + i].setAttribute('data-tag-day', '' + formatDigit(currMonth.getMonth() + 1) + formatDigit(i + 1));
  }
  for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
    calendarBoxNumbers[day + daysInMonth + i].textContent = i + 1;
    calendarBoxes[day + daysInMonth + i].classList.add('not-current');
    calendarBoxes[day + daysInMonth + i].setAttribute('data-tag-day', '' + formatDigit(currMonth.getMonth() + 2) + formatDigit(i + 1));
  }


  // Gets tags for current month from the database & adds them to the calendar
  dbGetDayTags(userId, formatDigit(date.getMonth() + 1), currentYear).then((taggedDays) => {
    if (taggedDays) {
      const tags = Object.keys(taggedDays); // lists of days that have tags
      tags.forEach((tag) => {
        const days = Object.keys(taggedDays[tag]);
        days.forEach((day) => {
          appendDayTag(document.querySelector(`[data-tag-day="${day}"]`), tag);
        });
      });
    }
  });

  // Opens modal when clicking on a calendar day
  calendarBoxes.forEach((calBox) => {
    calBox.addEventListener('click', toggleDayModal);
  });
}


/**
 * Creates tag element and appends it to a specific calendar day in the dom.
 */
export function appendDayTag(target, tagId) {
  let toAdd = document.createElement('div');
  let tagFromList = tagsList.querySelector(`#${tagId}`);

  toAdd.className = `day-tag ${tagFromList.getAttribute('data-tag-color')}`;
  toAdd.textContent = tagFromList.getAttribute('data-tag-icon');
  toAdd.setAttribute('data-day-tag-id', tagId);
  target.querySelector('.day-tags').appendChild(toAdd);
}


/**
 * Formats the given number as two digits
 */
export function formatDigit(num) {
  return num < 10 ? `0${num}` : num;
}


/*=================== Drag & Drop ===================*/
/**
 * Handles drop event on calendar
 * Adds dropped tag to calendar for that specific day
 */
export function tagDrop(e) { 
  if (e.stopPropagation) { e.stopPropagation(); }

  // creates tag elements
  if (e.currentTarget.classList.contains('day')) {
    e.currentTarget.classList.remove('chosen-day');
    let droppedTagId = e.dataTransfer.getData('text/plain');
    const droppedTag = document.querySelector(`#${droppedTagId}`);

    // adds tag to calendar & database if not already there
    if (!(e.currentTarget.querySelector(`[data-day-tag-id="${droppedTagId}"`))) {
      let toAdd = document.createElement('div');
      toAdd.className = `day-tag ${droppedTag.getAttribute('data-tag-color')}`;
      toAdd.textContent = droppedTag.getAttribute('data-tag-icon');
      toAdd.setAttribute('data-day-tag-id', droppedTagId);
      e.currentTarget.querySelector('.day-tags').appendChild(toAdd);

      // stores tag in database
      dbCreateDayTag(userId, { id: droppedTagId, date: e.currentTarget.getAttribute('data-tag-day') }, formatDigit(currentMonth + 1), currentYear);
    }
  }
}


/**
 * Handles drag over event on calendar
 */
function tagDragOver(e) {
  if (e.preventDefault) { e.preventDefault(); } // allows drop to happen
}


/**
 * Handles drag enter event on calendar
 */
function tagDragEnter(e) {
  if (e.target.classList.contains('day')) { e.target.classList.add('chosen-day'); }// adds bg color to calendar day
}


/**
 * Handles drag leave event on calendar
 */
function tagDragLeave(e) {
  if (e.target.classList.contains('day')) {  e.target.classList.remove('chosen-day'); } // removes bg color from calendar day
}

// Adds drag & drop events to each calendar day
(function() {
  calendarBoxes.forEach((calBox) => {
    calBox.addEventListener('dragover', tagDragOver, false);
    calBox.addEventListener('dragenter', tagDragEnter, false);
    calBox.addEventListener('dragleave', tagDragLeave, false);
    calBox.addEventListener('drop', tagDrop, false);
  });
})()