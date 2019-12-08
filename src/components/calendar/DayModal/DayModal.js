import React, { Component } from 'react';

class DayModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAll: false,
    };

    this.selectAll = this.selectAll.bind(this);
  }

  selectAll() {
    this.setState({
      selectedAll: true,
    });
  }

  render() {
    const { tags } = this.props;
    const { selectedAll } = this.state;

    return (
      <div className="edit-day-modal card">
        <p className="edit-day"></p>

        <div className="checkbox-wrapper select-all">
          <input type="checkbox" id="check-all" />
          <label htmlFor="check-all" onClick={this.selectAll}>
            <div className="custom-checkbox" />
            <div>Select All</div>
          </label>
        </div>

        <div className="day-checkboxes">
          {tags && Object.keys(tags).map((tagId) => (
            <div className="checkbox-wrapper">
              <input type="checkbox" id={`check-${tagId}`} className="day-checkbox" checked={selectedAll} />
              <label htmlFor={`check-${tagId}`}>
                <div className="custom-checkbox" />
                <div className={`tag ${tags[tagId].color}`} draggable="true" id={`${tagId}`} data-tag-color={tags[tagId].color} data-tag-icon={tags[tagId].icon} data-tag-title={tags[tagId].title}>{tags[tagId].icon} {tags[tagId].title}</div>
              </label>
            </div>
          ))}
        </div>
        <svg className="delete-icon" viewBox="0 0 137.583 164.571" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-42.333 -64.167)"><rect x="52.917" y="112.32" width="116.42" height="116.42" rx="10.583" ry="7.276" fill="#CFD8DC"/><rect  className="delete-icon-top" x="127" y="64.167" width="10.583" height="31.75" rx="4.914" ry="5.291" fill="#CFD8DC"/><g fill="#CFD8DC" className="delete-icon-top"><rect x="84.667" y="64.167" width="10.583" height="31.75" rx="5.291" ry="5.292"/><rect x="42.333" y="85.333" width="137.58" height="20.411" rx="10.583" ry="15.308"/><rect x="84.667" y="64.167" width="52.917" height="10.583" rx="10.583" ry="7.938"/></g><g fill="#B0BEC5"><rect transform="scale(1 -1)" x="105.83" y="-212.86" width="10.583" height="84.667" rx="10.583" ry="7.276"/><rect x="74.083" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.761"/><rect x="137.58" y="127.67" width="10.583" height="84.667" rx="10.583" ry="7.276"/></g></g></svg>
      </div>
    );
  }
}

export default DayModal;
