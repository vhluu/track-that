var calendarBtn = document.querySelector('.view-cal');
console.log(calendarBtn);
calendarBtn.addEventListener('click', function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
    // Tab opened.
  });
});

const signinBtn = document.querySelector('.google-signin');
const signoutBtn = document.querySelector('.google-signout');

signinBtn.addEventListener('click', function() {
  chrome.extension.sendMessage({greeting: "hello from popup"}, function(response) {
    if (response) {
      console.log(response);
      if(response.email) {
        signinBtn.textContent = response.email;
      }
    } else {
      console.log("Couldn't get email address of profile user.");
    }
  });
});

signoutBtn.addEventListener('click', function() {

});