import { userId, lastTagId } from './calendar.js';
import { close as closeDayModal } from './day-modal.js';
import { appendTag } from './tags-sidebar.js';

/*=================== Variables ===================*/

const tagModal = document.querySelector('.tag-modal');
const tagsList = document.querySelector('.tags-list');

/* Buttons */
const createTagBtn = tagModal.querySelector('.btn-create-tag');
const updateTagBtn = tagModal.querySelector('.btn-update-tag');
const deleteTagBtn = tagModal.querySelector('.delete-icon');

/* Form Fields */
const tagFieldWrapper = tagModal.querySelectorAll('.tag-field-wrapper');
const tagTitleField = tagModal.querySelector('[name="tag-field-title"]');
const tagIconField = tagModal.querySelector(' .tag-field-icon');
const tagError = tagModal.querySelector('.tag-error-message');

/* Delete Confirmation */
const deleteConfirm = tagModal.querySelector('.delete-confirm');
const confirmCancel = deleteConfirm.querySelector('.btn-cancel');
const confirmDelete = deleteConfirm.querySelector('.btn-delete');


/*=================== Functions ===================*/

/**
 * Handles opening of update tag modal
 */
export function openUpdateModal(e) {
  closeDayModal(); // closes any other open modal
  e.stopPropagation();

  tagModal.style.top = `${e.target.getBoundingClientRect().top}px`;
  tagModal.classList.remove('tag-add', 'hide');
  tagModal.classList.add('tag-update');

  // populates modal form
  tagTitleField.value = e.target.getAttribute('data-tag-title');
  tagIconField.textContent = e.target.getAttribute('data-tag-icon');

  let selectedColor = document.querySelector(`.color-picker #${e.target.getAttribute('data-tag-color')}-color`); 
  selectedColor.checked = true;

  tagModal.setAttribute('data-tag-modal-id', e.target.id);
};


/**
 * Clears the tag create/update form and closes the container modal
 */
export function close() {
  tagModal.classList.add('hide'); // hides tag modal

  // clears form values
  tagTitleField.value = "";
  tagIconField.textContent = "";
  let selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
  if (selectedColor) selectedColor.checked = false;

  tagError.classList.add('hide'); // hides tag modal error message
  tagModal.classList.remove('tag-add', 'tag-update'); // removes tag modal state
}


/**
 * Handles update tag button click by updating current tag
 */
updateTagBtn.addEventListener('click', () => {
  let updatedTag = {
    title: tagTitleField.value,
    icon: tagIconField.textContent,
    color: document.querySelector('input[name="tag-color-picker"]:checked').value
  }

  let tagId = tagModal.getAttribute('data-tag-modal-id');
  const tag = tagsList.querySelector(`#${tagId}`);

  let oldTag = {
    title: tag.getAttribute('data-tag-title'),
    icon: tag.getAttribute('data-tag-icon'),
    color: tag.getAttribute('data-tag-color')
  }
  
  // TODO: should call update tag from tag.js
  // checks if the tag data has changed
  if (JSON.stringify(updatedTag) !== JSON.stringify(oldTag)) {
    updatedTag["id"] = tagId;

    dbUpdateTag(userId, updatedTag); // stores tag in database
    
    // updates tag in tag list
    tag.setAttribute('data-tag-title', updatedTag.title);
    tag.setAttribute('data-tag-icon', updatedTag.icon);
    tag.setAttribute('data-tag-color', updatedTag.color);

    tag.textContent = `${updatedTag.icon} ${updatedTag.title}`;
    tag.classList.remove(oldTag.color);
    tag.classList.add(updatedTag.color);

    // updates tags on calendar
    const dayTags = document.querySelectorAll(`.calendar [data-day-tag-id="${tagId}"]`);
    dayTags.forEach((dayTag) => {
      dayTag.classList.remove(oldTag.color);
      dayTag.classList.add(updatedTag.color);
      dayTag.textContent = updatedTag.icon;
    });
  }
  close();
});


/**
 * Handles create tag button click by creating a new tag with the form data
 */
createTagBtn.addEventListener('click', () => {
  const selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');

  // shows error message if any of the fields are empty
  if (tagTitleField.value == "" || tagIconField.textContent == "" || !selectedColor) {
    tagError.classList.remove('hide');
    return;
  }

  let tagInfo = { // holds new tag data
    id: lastTagId, 
    icon: tagIconField.textContent, 
    title: tagTitleField.value, 
    color: selectedColor.value 
  }; 

  appendTag(tagInfo, lastTagId); // appends tag to dom
  dbCreateTag(userId, tagInfo); // stores tag in firebase
  lastTagId++; // updates the last tag id
  
  close(); // closes the tag modal
});


/*=================== Delete Confirmation ===================*/
/**
 * Handles hiding/showing of delete confirmation pop up
 */ 
deleteTagBtn.addEventListener('click', () => {
  deleteConfirm.classList.remove('hide');
});

confirmCancel.addEventListener('click', () => {
  deleteConfirm.classList.add('hide');
});


/**
 * Deletes current tag
 */ 
confirmDelete.addEventListener('click', (e) => {
  deleteConfirm.classList.add('hide'); // closes modals
  close();

  const tagId = tagModal.getAttribute('data-tag-modal-id'); // id of tag to delete
  dbDeleteTag(userId, tagId); // deletes tag from database

  // removes tag from frontend (tags list & calendar days)
  tagsList.removeChild(document.querySelector(`#${tagId}`));

  const dayTags = document.querySelectorAll(`.calendar [data-day-tag-id="${tagId}"]`);
  dayTags.forEach((dayTag) => {
    dayTag.parentNode.removeChild(dayTag);
  });
}); 


/*=================== Emoji Picker ===================*/
/**
 * Toggles the emoji picker
 */
tagIconField.addEventListener('click', () => {
  toggleEmojiPicker();
});


/**
 * Creates/removes emoji picker since hiding/showing it causes issues w/ the emoji nav bar
 */
var emojiPicker;
export function toggleEmojiPicker() {
  emojiPicker = document.querySelector('emoji-picker');

  if (!emojiPicker) { // creates the emoji picker
    emojiPicker = document.createElement('emoji-picker');
    tagIconField.parentElement.appendChild(emojiPicker);

    tagFieldWrapper.forEach((wrapper) => {
      wrapper.classList.add('prevent-click');
    });
  } else { // removes the emoji picker
    tagIconField.parentElement.removeChild(emojiPicker);

    tagFieldWrapper.forEach((wrapper) => {
      wrapper.classList.classList.remove('prevent-click');
    });
  }
}

/**
 * Handles click on tag modal by closing the emoji picker if open
 */ 
tagModal.addEventListener('click', (e) => {
  e.stopPropagation();
  if ((e.target.tagName == 'FORM' || (e.target.tagName !== 'svg' && e.target.className.includes('tag-modal'))) && emojiPicker) {
    toggleEmojiPicker(); // hides icon picker on modal click
  } 
})
