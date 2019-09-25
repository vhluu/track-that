window.onload = function() {
  /* Calendar */
  var calendarBoxes = document.querySelectorAll('.calendar .day');
  var calendarBoxNumbers = document.querySelectorAll('.day-number');
  var monthHeader = document.querySelector('.curr-month');
  var yearHeader = document.querySelector('.curr-year');

  /* Tags */
  var tagsList = document.querySelector('.tags-list');
  var addTagBtn = document.querySelector('.btn-add-tag');
  var tagModal = document.querySelector('.tag-modal');
  //var emojiPicker = tagModal.querySelector('emoji-picker');
  var colorPicker = tagModal.querySelector('.color-picker');
  var colorPickerItems = colorPicker.querySelectorAll('.color-picker-items');
  var createTagBtn = tagModal.querySelector('.btn-create-tag');
  var updateTagBtn = tagModal.querySelector('.btn-update-tag');
  var tagTitleField = tagModal.querySelector('[name="tag-field-title"]');
  var tagIconField = tagModal.querySelector(' .tag-field-icon');
  var tagFieldWrapper = tagModal.querySelectorAll('.tag-field-wrapper');
  var tagError = tagModal.querySelector('.tag-error-message');

  var userId;
  var userTags = {};
  var lastTagId = 0;

  var date = new Date();
  var currentMonth = date.getMonth();
  var currentYear = (date.getYear() + 1900);

  /* Gets chrome info of current user & adds data */
  chrome.identity.getProfileUserInfo(function(userInfo) {
    console.log(JSON.stringify(userInfo));
    userId = userInfo.id;

    // Gets user info and adds user in db if not already there
    chrome.storage.sync.get(["tt-created-user"], function(result) {
      if(!result["tt-created-user"]) {
        dbCreateUser(userInfo.id, userInfo.email);
      }
    });

    // Creates user tag list
    dbGetTags(userId).then(function(tags) {
      if(tags) {
        userTags = tags;
        var keys = Object.keys(tags);
        keys.forEach(function(key) {
          appendTag(tags[key], key);
        });
        lastTagId = parseInt(keys[keys.length - 1]) + 1;
      }
    });

    /* Sets calendar to current month */
    setCalendar(date.getMonth());
  });


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
        var days = Object.keys(taggedDays); // lists of days that have tags
        var dayTagList;
        days.forEach(function(day) {
          dayTagList = Object.values(taggedDays[day]); // list of tag objects for specific day          console.log(taggedDays[day]);
          dayTagList.forEach(function(tag) {
            appendDayTag(document.querySelector('[data-tag-day="' + day + '"]'), Object.keys(tag)[0]);
          });
        });
      }
    });
  }

  /* Formats the number so that it is always two digits (ex. 2 will be 02) */
  function formatDigit(num) {
    return num < 10 ? ('0' + num) : num;
  }

  /* Handles opening and closing of Add New Tag modal */
  addTagBtn.addEventListener('click', function(e) {
    tagModal.classList.add('tag-add');
    tagModal.classList.remove('hide');
    e.stopPropagation();
  });

  /* Handles opening and closing of Update/Remove New Tag modal */
  function openUpdateModal(e) {
    tagModal.classList.add('tag-update');
    tagModal.classList.remove('hide');
    e.stopPropagation();
    // populate data
    console.log(e.target);
    tagTitleField.value = e.target.getAttribute('data-tag-title');
    tagIconField.textContent = e.target.getAttribute('data-tag-icon');
    var selectedColor = document.querySelector('.color-picker #' + e.target.getAttribute('data-tag-color') + '-color'); 
    selectedColor.checked = true;
    // var selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
    // if(selectedColor) selectedColor.checked = false;
  };
  
  
  tagIconField.addEventListener('click', function() {
    // emojiPicker.classList.toggle('hide');
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

  document.body.addEventListener('click', function() {
    // if emoji picker is open, then close it
    // else check if tag modal is open, then close it
    emojiPicker = document.querySelector('emoji-picker');
    if(emojiPicker) toggleEmojiPicker();
    else if(tagModal.className.indexOf('hide') == -1) {
      closeTagModal();
    }
  });

 tagModal.addEventListener('click', function(e) {
    e.stopPropagation();
    if((e.target.tagName == 'FORM' || e.target.className == 'tag-modal card') && emojiPicker) toggleEmojiPicker(); // hide icon picker on modal click
  })


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
    toAdd.id = "day-tag-" + tagId;
    target.querySelector('.day-tags').appendChild(toAdd);
  }

  /* Drag & Drop */
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
        toAdd.id = "day-tag-" + droppedTagId;

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