import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from './TagsContainer';
import CalendarContainer from './CalendarContainer';

import * as actions from '../store/actions/index';

class App extends Component {
  componentDidMount() {
    const { onInitUser } = this.props;
    onInitUser();

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        console.log(request);
        if (request.greeting === 'sign out app') {
          sendResponse({ email: '' });
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
    onInitUser: () => dispatch(actions.initUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
