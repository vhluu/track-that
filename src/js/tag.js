/*=================== Functions ===================*/

/**
 * Handles drag start event for tag by transferring the tag id
 */
export function tagDragStart(e) {
  e.target.classList.add('dragged');
  e.dataTransfer.effectAllowed = 'copyLink';
  e.dataTransfer.setData('text/plain', this.id);
}

/**
 * Handles drag end event by removing the dragged state styling
 */
export function tagDragEnd(e) {
  e.target.classList.remove('dragged');
}