import { initCalendar, setTags } from './calendar';
import initLogin from './login';
import initAddWidget from './addWidget';

initCalendar(); // initialize the calendar

// get the userId if the user is logged in
initLogin().then((userId) => {
  if (userId) {
    setTags(userId); // sets the user's tags in the calendar
    initAddWidget(userId); // initialize the add widget area
  }
});
