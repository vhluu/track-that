export function tagDragStart(e) {
  e.target.classList.add('dragged');
  e.dataTransfer.effectAllowed = 'copyLink';
  e.dataTransfer.setData('text/plain', this.id);
}

export function tagDragEnd(e) {
  e.target.classList.remove('dragged');
}