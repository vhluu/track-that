import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from '../TagsContainer/TagsContainer';
import CalendarContainer from '../CalendarContainer/CalendarContainer';
import BarGraph from '../../components/BarGraph/BarGraph';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

import './App.scss';

import * as actions from '../../store/actions/index';

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

  toggleGraph() {
    console.log('toggling graph');
    this.setState((prevState) => ({
      showGraph: !prevState.showGraph,
    }));
  }

  render() {
    const { tags, uid } = this.props;
    const { showGraph } = this.state;

    const data = [{ label: 'Jan', value: 10 }, { label: 'Feb', value: 20 }, { label: 'Mar', value: 15 }, { label: 'Apr', value: 6 }];
    
    const labelStep = 2;
    const lineStep = 5;
    const graphMax = 30;

    return (
      <div className="app flex_d main-wrapper card">
        <TagsContainer uid={uid} tags={tags} />
        <CalendarContainer uid={uid} tags={tags} />

        <Button btnType="round graph-button" clicked={this.toggleGraph}>Stats</Button>
        { showGraph && (
          <Modal show={showGraph} closeSelf={this.toggleGraph} extraClasses="graph-modal">
            <BarGraph data={data} max={graphMax} lineStep={lineStep} labelStep={labelStep} />
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
