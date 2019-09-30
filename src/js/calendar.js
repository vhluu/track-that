window.onload = function() {
  /*=================== VARIABLES ===================*/
  /* Calendar */
  var calendarBoxes = document.querySelectorAll('.calendar .day');
  var calendarBoxNumbers = document.querySelectorAll('.day-number');
  var monthHeader = document.querySelector('.curr-month');
  var yearHeader = document.querySelector('.curr-year');

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

  /* Day Modal */
  var dayModal = document.querySelector('.edit-day-modal');
  var selectAll = dayModal.querySelector('.select-all');
  var dayCheckboxes = dayModal.querySelector('.day-checkboxes');

  var userId;
  var userTags = {};
  var lastTagId = 0;

  var date = new Date();
  var currentMonth = date.getMonth();
  var currentYear = (date.getYear() + 1900);


  /*=================== SET UP ===================*/
  /* Gets chrome info of current user & populates calendar/tags using db */
  chrome.identity.getProfileUserInfo(function(userInfo) {
    console.log(JSON.stringify(userInfo));
    userId = userInfo.id;

    // Gets user info and adds user in db if not already there
    chrome.storage.sync.get(["tt-created-user"], function(result) {
      if(!result["tt-created-user"]) {
        dbCreateUser(userInfo.id, userInfo.email);
      }
    });

    dbGetTags(userId).then(function(tags) { // Creates user tag list using db
      if(tags) {
        userTags = tags;
        var keys = Object.keys(tags);
        keys.forEach(function(key) {
          appendTag(tags[key], key);
        });
        lastTagId = parseInt(keys[keys.length - 1]) + 1;
      }
    });

    setCalendar(date.getMonth()); // sets calendar to current month
  });


  /*=================== CALENDAR ===================*/
  /* Sets calendar to given month */
  function setCalendar(month) {
    var currMonth = new Date();
    currMonth.setMonth(month);
    monthHeader.innerHTML = currMonth.toLocaleString('default', { month: 'long' });
    yearHeader.innerHTML = " " + (currMonth.getYear() + 1900);

    currMonth.setDate(1); // sets date to the 1st of current month
    var day = currMonth.getDay(); // gets day of week for the 1st
  
    var lastDay = new Date(currMonth.getYear(), month + 1, 0); // sets date to last day of current month
    var daysInMonth = lastDay.getDate(); // gets the number of days in current month
  
    var prevMonth = new Date();
    prevMonth.setMonth(month);
    prevMonth.setDate(0); // sets date to last day of previous month
    var endOfPrevDate = prevMonth.getDate();

    var today = (new Date()).getDate();

    // Sets the calendar days
    for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
      calendarBoxNumbers[i].textContent = endOfPrevDate - day + i + 1;
      calendarBoxes[i].classList.add('not-current');
      calendarBoxes[i].setAttribute('data-tag-day', formatDigit(prevMonth.getMonth() + 1) + formatDigit(endOfPrevDate - day + i + 1));
    }
    for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
      calendarBoxNumbers[day + i].textContent = i + 1;
      if((i + 1) == today) calendarBoxes[day + i].classList.add('today');
      calendarBoxes[i].setAttribute('data-tag-day', formatDigit(currMonth.getMonth() + 1) + formatDigit(i + 1));
    }
    for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
      calendarBoxNumbers[day + daysInMonth + i].textContent = i + 1;
      calendarBoxes[day + daysInMonth + i].classList.add('not-current');
      calendarBoxes[day + daysInMonth + i].setAttribute('data-tag-day', formatDigit(currMonth.getMonth() + 2) + formatDigit(i + 1));
    }

    // Gets tags for current month & sets them in the calendar
    dbGetDayTags(userId, formatDigit(month + 1), currentYear).then(function(taggedDays) {
      if(taggedDays) {
        var tags = Object.keys(taggedDays); // lists of days that have tags
        tags.forEach(function(tag) {
          days = Object.keys(taggedDays[tag]);
          days.forEach(function(day) {
            appendDayTag(document.querySelector('[data-tag-day="' + day + '"]'), tag);
          });
        });
      }
    });

    for(var i = 0; i < calendarBoxes.length; i++) { 
      calendarBoxes[i].addEventListener('click', toggleDayModal); // opens modal when clicking on a calendar day
    }
  }


  /*=================== TAG ADD/UPDATE MODAL ===================*/
  /* Handles opening and closing of Add New Tag modal */
  addTagBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    tagModal.style.top = "auto";
    tagModal.classList.remove('tag-update');
    tagModal.classList.add('tag-add');
    tagModal.classList.remove('hide');
  });

  /* Handles opening and closing of Update/Remove New Tag modal */
  function openUpdateModal(e) {
    e.stopPropagation();
    tagModal.style.top = e.target.getBoundingClientRect().top + 'px';
    tagModal.classList.remove('tag-add');
    tagModal.classList.add('tag-update');
    tagModal.classList.remove('hide');
    // populate data
    tagTitleField.value = e.target.getAttribute('data-tag-title');
    tagIconField.textContent = e.target.getAttribute('data-tag-icon');
    var selectedColor = document.querySelector('.color-picker #' + e.target.getAttribute('data-tag-color') + '-color'); 
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

  /* Clicking on the body closes the innermost modal that is open */
  document.body.addEventListener('click', function() {
    emojiPicker = document.querySelector('emoji-picker');
    if(emojiPicker) toggleEmojiPicker();
    else if(deleteConfirm.className.indexOf('hide') == -1) deleteConfirm.classList.add('hide');
    else if(tagModal.className.indexOf('hide') == -1) closeTagModal();
  });

  tagModal.addEventListener('click', function(e) {
    e.stopPropagation();
    if((e.target.tagName == 'FORM' || (e.target.tagName !== 'svg' && e.target.className.includes('tag-modal'))) && emojiPicker) toggleEmojiPicker(); // hide icon picker on modal click
  })


  /*=================== TAG CRUD FUNCTIONALITY ===================*/
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
    
    closeTagModal();
  });

  /* Updates current tag */
  updateTagBtn.addEventListener('click', function() {
    // check if any fields are updated
    var updatedTag = {
      title: tagTitleField.value,
      icon: tagIconField.textContent,
      color: document.querySelector('input[name="tag-color-picker"]:checked').value
    }

    var tagId = tagModal.getAttribute('data-tag-modal-id');
    var tag = tagsList.querySelector('#' + tagId);
    var oldTag = {
      title: tag.getAttribute('data-tag-title'),
      icon: tag.getAttribute('data-tag-icon'),
      color: tag.getAttribute('data-tag-color')
    }
    
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
      var dayTags = document.querySelectorAll('.calendar [data-day-tag-id="' + tagId + '"]');
      for(var i = 0; i < dayTags.length; i++) {
        dayTags[i].classList.remove(oldTag.color);
        dayTags[i].classList.add(updatedTag.color);
        dayTags[i].textContent = updatedTag.icon;
      }
    }
    closeTagModal();
  });

  /* Deletes current tag */
  confirmDelete.addEventListener('click', function(e) {
    deleteConfirm.classList.add('hide');
    closeTagModal();
    var tagId = tagModal.getAttribute('data-tag-modal-id');
    dbDeleteTag(userId, tagId);

    tagsList.removeChild(document.querySelector('#' + tagId)); // remove from frontend

    var dayTags = document.querySelectorAll('.calendar [data-day-tag-id="' + tagId + '"]');
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
  function toggleEmojiPicker() {
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

  /*=================== HELPER FUNCTIONS ===================*/
  /* Formats the number so that it is always two digits (ex. 2 will be 02) */
  function formatDigit(num) {
    return num < 10 ? ('0' + num) : num;
  }

  /* Clears the tag create/update form and closes the container modal */
  function closeTagModal() {
    tagModal.classList.add('hide');
    tagTitleField.value = "";
    tagIconField.textContent = "";
    var selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
    if(selectedColor) selectedColor.checked = false;
    tagError.classList.add('hide');
    tagModal.classList.remove('tag-add');
    tagModal.classList.remove('tag-update');
  }

  /* Creates tag element and appends it to tags list in the dom */
  function appendTag(tag, id) {
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

  /* Creates tag element and appends it to calendar day the dom */
  function appendDayTag(target, tagId) {
    var toAdd = document.createElement('div');
    var tagFromList = tagsList.querySelector('#' + tagId);
    toAdd.className = "day-tag " + tagFromList.getAttribute('data-tag-color');
    toAdd.textContent = tagFromList.getAttribute('data-tag-icon');
    toAdd.setAttribute("data-day-tag-id", tagId);
    target.querySelector('.day-tags').appendChild(toAdd);
  }


  /*=================== DAY MODAL ===================*/
  /* Shows modal for deleting tags when click on a calendar day  */
  function toggleDayModal(e) {
    console.log(e.target);
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
      }
    }
    else {
      dayModal.classList.add('hide');
      selectAll.querySelector('input').checked = false;
    }
  }

  
  /* Selects all checkboxes */
  selectAll.querySelector('input').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('.day-checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = this.checked;
    }
  });


  /*=================== DRAG & DROP ===================*/
  function tagDragStart(e) {
    e.target.classList.add('dragged');
    e.dataTransfer.effectAllowed = 'copyLink';
    e.dataTransfer.setData('text/plain', this.id);
  }

  function tagDragEnd(e) {
    e.target.classList.remove('dragged');
  }

  function tagDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // allows drop
  }

  function tagDragEnter(e) {
    if(e.target.classList.contains("day")) {
      e.target.classList.add('chosen-day');
    }
  }

  function tagDragLeave(e) {
    if(e.target.classList.contains("day")) {
      e.target.classList.remove('chosen-day');
    }
  }

  var droppedTagId; var droppedTag;
  function tagDrop(e) { // adds dropped tag to calendar for a specific day
    if(e.stopPropagation) {
      e.stopPropagation();
    }

    // create tag element
    if(e.currentTarget.classList.contains("day")) {
      e.currentTarget.classList.remove('chosen-day');
      droppedTagId = e.dataTransfer.getData('text/plain');
      droppedTag = document.querySelector('#' + droppedTagId);

      if(!(e.currentTarget.querySelector('#day-tag-' + droppedTagId))) {
        var toAdd = document.createElement('div');
        toAdd.className = "day-tag " + droppedTag.getAttribute('data-tag-color');
        toAdd.textContent = droppedTag.getAttribute('data-tag-icon');
        toAdd.setAttribute("data-day-tag-id", droppedTagId);
        e.currentTarget.querySelector('.day-tags').appendChild(toAdd);

        // store tag 
        dbCreateDayTag(userId, { id: droppedTagId, date: e.currentTarget.getAttribute('data-tag-day') }, formatDigit(currentMonth + 1), currentYear);
      }
    }
  }

  var exampleTag = document.querySelector('.tags-list .tag');
  exampleTag.addEventListener('dragstart', tagDragStart);
  exampleTag.addEventListener('dragend', tagDragEnd);
  exampleTag.addEventListener('drop', tagDrop, false);
  exampleTag.addEventListener('click', openUpdateModal);

  for (var i = 0; i < calendarBoxes.length; i++) {
    calendarBoxes[i].addEventListener('dragover', tagDragOver, false);
    calendarBoxes[i].addEventListener('dragenter', tagDragEnter, false);
    calendarBoxes[i].addEventListener('dragleave', tagDragLeave, false);
    calendarBoxes[i].addEventListener('drop', tagDrop, false);
  }
}