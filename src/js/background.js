import { fbApp } from '../util/firebase';

const clientId = '<CLIENT-ID>';
const clientSecret = '<CLIENT-SECRET>';
const redirectUrl = chrome.identity.getRedirectURL();

let accessToken;
let refreshToken;

/**
 * Starts the user authorization flow
 */
function startAuthFlow(callback, interactive, message) {
  let authUrl = 'https://accounts.google.com/o/oauth2/auth?';
  const authParams = {
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: 'code',
    access_type: 'offline',
    approval_prompt: 'force',
    scope: 'email',
    login_hint: '',
  };

  const url = new URLSearchParams(Object.entries(authParams));
  url.toString();
  authUrl += url;

  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive }, (responseUrl) => {
    getRefreshToken(responseUrl, callback, message);
  });
}

/**
 * Gets a refresh token for the user
 */
function getRefreshToken(responseUrl, callback, message) {
  console.log(responseUrl);

  const tokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
  const authCode = responseUrl.split('&')[0].split('code=')[1]; // gets authorization code from reponse url
  console.log(authCode);

  const tokenParams = {
    code: decodeURIComponent(authCode),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: 'authorization_code',
  };

  const requestUrl = new URLSearchParams(Object.entries(tokenParams));

  const xhr = new XMLHttpRequest();
  xhr.open('post', tokenUrl);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function retrieveTokens() {
    console.log(this.status);
    console.log(this.response);

    // grab the access token and use that to get the email
    const tokenInfo = JSON.parse(this.response);
    refreshToken = tokenInfo.refresh_token;
    accessToken = tokenInfo.access_token;
    console.log(refreshToken);
    console.log(accessToken);

    // store refresh & access token
    addToStorage('tt-extension-r', refreshToken);
    addToStorage('tt-extension-a', accessToken);

    // use access token to receive info
    getUserInfo(accessToken, callback, true, true, message);
  };

  xhr.send(requestUrl.toString());
}


let afterSuccess;
let loginStart;
let clientMessage;
/**
 * Gets user information using access token
 */
function getUserInfo(accessTok, callback, startLogin, retry, message) {
  const xhr = new XMLHttpRequest();
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  xhr.open('get', url);
 
  xhr.setRequestHeader('Authorization', `Bearer ${accessTok}`);
  xhr.onload = function retrieveInfo() {
    console.log(this.status);
    if (this.status === 401 && retry) { // access token is expired or revoked
      console.log('Access Token expired');

      chrome.identity.removeCachedAuthToken({ token: accessTok }, (response) => {
        console.log('removed cached auth token');
        console.log(response);

        refreshAccessToken(callback);
      });
    } else if (this.status === 200) { // successfully retrieved user information
      // Authorize Firebase with the OAuth Access Token.
      const credential = fbApp.auth.GoogleAuthProvider.credential(null, accessTok);
      console.log('we in hereee');
      afterSuccess = callback;
      loginStart = startLogin;
      clientMessage = message;
      console.log('credential is');
      console.log(credential);
      fbApp.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        // TODO: handle this case
        if (error.code === 'auth/invalid-credential') {
          console.log('invalid credentials');
        }
      });

      // console.log(this.response);
      // const userInfo = JSON.parse(this.response);
      // const { email } = userInfo;
      // const userId = userInfo.sub;
      // console.log(email);
      // console.log(userId);

      // console.log(message);
      // // if user is already logged in, send the email to script that requested it
      // if (!startLogin) callback({ email, userId });
      // else if (message === 'sign in from app') { 
      //   callback({ email, userId });
      // } else { // user is relogging in so open the extension page
      //   chrome.tabs.create({ url: chrome.extension.getURL('index.html') }, (tab) => {
      //     console.log('tab opened');
      //   });
      // }
    } else {
      console.log(`Error: ${this.status}`);
    }
  };
  xhr.send();
}

/**
 * Generates a new access token using refresh token
 */
