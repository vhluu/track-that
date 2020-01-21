import db from '../util/firebase';

/* The Sign In and Sign Out button elements */
const signinBtn = document.querySelector('.google-signin');
const signoutBtn = document.querySelector('.google-signout');

/* Show the Sign In button only */
const showSignIn = () => {
  signinBtn.classList.remove('hide');
  signoutBtn.classList.add('hide');
};

/* Show the Sign Out button only */
const showSignOut = () => {
  signinBtn.classList.add('hide');
  signoutBtn.classList.remove('hide');
};


/* Sets the date in the popup template */
const setDate = () => {
  const date = new Date();
  const dayOfWeek = document.querySelector('.day-of-week');
  const dayNum = document.querySelector('.day-number');
  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

  // sets date in popup template
  dayOfWeek.textContent = daysOfWeek[date.getDay()];
  dayNum.textContent = date.getDate();
};


/* Opens the add tag area when clicking on the + (add) button */
const initAddBtn = () => {
  const addBtn = document.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    document.querySelector('.add-tag-wrapper').classList.toggle('open');
  });
};


let tags; // the user's tags

/* Grabs the tags for the current day and displays it in the popup template */
const setTags = (userId) => {
  // generate the dates needed
  const date = new Date();
  let month = (date.getMonth() + 1) % 13;
  if (month < 10) month = `0${month}`;
  
  const day = date.getDate();
  const fullDate = `${month}${date.getYear() + 1900}`;
  const formattedDay = day < 10 ? `0${day}` : day;

  const currDayTags = [];

  // get the tags for the current month from the database
  // TODO: try getting day tags from storage, if none, then grab from firebase
  db.ref(`users/${userId}/tagged/${fullDate}`).once('value').then((snapshot) => {
    const dayTags = snapshot.val();
    if (dayTags) { // get the tag ids for the current day
      const currDate = `${month}${formattedDay}`;
      Object.keys(dayTags).forEach((tagId) => {
        Object.keys(dayTags[tagId]).forEach((day) => {
          if (day === currDate) {
            currDayTags.push(tagId.substring(1));
          }
        });
      });

      // use the tag ids to grab the rest of the tag info from the database
      if (currDayTags.length > 0) {
        db.ref(`users/${userId}/tags`).once('value').then((snapshot1) => {
          tags = snapshot1.val();
          if (tags) {
            const tagData = currDayTags.map((tagId) => tags[tagId]);
            const tagWrapper = document.querySelector('.day-tags');
            const addBtnHTML = tagWrapper.innerHTML;
            tagWrapper.innerHTML = '';
            // create the tags and append to popup template
            tagData.forEach((tag) => {
              tagWrapper.insertAdjacentHTML('beforeend', `<div class="day-tag ${tag.color}">${tag.icon}</div>`);
            });
            tagWrapper.insertAdjacentHTML('beforeend', addBtnHTML); // adding add button to template
            initAddBtn();
          }
        });
      }
    }
  });
};


/** Gets the login status of the user
 * Takes a boolean which indicates whether to start the login progress 
 */
const retrieveLoginStatus = (startLogin) => {
  // communicate to background script that we want to retrieve the login status
  chrome.extension.sendMessage({ greeting: 'hello from popup', login: startLogin }, (response) => {
    if (response && response.email) { // if user is signed in
      console.log(response);
      showSignOut(); // hide Sign In button and show Sign Out button
      setTags(response.userId); // sets the tags in the popup template
    } else {
      console.log("Couldn't get email address of profile user.");
      showSignIn();
    }
  });
};


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
        console.log(tabs);
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


retrieveLoginStatus(false);
setDate();
initAddBtn();
