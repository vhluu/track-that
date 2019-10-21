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
