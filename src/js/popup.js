import db from '../util/firebase';

const calendarBtn = document.querySelector('.view-cal');
console.log(calendarBtn);
calendarBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.extension.getURL('index.html') }, (tab) => {
    // Tab opened.
    console.log(tab);
  });
});

const signinBtn = document.querySelector('.google-signin');
const signoutBtn = document.querySelector('.google-signout');

// we want to display the login
signinBtn.addEventListener('click', () => {
  retrieveLoginStatus(true);
});

signoutBtn.addEventListener('click', () => {
  signoutUser();
});

function retrieveLoginStatus(startLogin) {
  chrome.extension.sendMessage({ greeting: 'hello from popup', login: startLogin }, (response) => {
    if (response && response.email) {
      console.log(response);
      if (response.email) {
        // TODO: change to add hide class
        signinBtn.style.display = 'none';
        signoutBtn.style.display = 'block';

        console.log(db);
        const date = new Date();
        const fullDate = `${(date.getMonth() + 1) % 13}${date.getYear() + 1900}`;
        const formattedDay = date.getDate() < 10 ? `0${date}` : date.getDate();
        const currDate = `${(date.getMonth() + 1) % 13}${formattedDay}`;

        // TODO: try getting day tags from storage, if none, then grab from firebase
        const currDayTags = [];
        db.ref(`users/${response.userId}/tagged/${fullDate}`).once('value').then((snapshot) => {
          const dayTags = snapshot.val();
          if (dayTags) {
            Object.keys(dayTags).forEach((tagId) => {
              Object.keys(dayTags[tagId]).forEach((day) => {
                if (day === currDate) {
                  currDayTags.push(tagId);
                }
              });
            });
          }

          console.log(currDayTags);
          // create the tags and append to popup template
          const tagWrapper = document.querySelector('.day-tags');
          currDayTags.forEach((tagId) => {
            const tag = document.createElement('div');
            tag.textContent = tagId;
            tag.className = 'day-tag';
            tagWrapper.appendChild(tag);
          });

          // create add tag button which will open the calendar page on click
          const addBtn = document.createElement('div');
          addBtn.className = 'add-btn';
          addBtn.textContent = '+';
          tagWrapper.appendChild(addBtn);

          addBtn.addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.extension.getURL('index.html') });
          });
        });

        const dayOfWeek = document.querySelector('.day-of-week');
        const dayNum = document.querySelector('.day-number');
        const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

        // sets date in popup template
        dayOfWeek.textContent = daysOfWeek[date.getDay()];
        dayNum.textContent = date.getDate();
      }
    } else {
      console.log("Couldn't get email address of profile user.");
      // TODO: change to add hide class
      signinBtn.style.display = 'block';
      signoutBtn.style.display = 'none';
    }
  });
}

function signoutUser() {
  chrome.extension.sendMessage({ greeting: 'sign me out' }, (response) => {
    console.log(response);
    if (response) {
      console.log(response);
      if (response.signed_out) {
        signinBtn.style.display = 'block';
        signoutBtn.style.display = 'none';
      }
    } else {
      console.log("Couldn't sign out. Please try again!");
      signinBtn.style.display = 'block';
      signoutBtn.style.display = 'none';
    }
  });
}

retrieveLoginStatus(false);
