import { close as closeTagModal } from './tag-modal.js';
import { userId } from './calendar.js';

var dayModal = document.querySelector('.edit-day-modal');
var selectAll = dayModal.querySelector('.select-all');
var dayCheckboxes = dayModal.querySelector('.day-checkboxes');
var dayTagDeleteBtn = dayModal.querySelector('.delete-icon');

var tagsList = document.querySelector('.tags-list');

var date = new Date();
var currentYear = (date.getYear() + 1900);


/* Removes selected tags from given day */
dayTagDeleteBtn.addEventListener('click', function(e) {
  var selectedDay = dayModal.getAttribute('data-day-modal');

  // delete selected tags from day
  var tagsToRemove = dayModal.querySelectorAll('input[type="checkbox"]:not(#check-all):checked');
  console.log(tagsToRemove);
  tagsToRemove = [...tagsToRemove].map(tag => (tag.id).substring(6));
  if(tagsToRemove.length > 0) dbDeleteDayTag(userId, selectedDay.substring(0,2), selectedDay.substring(2), currentYear, tagsToRemove);

  // remove from frontend
  var dayTags = document.querySelector(`.calendar [data-tag-day="${selectedDay}"] .day-tags`);
  tagsToRemove.forEach((tag) => {
    var removing = dayTags.querySelector(`[data-day-tag-id="${tag}"]`);
    removing.parentNode.removeChild(removing);
  });
  close(); 

  tagsToRemove.forEach((tag) => { // remove month from tag obj in db if tag no longer exists in month
    if(!document.querySelector(`.calendar [data-day-tag-id="${tag}"]`)) dbDeleteMonthFromTag(userId, tag, selectedDay.substring(0,2), currentYear);
  });
});


/* Select All checkbox functionality */
selectAll.querySelector('input').addEventListener('click', function() {
  var checkboxes = document.querySelectorAll('.day-checkbox');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = this.checked;
  }
});


export function close() {
  dayModal.classList.add('hide');
  selectAll.querySelector('input').checked = false;
}

export function toggleDayModal(e) {
  closeTagModal();
  e.stopPropagation();
  var currDayTags = e.target.querySelectorAll('.day-tag');
  if(dayModal.classList.contains('hide')) {
    if(currDayTags.length > 0) {
      dayModal.classList.remove('hide');
      // populate content
      dayModal.querySelector('.edit-day').textContent = e.target.querySelector('.day-number').textContent;
      var generatedCheckboxes = ``;
      var tagFromList;
      for(var i = 0; i < currDayTags.length; i++) {
        tagFromList = tagsList.querySelector(`#${currDayTags[i].getAttribute('data-day-tag-id')}`);
        generatedCheckboxes += `<div class="checkbox-wrapper">
          <input type="checkbox" id="check-${tagFromList.id}" class="day-checkbox">
          <label for="check-${tagFromList.id}">
            <div class="custom-checkbox"></div>
            ${tagFromList.outerHTML}
          </label>
        </div>`;
      }
      dayCheckboxes.innerHTML = generatedCheckboxes;
      dayModal.setAttribute('data-day-modal', e.target.getAttribute('data-tag-day'));
    }
  }
  else {
    close();
  }
}

dayModal.addEventListener('click', function(e) {
  e.stopPropagation();
})