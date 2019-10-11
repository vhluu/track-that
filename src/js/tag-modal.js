import { userId, lastTagId } from './calendar.js';
import { close as closeDayModal } from './day-modal.js';
import { appendTag } from './tags-sidebar.js';
/*=================== VARIABLES ===================*/
/* Tags */
var tagsList = document.querySelector('.tags-list');
var addTagBtn = document.querySelector('.btn-add-tag');

/* Tag Modal */
var tagModal = document.querySelector('.tag-modal');

var createTagBtn = tagModal.querySelector('.btn-create-tag');
var updateTagBtn = tagModal.querySelector('.btn-update-tag');
var deleteTagBtn = tagModal.querySelector('.delete-icon');

var tagTitleField = tagModal.querySelector('[name="tag-field-title"]');
var tagIconField = tagModal.querySelector(' .tag-field-icon');
var tagFieldWrapper = tagModal.querySelectorAll('.tag-field-wrapper');

var tagError = tagModal.querySelector('.tag-error-message');
var deleteConfirm = tagModal.querySelector('.delete-confirm');
var confirmCancel = deleteConfirm.querySelector('.btn-cancel');
var confirmDelete = deleteConfirm.querySelector('.btn-delete');


/* Handles opening and closing of Update/Remove New Tag modal */
export function openUpdateModal(e) {
  closeDayModal();
  e.stopPropagation();
  tagModal.style.top = `${e.target.getBoundingClientRect().top}px`;
  tagModal.classList.remove('tag-add', 'hide');
  tagModal.classList.add('tag-update');
  // populate data
  tagTitleField.value = e.target.getAttribute('data-tag-title');
  tagIconField.textContent = e.target.getAttribute('data-tag-icon');
  var selectedColor = document.querySelector(`.color-picker #${e.target.getAttribute('data-tag-color')}-color`); 
  selectedColor.checked = true;
  tagModal.setAttribute('data-tag-modal-id', e.target.id);
};

/* Handles hiding/showing of delete confirm modal */
deleteTagBtn.addEventListener('click', function() {
  deleteConfirm.classList.remove('hide');
});

confirmCancel.addEventListener('click', function() {
  deleteConfirm.classList.add('hide');
});


tagModal.addEventListener('click', function(e) {
  e.stopPropagation();
  if((e.target.tagName == 'FORM' || (e.target.tagName !== 'svg' && e.target.className.includes('tag-modal'))) && emojiPicker) toggleEmojiPicker(); // hide icon picker on modal click
})


/* Updates current tag */
updateTagBtn.addEventListener('click', function() {
  // check if any fields are updated
  console.log('jasldfkajdsf');
  var updatedTag = {
    title: tagTitleField.value,
    icon: tagIconField.textContent,
    color: document.querySelector('input[name="tag-color-picker"]:checked').value
  }

  var tagId = tagModal.getAttribute('data-tag-modal-id');
  var tag = tagsList.querySelector(`#${tagId}`);
  var oldTag = {
    title: tag.getAttribute('data-tag-title'),
    icon: tag.getAttribute('data-tag-icon'),
    color: tag.getAttribute('data-tag-color')
  }
  
  // TODO: should call update tag from tag.js
  if(JSON.stringify(updatedTag) !== JSON.stringify(oldTag)) {
    updatedTag["id"] = tagId;
    console.log(updatedTag);
    dbUpdateTag(userId, updatedTag);
    // update frontend
    tag.setAttribute('data-tag-title', updatedTag.title);
    tag.setAttribute('data-tag-icon', updatedTag.icon);
    tag.setAttribute('data-tag-color', updatedTag.color);

    tag.textContent = updatedTag.icon + " " + updatedTag.title;
    tag.classList.remove(oldTag.color);
    tag.classList.add(updatedTag.color);

    // updating tags on calendar
    var dayTags = document.querySelectorAll(`.calendar [data-day-tag-id="${tagId}"]`);
    for(var i = 0; i < dayTags.length; i++) {
      dayTags[i].classList.remove(oldTag.color);
      dayTags[i].classList.add(updatedTag.color);
      dayTags[i].textContent = updatedTag.icon;
    }
  }
  close();
});

/* Create new tag */
createTagBtn.addEventListener('click', function() {
  var selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
  if(tagTitleField.value == "" || tagIconField.textContent == "" || !selectedColor) {
    tagError.classList.remove('hide');
    return;
  }

  var tagInfo = { id: lastTagId, icon: tagIconField.textContent, title: tagTitleField.value, color: selectedColor.value }; 
  appendTag(tagInfo, lastTagId); // appends tag to dom
  dbCreateTag(userId, tagInfo); // stores tag in firebase
  lastTagId++;
  
  close();
});

/* Deletes current tag */
confirmDelete.addEventListener('click', function(e) {
  deleteConfirm.classList.add('hide');
  close();
  var tagId = tagModal.getAttribute('data-tag-modal-id');
  dbDeleteTag(userId, tagId);

  tagsList.removeChild(document.querySelector(`#${tagId}`)); // remove from frontend

  var dayTags = document.querySelectorAll(`.calendar [data-day-tag-id="${tagId}"]`);
  for(var i = 0; i < dayTags.length; i++) {
    dayTags[i].parentNode.removeChild(dayTags[i]);
  }
}); 

/*=================== EMOJI PICKER ===================*/
/* Hides & shows emoji picker */
tagIconField.addEventListener('click', function() {
  toggleEmojiPicker();
});

var emojiPicker;
/* Creates/removing emoji picker since hide/showing it causes issues w/ the emoji nav bar */
export function toggleEmojiPicker() {
  emojiPicker = document.querySelector('emoji-picker');
  if(!emojiPicker) {
    emojiPicker = document.createElement('emoji-picker');
    tagIconField.parentElement.appendChild(emojiPicker);
    for(var i = 0; i < tagFieldWrapper.length; i++) {
      tagFieldWrapper[i].classList.add('prevent-click');
    }
  }
  else {
    tagIconField.parentElement.removeChild(emojiPicker);
    for(var i = 0; i < tagFieldWrapper.length; i++) {
      tagFieldWrapper[i].classList.remove('prevent-click');
    }
  }
}

/* Clears the tag create/update form and closes the container modal */
export function close() {
  tagModal.classList.add('hide');
  tagTitleField.value = "";
  tagIconField.textContent = "";
  var selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
  if(selectedColor) selectedColor.checked = false;
  tagError.classList.add('hide');
  tagModal.classList.remove('tag-add', 'tag-update');
}