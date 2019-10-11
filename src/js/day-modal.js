import { close as closeTagModal } from './tag-modal.js';
import { userId } from './calendar.js';

/*=================== Variables ===================*/

const dayModal = document.querySelector('.edit-day-modal');
const dayCheckboxes = dayModal.querySelector('.day-checkboxes');
const selectAll = dayModal.querySelector('.select-all');
const dayTagDeleteBtn = dayModal.querySelector('.delete-icon');

const tagsList = document.querySelector('.tags-list');

const date = new Date();
const currentYear = (date.getYear() + 1900);


/*=================== Functions ===================*/

/**
 * Toggles the day modal & populates it with data if shown
 */
export function toggleDayModal(e) {
  closeTagModal();
  e.stopPropagation();

  const currDayTags = e.target.querySelectorAll('.day-tag');
  if (dayModal.classList.contains('hide')) { // if day modal is open
    if (currDayTags.length > 0) {
      dayModal.classList.remove('hide');
      dayModal.querySelector('.edit-day').textContent = e.target.querySelector('.day-number').textContent; // adds day to modal
      
      // generates the checkboxes for all of the tags in the tags list
      let generatedCheckboxes = ``;
      currDayTags.forEach((dayTag) => {
        let tagFromList = tagsList.querySelector(`#${currDayTags[i].getAttribute('data-day-tag-id')}`);
        generatedCheckboxes += `<div class="checkbox-wrapper">
          <input type="checkbox" id="check-${tagFromList.id}" class="day-checkbox">
          <label for="check-${tagFromList.id}">
            <div class="custom-checkbox"></div>
            ${tagFromList.outerHTML}
          </label>
        </div>`;
      });
      dayCheckboxes.innerHTML = generatedCheckboxes;

      dayModal.setAttribute('data-day-modal', e.target.getAttribute('data-tag-day')); // adds attribute to modal specifying the day
    }
  } else { // day modal is closed
    close();
  }
}


/**
 * Closes/clears the day modal
 */
export function close() {
  dayModal.classList.add('hide');
  selectAll.querySelector('input').checked = false;
}


/**
 * Handles delete button click by removing selected tags from given day
 */
dayTagDeleteBtn.addEventListener('click', (e) => {
  const selectedDay = dayModal.getAttribute('data-day-modal');

  // deletes selected tags from database
  let tagsToRemove = dayModal.querySelectorAll('input[type="checkbox"]:not(#check-all):checked');
  tagsToRemove = [...tagsToRemove].map(tag => (tag.id).substring(6));
  if (tagsToRemove.length > 0) dbDeleteDayTag(userId, selectedDay.substring(0,2), selectedDay.substring(2), currentYear, tagsToRemove);

  // removes from tag from frontend
  const dayTags = document.querySelector(`.calendar [data-tag-day="${selectedDay}"] .day-tags`);
  tagsToRemove.forEach((tag) => {
    let removing = dayTags.querySelector(`[data-day-tag-id="${tag}"]`);
    removing.parentNode.removeChild(removing);
  });
  close(); 

  tagsToRemove.forEach((tag) => { // remove month from tag obj in db if tag no longer exists in month
    if (!document.querySelector(`.calendar [data-day-tag-id="${tag}"]`)) 
      dbDeleteMonthFromTag(userId, tag, selectedDay.substring(0,2), currentYear);
  });
});


/**
 * Select all checkbox functionality 
 */
selectAll.querySelector('input').addEventListener('click', function() {
  const checkboxes = document.querySelectorAll('.day-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = this.checked;
  });
});

/**
 * Stops propagation of click event on day modal 
 */
(function() {
  dayModal.addEventListener('click', (e) => {
    e.stopPropagation();
  })
})()
