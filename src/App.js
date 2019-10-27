import React, { Component } from 'react';
import Calendar from './components/Calendar/Calendar';
import SideBar from './components/SideBar/SideBar';
import TagList from './components/TagList/TagList';

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
        <SideBar>
          <TagList uid={uid} />
          <
        </SideBar>
        <Calendar uid={uid} />
      </div>
    );
  }
}

export default App;
