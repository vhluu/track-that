var auth_url = 'https://accounts.google.com/o/oauth2/auth?';
var client_id = '<CLIENT-ID>';  // must be Web Application type
var redirect_url = chrome.identity.getRedirectURL(); // make sure to define Authorised redirect URIs in the Google Console such as https://<-your-extension-ID->.chromiumapp.org/
console.log(redirect_url);
var auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    scope: 'email',
    login_hint: ''
};

const url = new URLSearchParams(Object.entries(auth_params));
url.toString();
auth_url += url;


var access_token;
var refresh_token;

var email;
var user_id;

chrome.identity.launchWebAuthFlow({ url: auth_url, interactive: true }, function (responseUrl) {
  var token_url = 'https://www.googleapis.com/oauth2/v4/token';
  var auth_code = responseUrl.split("&")[0].split("code=")[1];

  var token_params = {
    code: decodeURIComponent(auth_code),
    client_id: client_id,
    client_secret: '<CLIENT-SECRET>',
    redirect_uri: redirect_url,
    grant_type: 'authorization_code'
  }

  const request_url = new URLSearchParams(Object.entries(token_params));
  request_url.toString();

  var xhr = new XMLHttpRequest();
  xhr.open('post', token_url)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log(this.status);
    console.log(this.response);

    var token_info = JSON.parse(this.response);
    refresh_token = token_info.refresh_token;
    access_token = token_info.access_token;
    console.log(refresh_token);
    console.log(access_token);

    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    xhr.open('get', url);
    
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.onload = function() {
      console.log(this.status);
      if (this.status == 401) {
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

  xhr.send(request_url.toString());
});