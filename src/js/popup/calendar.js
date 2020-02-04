import db from '../../util/firebase';

let tags; // all of the user's tags
let dayTags; // the tags added for the current day

/* Formats the given number as two digits */
const formatDigit = (num) => (num < 10 ? `0${num}` : num);

/* Generate the full date (YYYY-MM-DD) */
const date = new Date();
const month = formatDigit((date.getMonth() + 1) % 13);
const day = formatDigit(date.getDate());
export const fullDate = `${date.getYear() + 1900}-${month}-${day}`; // the current day in YYYY-MM-DD format

/* Sets today's date in the popup template */
function setDate() {
  const dayOfWeek = document.querySelector('.day-of-week');
  const dayNum = document.querySelector('.day-number');
  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

  // set date in popup template
  dayOfWeek.textContent = daysOfWeek[date.getDay()];
  dayNum.textContent = date.getDate();
}


/* Gets the day tags */
export function getDayTags() {
  return dayTags;
}

/* Gets the tags */
export function getTags() {
  return tags;
}

/* Grabs the tags for the current day and displays them in the popup template */
export function setTags(userId) {
  // get all of the tags (title, color, icon) from the database
  db.ref(`users/${userId}/tags`).once('value').then((snapshot1) => {
    tags = snapshot1.val();
    if (tags) {
      // get the tags for the current day from the database
      db.ref(`users/${userId}/tagged/${fullDate}`).once('value').then((snapshot) => {
        dayTags = snapshot.val();
        if (dayTags) {
          // tagData will store an array of tags which include id, title, icon, color
          const tagData = Object.keys(dayTags).map((tagId) => ({
            ...tags[tagId],
            id: tagId,
          }));

          const tagWrapper = document.querySelector('.day-tags');
          let tagWrapperInner = '';
          // create the tags and append to popup template
          tagData.forEach((tag) => {
            tagWrapperInner += `<div class="day-tag ${tag.color}" id="${tag.id}">${tag.icon}</div>`;
          });
          tagWrapper.insertAdjacentHTML('afterbegin', tagWrapperInner); // adding day tags to the template
        }
      });

      Object.keys(tags).forEach((id) => { // add the tag ids to the each tag object
        tags[id].id = id;
      });
    } else { // show message if user has no tags
      document.querySelector('.has-tags').classList.add('hide');
      document.querySelector('.no-tags-msg').classList.remove('hide');
    }
  });
}


/* Initialize the Calendar date and cta */
export function initCalendar() {
  /* Opens the calendar page in a new tab when clicking on the View Calendar button */
  const calendarBtn = document.querySelector('.view-cal');
  calendarBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.extension.getURL('index.html') });
  });

  setDate(); // sets the current date in the template
}
