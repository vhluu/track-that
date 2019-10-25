import React, { Component } from 'react';
import Calendar from '../calendar/Calendar';
import './App.css';

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
        <Calendar uid={uid} />
    );
  }
}

export default App;
