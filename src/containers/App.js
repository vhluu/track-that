import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from './TagsContainer';
import CalendarContainer from './CalendarContainer';

import * as actions from '../store/actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
    };
  }

  componentDidMount() {
    const { onInitUser } = this.props;
    onInitUser();
    /* chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        this.setState({ uid: response.userId });
      } else {
        console.log("Couldn't get user");
      }
    }); */
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

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitUser: () => dispatch(actions.initUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
