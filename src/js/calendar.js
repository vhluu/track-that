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
  var tagTitleField = tagModal.querySelector('[name="tag-field-title"]');
  var tagIconField = tagModal.querySelector(' .tag-field-icon');
  var tagFieldWrapper = tagModal.querySelectorAll('.tag-field-wrapper');

  /* Sets calendar to current month */
  var date = new Date();
  setCalendar(date.getMonth());


  /* Sets calendar to given month */
  function setCalendar(month) {
    var date = new Date();
    date.setMonth(month);
    monthHeader.innerHTML = date.toLocaleString('default', { month: 'long' });
    yearHeader.innerHTML = " " + (date.getYear() + 1900);

    date.setDate(1); // sets date to the 1st of current month
    var day = date.getDay(); // gets day of week for the 1st
  
    var lastDay = new Date(date.getYear(), month + 1, 0); // sets date to last day of current month
    var daysInMonth = lastDay.getDate(); // gets the number of days in current month
  
    date.setDate(0); // sets date to last day of previous month
    var endOfPrevDate = date.getDate();

    var today = (new Date()).getDate();

    // Sets the calendar days
    for (var i = 0; i < day; i++) { // from end of previous month to 1st of current month
      calendarBoxNumbers[i].textContent = endOfPrevDate - day + i + 1;
      calendarBoxes[i].classList.add('not-current');
    }
    for(var i = 0; i < daysInMonth; i++) { // from 1st to end of month
      calendarBoxNumbers[day + i].textContent = i + 1;
      if((i + 1) == today) calendarBoxes[day + i].classList.add('today');
    }
    for (var i = 0; i < (calendarBoxes.length - daysInMonth - day); i++) { // beginning of next month 
      calendarBoxNumbers[day + daysInMonth + i].textContent = i + 1;
      calendarBoxes[day + daysInMonth + i].classList.add('not-current');
    }
  }

  /* Handles opening and closing of Add New Tag modal */
  addTagBtn.addEventListener('click', function() {
    tagModal.classList.remove('hide');
  });

  
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
      tagModal.classList.add('hide');
      tagTitleField.value = "";
      tagIconField.textContent = "";
    }
  });

 tagModal.addEventListener('click', function(e) {
    e.stopPropagation();
    if((e.target.tagName == 'FORM' || e.target.className == 'tag-modal card') && emojiPicker) toggleEmojiPicker(); // hide icon picker on modal click
  })

  addTagBtn.addEventListener('click', function(e) {
    e.stopPropagation();
  })

  /* Create new tag */
  createTagBtn.addEventListener('click', function() {
    var newTag = document.createElement('div');
    newTag.textContent = tagIconField.textContent + tagTitleField.value;
    
    tagsList.appendChild(newTag);
    var selectedColor = document.querySelector('input[name="tag-color-picker"]:checked');
    newTag.className = "tag " + selectedColor.value;

    // store tag

    // clear form and close modal
    tagModal.classList.add('hide');
    tagTitleField.value = "";
    tagIconField.textContent = "";
    selectedColor.checked = false;
  });

}