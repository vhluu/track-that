import db from '../util/firebase';

let tags, dayTags; // the user's tags and current day tags
const initialVals = new Map(); // map to store the initial values of the tag checkboxes
let userId; // user id
let month, day, fullDate; // stores current date information

/* Formats the given number as two digits */
const formatDigit = (num) => (num < 10 ? `0${num}` : num);

/* The Sign In and Sign Out button elements */
const signinBtn = document.querySelector('.google-signin');
const signoutBtn = document.querySelector('.google-signout');

/* Show the Sign In button only */
function showSignIn() {
  signinBtn.classList.remove('hide');
  signoutBtn.classList.add('hide');
}

/* Show the Sign Out button only */
function showSignOut() {
  signinBtn.classList.add('hide');
  signoutBtn.classList.remove('hide');
}

/** Gets the login status of the user
 * Takes a boolean which indicates whether to start the login progress 
 */
function retrieveLoginStatus(startLogin) {
  // communicate to background script that we want to retrieve the login status
  chrome.extension.sendMessage({ greeting: 'hello from popup', login: startLogin }, (response) => {
    if (response && response.email) { // if user is signed in
      showSignOut(); // hide Sign In button and show Sign Out button
      userId = response.userId;
      setTags(); // sets the tags in the popup template
    } else {
      console.log("Couldn't get email address of profile user.");
      showSignIn();
    }
  });
}


/* Sets today's date in the popup template */
function setDate() {
  const date = new Date();
  const dayOfWeek = document.querySelector('.day-of-week');
  const dayNum = document.querySelector('.day-number');
  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

  // sets date in popup template
  dayOfWeek.textContent = daysOfWeek[date.getDay()];
  dayNum.textContent = date.getDate();
}


/* Grabs the tags for the current day and displays them in the popup template */
function setTags() {
  // generate the full date (YYYY-MM-DD)
  const date = new Date();
  month = formatDigit((date.getMonth() + 1) % 13);
  day = formatDigit(date.getDate());
  fullDate = `${date.getYear() + 1900}-${month}-${day}`;

  // get the tags for the current day from the database
  db.ref(`users/${userId}/tagged/${fullDate}`).once('value').then((snapshot) => {
    dayTags = snapshot.val();
    if (dayTags) {
      // get the tag info (title, color, icon) from the database
      db.ref(`users/${userId}/tags`).once('value').then((snapshot1) => {
        tags = snapshot1.val();
        if (tags) {
          const tagData = Object.keys(dayTags).map((tagId) => tags[tagId]);
          const tagWrapper = document.querySelector('.day-tags');
          let tagWrapperInner = '';
          // create the tags and append to popup template
          tagData.forEach((tag) => {
            tagWrapperInner += `<div class="day-tag ${tag.color}">${tag.icon}</div>`;
          });
          tagWrapper.insertAdjacentHTML('afterbegin', tagWrapperInner); // adding day tags to the template
        }
      });
    }
  });
}


/* Opens the add tag area when clicking on the + (add) button */
function initAddBtn() {
  const addBtn = document.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    const addTagWrapper = document.querySelector('.add-tag-wrapper');
    const allTags = addTagWrapper.querySelector('.all-tags');
    // display the user's tags
    if (!(addTagWrapper.classList.contains('open')) && tags && allTags.children.length === 0) {
      let tagHTML = '';

      Object.keys(tags).forEach((tagId) => {
        const tag = tags[tagId];
        const isFound = dayTags[tagId] ? 'checked' : '';
        initialVals.set(tagId, isFound);
        tagHTML += `
          <div>
            <input type="checkbox" id="checkbox-${tagId}" data-cb-id="${tagId}" class="hide" ${isFound} />
            <label for="checkbox-${tagId}"><div class="day-tag ${tag.color}">${tag.icon}</div></label>
          </div>
        `;
      });
      allTags.insertAdjacentHTML('beforeend', tagHTML);
    }
    addTagWrapper.classList.toggle('open');
  });
}


/* Signs in the user w/ Sign In button click */
signinBtn.addEventListener('click', () => {
  retrieveLoginStatus(true);
});

/* Signs out user w/ Sign Out button click */
signoutBtn.addEventListener('click', () => {
  // communicate to background script that user wants to sign out
  chrome.extension.sendMessage({ greeting: 'sign me out' }, (response) => {
    if (response && response.signed_out) { // if the background script succeeds in signing out the user
      // remove tags from popup template
      const tagWrapper = document.querySelector('.day-tags'); 
      tagWrapper.innerHTML = '';

      showSignIn(); // show sign in button

      // if calendar is open, then remove user data from there
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'sign out app' });
      });
    }
  });
});


/* Opens the calendar page in a new tab when clicking on the View Calendar button */
const calendarBtn = document.querySelector('.view-cal');
calendarBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.extension.getURL('index.html') });
});


/* Saves the tag configuration to the database */
const saveBtn = document.querySelector('.save-btn');
saveBtn.addEventListener('click', () => {
  const tagInputs = document.querySelectorAll('.all-tags input');
  const updates = {};

  // for each the tag inputs determine which ones have been selected/deselected & 
  // add/remove those from the database accordingly
  tagInputs.forEach((input) => {
    const tagId = input.getAttribute('data-cb-id');
    let value;
    if (input.checked && !initialVals.get(tagId)) { // if newly checked tag
      value = true;
      initialVals.set(tagId, true);
    } else if (!input.checked && initialVals.get(tagId)) { // if newly unchecked tag
      value = null;
      initialVals.set(tagId, false);
    } else { // tag hasn't changed
      return;
    }

    // update the values in the database for the tagged day
    updates[`tagged/${fullDate}/${tagId}`] = value;
    updates[`tags/${tagId}/days/${fullDate}`] = value; 
  });

  db.ref(`users/${userId}`).update(updates); // bulk add/remove through update

  // close the "add tag" modal
  const addTagWrapper = document.querySelector('.add-tag-wrapper');
  addTagWrapper.classList.remove('open');

  // display the newly added tags at the top
});

retrieveLoginStatus(false); // retrieve the login status without invoking login process
setDate(); // set the date in the template to current date
initAddBtn(); // insert the add button into the template
