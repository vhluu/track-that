var calendarBtn = document.querySelector('.view-cal');
console.log(calendarBtn);
calendarBtn.addEventListener('click', function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
    // Tab opened.
  });
});

const signinBtn = document.querySelector('.google-signin');
const signoutBtn = document.querySelector('.google-signout');

// we want to display the login
signinBtn.addEventListener('click', function() {
  _retrieveLoginStatus(true);
});

signoutBtn.addEventListener('click', function() {
  _signoutUser();
});

function _retrieveLoginStatus(startLogin) {
  chrome.extension.sendMessage({ greeting: "hello from popup", login: startLogin }, function(response) {
    if (response && response.email) {
      console.log(response);
      if(response.email) {
        signinBtn.style.display = "none";
        signoutBtn.style.display = "block";
      }
    } else {
      console.log("Couldn't get email address of profile user.");
      signinBtn.style.display = "block";
      signoutBtn.style.display = "none";
    }
  });
}

function _signoutUser() {
  chrome.extension.sendMessage({ greeting: "sign me out" }, function(response) {
    console.log(response);
    if (response) {
      console.log(response);
      if(response['signed_out']) {
        signinBtn.style.display = "block";
        signoutBtn.style.display = "none";
      }
    } else {
      console.log("Couldn't sign out. Please try again!");
      signinBtn.style.display = "block";
      signoutBtn.style.display = "none";
    }
  });
}

_retrieveLoginStatus(false);