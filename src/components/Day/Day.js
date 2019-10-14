import React, { Component } from 'react';

class Day extends Component {
  render() {
    return (
      <div className="day">
        <span className="day-number">{this.props.date}</span>
        <div className="day-tags"></div>
      </div>
    )
  }

}

export default Day;