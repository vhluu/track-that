import React, { Component } from 'react';
import { connect } from 'react-redux';

import CalendarContainer from '../CalendarContainer/CalendarContainer';
import StatsContainer from '../StatsContainer/StatsContainer';
import TagsContainer from '../TagsContainer/TagsContainer';

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

import './App.scss';

import * as actions from '../../store/actions/index';
import { isMac, isWindows } from '../../util/utility';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showGraph: false,
    };

    this.toggleGraph = this.toggleGraph.bind(this);
  }

  componentDidMount() {
    const { onInitUser, onSignOutUser, onReplaceDayTags } = this.props;
    onInitUser('hello from calendar');

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request.greeting === 'sign out app') {
          onSignOutUser();
        } else if (request.greeting === 'updating day tags') {
          onReplaceDayTags(request.updated, request.date);
        }
        return true;
      },
    );
  }

  /* Toggles the stats modal */
  toggleGraph() {
    this.setState((prevState) => ({
      showGraph: !prevState.showGraph,
    }));
  }

  render() {
    const { tags, uid } = this.props;
    const { showGraph } = this.state;

    return (
      <div className={`app flex_d main-wrapper card${isMac ? ' macos' : ''}${isWindows ? ' windows' : ''}`}>
        <TagsContainer uid={uid} tags={tags} />
        <CalendarContainer uid={uid} tags={tags} />

        <Button type="graph-button" clicked={this.toggleGraph} ariaLabel="View Stats">Stats</Button>
        { showGraph && (
          <Modal show={showGraph} closeSelf={this.toggleGraph} extraClasses="graph-modal">
            <StatsContainer />
          </Modal> 
        ) }
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
