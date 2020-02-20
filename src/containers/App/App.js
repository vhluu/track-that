import React, { Component } from 'react';
import { connect } from 'react-redux';

import TagsContainer from '../TagsContainer/TagsContainer';
import CalendarContainer from '../CalendarContainer/CalendarContainer';
import BarGraph from '../../components/BarGraph/BarGraph';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Select from '../../components/Select/Select';

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

  componentDidUpdate(prevProps) {
    console.log(prevProps.stats);
    console.log(this.props.stats);
  }

  toggleGraph() {
    console.log('toggling graph');
    
    console.log(this.props.tags);
    const { onGetStats } = this.props;
    // grab the stats for the chosen tag
    onGetStats('t2');

    this.setState((prevState) => ({
      showGraph: !prevState.showGraph,
    }));
  }

  render() {
    const { tags, uid, stats } = this.props;
    const { showGraph } = this.state;

    // setting graph config
    const labelStep = 2;
    const lineStep = 5;
    const graphMax = 30;
    const data = [];

    // populating data array with selected tag stats
    Object.entries(stats).forEach(([date, count]) => {
      // getting month as abbreviated string (ex. Jan)
      const monthString = new Date(`${date}-04`).toLocaleString('default', { month: 'short' });
      data.push({
        label: monthString,
        value: count,
      });
    });

    // select dropdown options
    const options = [ { label: '😃 hello', value: 't1' }, { label: '🌊 goodbye', value: 't2' } ];
    const defaultValue = 't2';

    return (
      <div className="app flex_d main-wrapper card">
        <TagsContainer uid={uid} tags={tags} />
        <CalendarContainer uid={uid} tags={tags} />

        <Button btnType="round graph-button" clicked={this.toggleGraph}>Stats</Button>
        { showGraph && (
          <Modal show={showGraph} closeSelf={this.toggleGraph} extraClasses="graph-modal">
            <Select value={defaultValue} options={options} />
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
    stats: state.stats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitUser: (msg) => dispatch(actions.initUser(msg)),
    onSignOutUser: () => dispatch(actions.signOutUser()),
    onReplaceDayTags: (tags, date) => dispatch(actions.replaceDayTags(tags, date)),
    onGetStats: (tagId) => dispatch(actions.getStats(tagId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
