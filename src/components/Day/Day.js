import React, { Component } from 'react';

class Day extends Component {
  render() {
    return (
      <div className="day">
        <span className="day-number">{this.props.date}</span>
        <div className="day-tags">
          {this.props.date.map((tags) => (
            <div className="day-tag green" data-day-tag-id="aa">🌱</div>
          ))}
        </div>
      </div>
    )
  }

}

export default Day;