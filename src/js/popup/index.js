import { initCalendar } from './calendar';
import { initLogin } from './login';
import initAddWidget from './addWidget';
import './emoji';
import '../../sass/popup.scss';

initCalendar(); // initialize the calendar
initLogin(); // get the userId if the user is logged in
initAddWidget();