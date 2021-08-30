import { db } from '../../util/firebase';
import { populateWidget } from './addWidget';
import { isMac } from '../../util/utility';

let tags; // all of the user's tags
let orderedTags; // list of user's tags in order
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


/* Returns the a list of tag objects with the given ids */
function getTagData(tagIds, orderedTags, tags) {
  if (tagIds) {
    const tagData = [];
    if (tagIds.length > 1) {
      let count = 0;
      for (let i = 0; i < orderedTags.length; i++) {
        if (tagIds.includes(orderedTags[i].id)) {
          count++;
          tagData.push(orderedTags[i]);
          if (count == orderedTags.length) break;
        }
      }
    } else {
      tagData.push({ ...tags[tagIds[0]], id: tagIds[0] });
    }
    return tagData;
  }
  return null;
}


/* Grabs the tags for the current day and displays them in the popup template */
export function setTags(userId) {
  // get all of the tags (title, color, icon) from the database
  db.ref(`users/${userId}/tags`).orderByChild('order').once('value').then((snapshot1) => {
    tags = snapshot1.val();
    
    orderedTags = [];
    snapshot1.forEach((child) => { // gets tags in order
      orderedTags.push({
        ...child.val(),
        id: child.key,
      });
    });

    if (orderedTags.length) {
      // get the tags for the current day from the database
      db.ref(`users/${userId}/tagged/${fullDate}`).once('value').then((snapshot) => {
        dayTags = snapshot.val();
        if (dayTags) {
          // tagData will store an array of tags which include id, title, icon, color
          const tagData = getTagData(Object.keys(dayTags), orderedTags, tags);
          
          const tagWrapper = document.querySelector('.day-tags');
          let tagWrapperInner = '';
          // create the tags and append to popup template
          tagData.forEach((tag) => {
            const { color, id, icon, title } = tag;
            let emojiHTML = isMac ? `<span>${icon.native}</span>` : `<emoji-icon emoji="${icon.id}"></emoji-icon>`;

            tagWrapperInner += `<div class="day-tag ${color}" id="${id}" title="${title}">${emojiHTML}</div>`;
          });
          tagWrapper.insertAdjacentHTML('afterbegin', tagWrapperInner); // adding day tags to the template
        }
        populateWidget(orderedTags, dayTags);
      });

    } else { // show message if user has no tags
      document.querySelector('.has-tags').classList.add('hide');
      document.querySelector('.no-tags-msg').classList.remove('hide');
      document.querySelector('.loading-dots').classList.add('hide');
    }
  });
}

/* Clears the tags and day tags variables */
export function clearTags() {
  tags = null;
  dayTags = null;
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
