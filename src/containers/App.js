import React, { Component } from 'react';
import TagsContainer from './TagsContainer';
import CalendarContainer from './CalendarContainer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
    };
  }

  componentDidMount() {
    chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        this.setState({ uid: response.userId });
      } else {
        console.log("Couldn't get user");
      }
    });
  }

  render() {
    const { uid } = this.state;
    return (
      <div className="app flex_t main-wrapper card">
        <TagsContainer />
        <CalendarContainer />
      </div>
    );
  }
}

export default App;