function refreshAccessToken(callback) {
  console.log('refreshing access token');
  // get the refresh token from storage
  getFromStorage('tt-extension-r', (token) => {
    if (token) {
      const refreshUrl = 'https://www.googleapis.com/oauth2/v4/token';

      const refreshParams = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: token,
        grant_type: 'refresh_token',
      };

      const refreshUrlParams = new URLSearchParams(Object.entries(refreshParams));

      const xhr = new XMLHttpRequest();
      xhr.open('post', refreshUrl);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function getAccess() {
        console.log(this.status);
        console.log(this.response);
        if (this.status === 200) {
          // grab the access token and use that to get the email
          const tokenInfo = JSON.parse(this.response);
          accessToken = tokenInfo.access_token;
          addToStorage('tt-extension-a', accessToken);

          getUserInfo(accessToken, callback, false, false);
        } else { // refresh token no longer works
          console.log('refresh token no longer working. restarting auth flow!');
          removeFromStorage(['tt-extension-a', 'tt-extension-r']);
          fbApp.auth().signOut();

          startAuthFlow(callback, false); // generate a new refresh token
        }
      };

      xhr.send(refreshUrlParams.toString());
    }
    // generate new fresh token
  });
}

// startAuthFlow();


/**
 * Listens for messages from other scripts & calls appropriate auth methods
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
    if (request.greeting === 'hello from popup' || request.greeting === 'hello from calendar' || request.greeting === 'sign in from app') {
      const { currentUser } = fbApp.auth();
      console.log(currentUser);
      if (currentUser) {
        sendResponse({ userId: currentUser.uid });
      } else {
        // if the access token is valid, then we dont need to make the user login
        getFromStorage('tt-extension-a', (value) => {
          console.log(`access is ${value}`);

          if (value) getUserInfo(value, sendResponse, false, true); // checks access code
          else if (request.login) startAuthFlow(sendResponse, true, request.greeting); // logs in user from beginning 
          else sendResponse({ email: '' });
        });
      }
    } else if (request.greeting === 'sign me out') revokeToken(sendResponse, false);
    return true;
  },
);


function addToStorage(key, value) {
  chrome.storage.local.set({ [key]: value }, () => {
    console.log(`${key} is set to ${value}`);
  });
}

function getFromStorage(key, callback) {
  chrome.storage.local.get([key], (result) => {
    console.log(result[key]);
    callback(result[key]);
  });
}

function removeFromStorage(keys) {
  chrome.storage.local.remove(keys, () => {
    console.log('removed keys from storage');
  });
}

/**
 * Revokes tokens & starts authorization flow is 'generateNew' is true
 * Revoking an access token means that the refresh token will also be revoked
 * See more info here: https://developers.google.com/identity/protocols/OAuth2WebServer
 */
function revokeToken(callback, generateNew) {
  console.log('sigined out!!!');
  getFromStorage('tt-extension-a', (value) => {
    console.log(`access is ${value}`);

    if (value) {
      window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${value}`).then((response) => {
        console.log(response);
        if (response.status === 200) { // successfully revoked token
          console.log('successfully revoked token');
          removeFromStorage(['tt-extension-a', 'tt-extension-r']);
          fbApp.auth().signOut();

          if (generateNew) startAuthFlow(callback, false);
          else callback({ signed_out: true });
        }
      });
    }
  });
}

let fbUID;
fbApp.auth().onAuthStateChanged((user) => {
  console.log(user);
  console.log(afterSuccess);
  console.log(fbApp.auth().currentUser);
  if (user && afterSuccess) {
    console.log(user);
    const { uid } = user;
    // send uid to the popup or app
    // if user is already logged in, send the email to script that requested it
    if (!loginStart) afterSuccess({ userId: uid });
    else if (clientMessage === 'sign in from app') { 
      afterSuccess({ userId: uid });
    } else { // user is relogging in so open the extension page
      chrome.tabs.create({ url: chrome.extension.getURL('index.html') }, (tab) => {
        console.log('tab opened');
      });
    }
  } else if (!user) {
    console.log('User is no longer signed in');
  }
});
