import { openUpdateModal } from './tag-modal.js';
import { tagDragStart, tagDragEnd } from './tag.js';
import { tagDrop } from './cal.js';

/* Tag Modal */
var tagModal = document.querySelector('.tag-modal');

var addTagBtn = document.querySelector('.btn-add-tag');
var tagsList = document.querySelector('.tags-list');

/* Handles opening and closing of Add New Tag modal */
addTagBtn.addEventListener('click', function(e) {
  // TODO: closeDayModal();
  e.stopPropagation();
  tagModal.style.top = "auto";
  tagModal.classList.remove('tag-update', 'hide');
  tagModal.classList.add('tag-add');
});

export function appendTag(tag, id) {
  var newTag = document.createElement('div');
  newTag.textContent = tag.icon + " " + tag.title;
  newTag.className = "tag " + tag.color;
  newTag.setAttribute('draggable', true);
  newTag.id = "t" + id;
  newTag.setAttribute('data-tag-color', tag.color);
  newTag.setAttribute('data-tag-icon', tag.icon);
  newTag.setAttribute('data-tag-title', tag.title);

  newTag.addEventListener('dragstart', tagDragStart);
  newTag.addEventListener('dragend', tagDragEnd);
  newTag.addEventListener('drop', tagDrop, false);
  newTag.addEventListener('click', openUpdateModal);
  tagsList.appendChild(newTag);
}