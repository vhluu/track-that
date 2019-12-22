import React, { Component } from 'react';

import Day from './Day/Day';
import Modal from '../Modal/Modal';
import Checkbox from '../Checkbox/Checkbox';

import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDayModal: false,
      selectedDay: null,
      selectedDayTags: null,
      selectAll: false,
      checkedItems: null,
    };

    this.toggleDayModal = this.toggleDayModal.bind(this);
    this.closeDayModal = this.closeDayModal.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.deleteDayTags = this.deleteDayTags.bind(this);
  }

  /* Handles Calendar Drag & Drop Events */
  onDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // allows drop to happen
  }

  onDragEnter(e) {
    if (e.target.classList.contains('day')) e.target.classList.add('chosen-day'); // adds bg color to calendar day
  }

  onDragLeave(e) {
    if (e.target.classList.contains('day')) e.target.classList.remove('chosen-day'); // removes bg color from calendar day
  }

  onDrop(e) {
    if (e.stopPropagation) { e.stopPropagation(); }

    // creates tag elements
    const { onCreateDayTag, month, year } = this.props;
    onCreateDayTag(e.dataTransfer.getData('text/plain'), { date: e.target.getAttribute('data-date'), month, year });
    if (e.target.classList.contains('day')) e.target.classList.remove('chosen-day'); // removes bg color from calendar day
  }

  /* Toggles day modal and populates it with tags for chosen day */
  toggleDayModal(selectedDay) {
    const { getTagInfo, dayTags } = this.props;
    const { showDayModal } = this.state;
    const currDayTags = dayTags[selectedDay];

    // if day modal isnt currently open & the selected day has tags, then populate the content for modal
    if (!showDayModal && currDayTags) {
      const initialCheckedItems = new Array(currDayTags.length).fill(false); // makes sure checkboxes are initially unchecked
      this.setState((prevState) => ({
        showDayModal: !(prevState.showDayModal),
        selectedDay,
        selectedDayTags: getTagInfo(currDayTags),
        selectAll: false,
        checkedItems: initialCheckedItems,
      }));
    } else if (showDayModal) { // if day modal is currently open, then close it
      this.setState((prevState) => ({
        showDayModal: !(prevState.showDayModal),
        selectedDayTags: null,
        selectAll: false,
      }));
    }
  }

  closeDayModal(e) {
    if (!e.target.classList.contains('day')) {
      this.setState({
        showDayModal: false,
      });
    }
  }

  /* Handles toggle of select all checkbox by toggling other checkboxes */
  toggleSelectAll(e) {
    const isChecked = e.target.checked;

    this.setState((prevState) => ({ 
      checkedItems: new Array(prevState.checkedItems.length).fill(isChecked),
      selectAll: isChecked,
    }));
  }

  /* Handles toggle of individual checkbox */
  handleCheckboxChange(e) {
    const checkboxIndex = e.target.getAttribute('data-index');
    const isChecked = e.target.checked;

    this.setState((prevState) => ({ 
      checkedItems: prevState.checkedItems.map((item, index) => (index === parseInt(checkboxIndex) ? isChecked : item)),
      selectAll: !isChecked ? false : prevState.selectAll,
    }));
  }

  /* Gets selected tags and removes them from the selected day */
  deleteDayTags() {
    const { onDeleteDayTag, month, year } = this.props;
    const { selectedDay, checkedItems, selectedDayTags } = this.state;

    let tagsToRemove = selectedDayTags.filter((tag, index) => checkedItems[index]);
    if (tagsToRemove.length > 0) {
      // removes day tags from database
      tagsToRemove = tagsToRemove.map((tag) => tag.id);
      onDeleteDayTag(tagsToRemove, { month, day: selectedDay.substring(2), year });
      
      this.toggleDayModal(selectedDay); // close day modal
    }
  }

  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const { showDayModal, selectedDayTags, selectAll, checkedItems } = this.state;
    const { days, dayTags, getTagInfo, tagsReady } = this.props;

    return (
      <div className="calendar">
        { daysOfWeek.map((day) => (
          <div className="cal-header">{ day }</div>
        ))}
        { days.map((day) => (
          <Day 
            full={day.full} 
            date={day.date} 
            tags={dayTags ? dayTags[day.full] : null} 
            onClick={this.toggleDayModal} 
            onDragOver={this.onDragOver}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            getTagInfo={getTagInfo}
            tagsReady={tagsReady}
            currentMonth={day.currentMonth}
            current={day.current}
          />
        ))}

        { showDayModal && (
          <Modal show={showDayModal} extraClasses="edit-day-modal" closeSelf={this.closeDayModal}>
            <p className="edit-day"></p>
            <Checkbox id="check-select-all" extraClasses="select-all" checked={selectAll} onChange={this.toggleSelectAll}>Select All</Checkbox>
            <div className="day-checkboxes">
              {selectedDayTags && Object.keys(selectedDayTags).map((tagId, index) => (
                <Checkbox id={`check-${tagId}`} index={index} checked={checkedItems[index]} onChange={this.handleCheckboxChange}>
                  <div className={`tag ${selectedDayTags[tagId].color}`} draggable="true" id={`${tagId}`} data-tag-color={selectedDayTags[tagId].color} data-tag-icon={selectedDayTags[tagId].icon} data-tag-title={selectedDayTags[tagId].title}>{selectedDayTags[tagId].icon} {selectedDayTags[tagId].title}</div>
                </Checkbox>
              ))}
            </div>
            <svg className="delete-icon" onClick={this.deleteDayTags} viewBox="0 0 137.583 164.571" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-42.333 -64.167)"><rect x="52.917" y="112.32" width="116.42" height="116.42" rx="10.583" ry="7.276" fill="#CFD8DC"/><rect  className="delete-icon-top" x="127" y="64.167" width="10.583" height="31.75" rx="4.914" ry="5.291" fill="#CFD8DC"/><g fill="#CFD8DC" className="delete-icon-top"><rect x="84.667" y="64.167" width="10.583" height="31.75" rx="5.291" ry="5.292"/><rect x="42.333" y="85.333" width="137.58" height="20.411" rx="10.583" ry="15.308"/><rect x="84.667" y="64.167" width="52.917" height="10.583" rx="10.583" ry="7.938"/></g><g fill="#B0BEC5"><rect transform="scale(1 -1)" x="105.83" y="-212.86" width="10.583" height="84.667" rx="10.583" ry="7.276"/><rect x="74.083" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.761"/><rect x="137.58" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.276"/></g></g></svg>
          </Modal>
        ) }
      </div>
    );
  }
}

export default Calendar;
