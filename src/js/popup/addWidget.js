
import { db } from '../../util/firebase';
import { fullDate, getTags } from './calendar';
import { getUserId } from './login';
import { isMac } from '../../util/utility';

const initialVals = new Map(); // map to store the initial values of the tag checkboxes

/* Opens the add widget */
export function toggleAdd() {
  const addTagWrapper = document.querySelector('.add-tag-wrapper');
  addTagWrapper.classList.toggle('open');
  if (getUserId()) addTagWrapper.classList.add('logged-in');
  else addTagWrapper.classList.remove('logged-in');
}


/* Populates the add widget with the user's tags */
export function populateWidget(tags, dayTags) {
  const addTagWrapper = document.querySelector('.add-tag-wrapper');
  const allTags = addTagWrapper.querySelector('.all-tags');

  document.querySelector('.loading-dots').classList.add('hide'); // hide loading message
  document.querySelector('.save-btn').classList.remove('hide'); // hide loading message

  // display the user's tags
  if (tags && allTags.children.length === 0) {
    let tagHTML = '';

    Object.keys(tags).forEach((tagId) => {
      const tag = tags[tagId];
      const isFound = (dayTags && dayTags[tagId]) ? 'checked' : '';
      initialVals.set(tagId, isFound);
      
      let emojiHTML = isMac ? tag.icon.native : `<emoji-icon emoji="${tag.icon.id}"></emoji-icon>`;

      tagHTML += `
        <div>
          <input type="checkbox" id="checkbox-${tagId}" data-cb-id="${tagId}" class="hide" ${isFound} />
          <label for="checkbox-${tagId}"><div class="day-tag ${tag.color}" title="${tag.title}">${emojiHTML}</div></label>
        </div>
      `;
    });
    allTags.insertAdjacentHTML('beforeend', tagHTML);
  }
}


/* Saves the tag configuration to the database */
function saveTags() {
  const tagInputs = document.querySelectorAll('.all-tags input');
  const updates = {};
  const added = [];

  // for each the tag inputs determine which ones have been selected/deselected & 
  // add/remove those from the database accordingly
  tagInputs.forEach((input) => {
    const tagId = input.getAttribute('data-cb-id');
    let value;
    if (input.checked && !initialVals.get(tagId)) { // if newly checked tag
      value = true;
      initialVals.set(tagId, true);
      added.push(tagId);
    } else if (!input.checked && initialVals.get(tagId)) { // if newly unchecked tag
      value = null;
      initialVals.set(tagId, false);
    } else { // tag hasn't changed
      if (input.checked) added.push(tagId);
      return;
    }

    // update the values in the database for the tagged day
    updates[`tagged/${fullDate}/${tagId}`] = value;
    updates[`stats/${tagId}/${fullDate.substring(0, 7)}/${fullDate}`] = value; 
  });

  const userId = getUserId();
  if (userId) db.ref(`users/${userId}`).update(updates); // bulk add/remove through update

  displayTags(added); // display the updated tags in the frontend

  // if calendar is open, then remove user data from there
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: 'updating day tags', updated: added, date: fullDate });
  });
}


/* Displays the newly added tags in the frontend */
function displayTags(added) {
  let tagWrapperInner = '';
  const tags = getTags(); // get the tag information
  added.forEach((currId) => { // create the tag elements
    const { color, id, title, icon } = tags[currId];
    let emojiHTML = isMac ? icon.native : `<emoji-icon emoji="${icon.id}"></emoji-icon>`;
    
    tagWrapperInner += `<div class="day-tag ${color}" id="${id}" title="${title}">${emojiHTML}</div>`;
  });

  const addBtn = document.querySelector('.add-btn');
  const tagWrapper = document.querySelector('.day-tags');
  tagWrapper.innerHTML = tagWrapperInner; // add day tags to the template
  tagWrapper.appendChild(addBtn);

  // close the add widget
  const addTagWrapper = document.querySelector('.add-tag-wrapper');
  addTagWrapper.classList.remove('open');
}


/* Initialize the add widget buttons and set the id */
function initAddWidget() {
  /* Saves the selected tags to the database when clicking the save button */
  const saveBtn = document.querySelector('.save-btn');
  saveBtn.addEventListener('click', saveTags);

  /* Opens the add tag section when clicking on the + (add) button */
  const addBtn = document.querySelector('.add-btn');
  addBtn.addEventListener('click', toggleAdd);
}

export default initAddWidget;
