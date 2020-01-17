import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from './TagsContainer';
import CalendarContainer from './CalendarContainer';

import * as actions from '../store/actions/index';

class App extends Component {
  componentDidMount() {
    const { onInitUser, onSignOutUser } = this.props;
    onInitUser('hello from calendar');

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        console.log(request);
        if (request.greeting === 'sign out app') {
          onSignOutUser();
        }
        return true;
      },
    );
  }

  render() {
    const { tags, uid } = this.props;
    return (
      <div className="app flex_d main-wrapper card">
        <TagsContainer tags={tags} />
        <CalendarContainer uid={uid} tags={tags} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
    uid: state.uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitUser: (msg) => dispatch(actions.initUser(msg)),
    onSignOutUser: () => dispatch(actions.signOutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
