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
 * Returns the user id if user is signed in
 */
function retrieveLoginStatus(startLogin) {
  return new Promise((resolve) => {
    // communicate to background script that we want to retrieve the login status
    chrome.extension.sendMessage({ greeting: 'hello from popup', login: startLogin }, (response) => {
      if (response && response.email) { // if user is signed in
        showSignOut(); // hide Sign In button and show Sign Out button
        resolve(response.userId);
      } else {
        showSignIn();
        resolve();
      }
    });
  });
}


/* Initialize login-related ctas and get the login status of the user */
function initLogin() {
  /* Signs in the user w/ Sign In button click */
  signinBtn.addEventListener('click', () => {
    retrieveLoginStatus(true);
  });

  /* Signs out user w/ Sign Out button click */
  signoutBtn.addEventListener('click', () => {
    // communicate to background script that user wants to sign out
    chrome.extension.sendMessage({ greeting: 'sign me out' }, (response) => {
      if (response && response.signed_out) { // if background script succeeds in signing out user
        // clear tags from popup template
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

  return retrieveLoginStatus(false); // retrieve the login status without invoking login process
}

export default initLogin;
