import { tagDrop } from './cal.js';
import { tagDragStart, tagDragEnd } from './tag.js';
import { openUpdateModal } from './tag-modal.js';
import { close as closeDayModal } from './day-modal.js';

/*=================== Variables ===================*/
const tagModal = document.querySelector('.tag-modal');
const addTagBtn = document.querySelector('.btn-add-tag');



/*=================== Functions ===================*/

/**
 * Creates tag & appends to end of tags sidebar
 */
export function appendTag(tag, id) {
  const newTag = document.createElement('div');
  newTag.textContent = `${tag.icon} ${tag.title}`;
  newTag.className = `tag ${tag.color}`;
  newTag.id = `t${id}`;

  newTag.setAttribute('draggable', true);
  newTag.setAttribute('data-tag-color', tag.color);
  newTag.setAttribute('data-tag-icon', tag.icon);
  newTag.setAttribute('data-tag-title', tag.title);

  newTag.addEventListener('dragstart', tagDragStart);
  newTag.addEventListener('dragend', tagDragEnd);
  newTag.addEventListener('drop', tagDrop, false);
  newTag.addEventListener('click', openUpdateModal);

  let tagsList = document.querySelector('.tags-list');
  tagsList.appendChild(newTag);
}


/**
 *  Handles opening and closing of Add New Tag modal
 */
addTagBtn.addEventListener('click', (e) => {
  closeDayModal();
  e.stopPropagation();
  tagModal.style.top = 'auto';
  tagModal.classList.remove('tag-update', 'hide');
  tagModal.classList.add('tag-add');
});
