var auth_url = 'https://accounts.google.com/o/oauth2/auth?';
const client_id = '<CLIENT-ID>';  // must be Web Application type
const redirect_url = chrome.identity.getRedirectURL(); // make sure to define Authorised redirect URIs in the Google Console such as https://<-your-extension-ID->.chromiumapp.org/
console.log(redirect_url);

var access_token;
var refresh_token;

var email;
var user_id;


function _startAuthFlow(callback) {
  const auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    scope: 'email',
    login_hint: '' // fake or non-existent won't work
  };

  const url = new URLSearchParams(Object.entries(auth_params));
  url.toString();
  auth_url += url;

  chrome.identity.launchWebAuthFlow({ url: auth_url, interactive: true }, function(responseUrl) {
    _getRefreshToken(responseUrl, callback);
  });
}

function _getRefreshToken(responseUrl, callback) {
  console.log(responseUrl);

  var token_url = 'https://www.googleapis.com/oauth2/v4/token';
  const auth_code = responseUrl.split("&")[0].split("code=")[1];
  console.log(auth_code);

  var token_params = {
    code: decodeURIComponent(auth_code),
    client_id: client_id,
    client_secret: '<CLIENT-SECRET>',
    redirect_uri: redirect_url,
    grant_type: 'authorization_code'
  }

  const request_url = new URLSearchParams(Object.entries(token_params));

  let xhr = new XMLHttpRequest();
  xhr.open('post', token_url)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log(this.status);
    console.log(this.response);

    // grab the access token and use that to get the email
    var token_info = JSON.parse(this.response);
    refresh_token = token_info.refresh_token;
    access_token = token_info.access_token;
    console.log(refresh_token);
    console.log(access_token);
    addToStorage('tt-extension-r', refresh_token);
    addToStorage('tt-extension-a', access_token);

    // TODO: store refresh & access token

    // TODO: use refresh token to retrieve access token

    // use access token to receive info
    _getUserInfo(access_token, callback);
  }

  xhr.send(request_url.toString());
}

function _getUserInfo(access_token, callback) {
  let xhr = new XMLHttpRequest();
  var url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  xhr.open('get', url);

  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.onload = function() {
    console.log(this.status);
    if (this.status == 401) {
      // TODO: revoke auth token and request a new one
      console.log('401 error');
      //retry = false;
      window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`);

      chrome.identity.removeCachedAuthToken({token: access_token}, function (){
        // TODO: request a new one using refresh token 
      });
    } else {
      if (this.status == 200) {
        console.log(this.response);
        var user_info = JSON.parse(this.response);
        email = user_info.email;
        user_id = user_info.sub;
        console.log(email);
        console.log(user_id);

        // will do this if user is already logged in
        if(callback) callback({ email: email });

        // will do this if user is logging in 
        else chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
          // Tab opened.
        });
      } else {
        console.log("Error:");
      }
    }
  }
  xhr.send();
}

// _startAuthFlow();


/* Test: sending email to popup when requested */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
    if (request.greeting == 'hello from popup') {
      // if the access token is valid, then we dont need to make the user login
      getFromStorage('tt-extension-a', function(value) {
        console.log('access is ' + value);

        if (value) _getUserInfo(value, sendResponse); // checks access code
        else _startAuthFlow(); // logs in user from beginning 
      });
    }
    if (request.greeting === 'hello from main page') sendResponse({ id: '123789' });
    return true;
  }
);


function addToStorage(key, value) {
  chrome.storage.local.set({[key]: value}, function() {
    console.log(key + ' is set to ' + value);
  });
}

function getFromStorage(key, callback) {
  chrome.storage.local.get([key], function(result) {
    console.log(result[key]);
    callback(result[key]);
  });
}


