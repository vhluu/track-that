var auth_url = 'https://accounts.google.com/o/oauth2/auth?';
const client_id = '<CLIENT-ID>';  // must be Web Application type
const redirect_url = chrome.identity.getRedirectURL(); // make sure to define Authorised redirect URIs in the Google Console such as https://<-your-extension-ID->.chromiumapp.org/
console.log(redirect_url);

var access_token;
var refresh_token;

var email;
var user_id;


function _startAuthFlow() {
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

  chrome.identity.launchWebAuthFlow({ url: auth_url, interactive: true }, _getRefreshToken);
}

function _getRefreshToken(responseUrl) {
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

    // TODO: store refresh & access token

    // TODO: use refresh token to retrieve access token

    // use access token to receive info
    _getUserInfo(access_token);
  }

  xhr.send(request_url.toString());
}

function _getUserInfo(access_token) {
  let xhr = new XMLHttpRequest();
  var url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  xhr.open('get', url);

  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.onload = function() {
    console.log(this.status);
    if (this.status == 401) {
      //retry = false;
      //chrome.identity.removeCachedAuthToken({ token: access_token }, getToken);
      // TODO: revoke auth token and request a new one
      console.log('401 error');
    } else {
      if (this.status == 200) {
        console.log(this.response);
        var user_info = JSON.parse(this.response);
        email = user_info.email;
        user_id = user_info.sub;
        console.log(email);
        console.log(user_id);
        
      } else {
        console.log("Error:");
      }
    }
  }
  xhr.send();
}

_startAuthFlow();