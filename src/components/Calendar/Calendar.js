import React, { Component } from 'react';

import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import Day from './Day/Day';
import Icon from '../Icon/Icon';
import Modal from '../Modal/Modal';

import './Calendar.scss';

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
    const { onCreateDayTag, dayTags } = this.props;

    const dropId = e.dataTransfer.getData('text/plain');
    const dropDate = e.target.getAttribute('data-date');
    
    // add day tag if that tag wasnt already added
    if (!(dayTags[dropDate] && dayTags[dropDate].includes(dropId))) {
      onCreateDayTag(e.dataTransfer.getData('text/plain'), dropDate);
    }
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
      onDeleteDayTag(tagsToRemove, selectedDay);
      
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
                  <div className={`tag ${selectedDayTags[tagId].color}`} draggable="true" id={`${tagId}`} data-tag-color={selectedDayTags[tagId].color} data-tag-icon={selectedDayTags[tagId].icon} data-tag-title={selectedDayTags[tagId].title}><Icon data={selectedDayTags[tagId].icon} /> {selectedDayTags[tagId].title}</div>
                </Checkbox>
              ))}
            </div>
            <Button type="delete" clicked={this.deleteDayTags} />
          </Modal>
        ) }
      </div>
    );
  }
}

export default Calendar;
