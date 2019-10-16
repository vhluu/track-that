import React, { Component } from 'react';
import Calendar from '../Calendar/Calendar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Calendar firebase={firebase} />
      </div>
    );
  }
}

export default App;
