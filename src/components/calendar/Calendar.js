import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Day from './Day/Day';
import DayModal from './DayModal/DayModal';

import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDayModal: false,
    };

    this.toggleDayModal = this.toggleDayModal.bind(this);
  }

  toggleDayModal() {
    console.log('toggling');
    this.setState((prevState) => ({
      showDayModal: !(prevState.showDayModal),
    }));
  }

  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const { showDayModal } = this.state;
    const { days, tags } = this.props;

    return (
      <div className="calendar">
        { daysOfWeek.map((day) => (
          <div className="cal-header">{ day }</div>
        ))}
        { days.map((day) => (
          <Day full={day.full} date={day.date} tags={tags[day.full]} onClick={this.toggleDayModal} />
        ))}

        { showDayModal && <DayModal /> }
      </div>
    );
  }
}

export default Calendar;
