import * as cal from './cal.js';
import * as modalTag from './tag-modal.js';
import * as tagsSidebar from './tags-sidebar.js';
import * as modalDay from './day-modal.js';

var userId;
var lastTagId = 0;
window.onload = function() {
  /*=================== VARIABLES ===================*/
  /* Modals */
  const tagModal = document.querySelector('.tag-modal');
  const dayModal = document.querySelector('.edit-day-modal');
  const deleteConfirm = tagModal.querySelector('.delete-confirm');

  var date = new Date();

  /*=================== SET UP ===================*/
  /**
   * Gets user information from chrome & populates calendar/tags using database 
   */
  chrome.identity.getProfileUserInfo(function(userInfo) {
    console.log(JSON.stringify(userInfo));
    userId = userInfo.id;

    // gets user info and adds user to datebase if not already there
    chrome.storage.sync.get(["tt-created-user"], function(result) {
      if (!result["tt-created-user"]) {
        dbCreateUser(userId, userInfo.email);
      }
    });

    dbGetTags(userId).then((tags) => { // populates tags sidebar with tags from database
      if (tags) {
        var keys = Object.keys(tags);
        keys.forEach(key => { tagsSidebar.appendTag(tags[key], key); });
        lastTagId = parseInt(keys[keys.length - 1]) + 1;
      }
    });

    cal.setCalendar(date.getMonth()); // populates calendar with current month's data
  });


  /**
   * Handles clicks on the body by closing the most recently opened modal
   */
  document.body.addEventListener('click', () => {
    let emojiPicker = document.querySelector('emoji-picker');
    if (emojiPicker) modalTag.toggleEmojiPicker();
    else if (deleteConfirm.className.indexOf('hide') == -1) deleteConfirm.classList.add('hide');
    else if (tagModal.className.indexOf('hide') == -1) modalTag.close();

    if (dayModal.className.indexOf('hide') == -1) modalDay.close();
  });
}

export { userId, lastTagId };