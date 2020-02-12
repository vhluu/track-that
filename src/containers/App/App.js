import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from '../TagsContainer/TagsContainer';
import CalendarContainer from '../CalendarContainer/CalendarContainer';
import BarGraph from '../../components/BarGraph/BarGraph';

import './App.scss';

import * as actions from '../../store/actions/index';

class App extends Component {
  componentDidMount() {
    const { onInitUser, onSignOutUser, onReplaceDayTags } = this.props;
    onInitUser('hello from calendar');

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        console.log(request);
        if (request.greeting === 'sign out app') {
          onSignOutUser();
        } else if (request.greeting === 'updating day tags') {
          onReplaceDayTags(request.updated, request.date);
        }
        return true;
      },
    );
  }

  render() {
    const { tags, uid } = this.props;
    return (
      <div className="app flex_d main-wrapper card">
        <TagsContainer uid={uid} tags={tags} />
        <CalendarContainer uid={uid} tags={tags} />
        <BarGraph />
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
    onReplaceDayTags: (tags, date) => dispatch(actions.replaceDayTags(tags, date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
