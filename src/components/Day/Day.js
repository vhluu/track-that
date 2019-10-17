import React, { Component } from 'react';

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { date, tags } = this.props;
    return (
      <div className="day">
        <span className="day-number">{ date }</span>
        <div className="day-tags">
          <div className="day-tag green" data-day-tag-id="aa">🌱</div>
        </div>
      </div>
    );
  }
}

export default Day;
