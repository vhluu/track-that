var calendarBtn = document.querySelector('.view-cal');
console.log(calendarBtn);
calendarBtn.addEventListener('click', function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('calendar.html')}, function(tab) {
    // Tab opened.
  });
});