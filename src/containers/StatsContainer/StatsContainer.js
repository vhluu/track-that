import React, { Component } from 'react';
import { connect } from 'react-redux';

import BarGraph from '../../components/BarGraph/BarGraph';
import Overlay from '../../components/Overlay/Overlay';
import Select from '../../components/Select/Select';
import './StatsContainer.scss';

import * as actions from '../../store/actions/index';

class StatsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [], // options for select dropdown
      defaultValue: null, // default value for select dropdown
      data: [], // graph data
      noneTagged: false, // boolean indicating whether the current tag has no tagged days
      currentValue: null, // current value for select dropdown
    };

    // setting graph config
    this.graphConfig = {
      labelStep: 2, // label step of 2 will show labels on every 2n line
      lineStep: 5, // line step of 5 will show a line for every 5n value
      graphMax: 30, // the max y-value of the graph
    };

    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount() {
    const { onGetStats, tags } = this.props;
    
    this.populateSelect(); // populate the select dropdown
    if (tags) onGetStats(Object.keys(tags)[0]); // set the first tag as the default dropdown value
  }

  componentDidUpdate(prevProps) {
    const { stats } = this.props;
    // update the graph if stats has changed
    if (prevProps.stats !== stats) this.updateGraphData();
  }

  componentWillUnmount() {
    const { onClearStats } = this.props;
    onClearStats(); // clear stats saved in store
  }

  /* Handles select dropdown change by updating graph w/ new values */
  onSelectChange(value) {
    const { onGetStats, stats } = this.props;
    this.setState({
      currentValue: value,
    });
    if (!stats[value]) onGetStats(value);
    else this.updateGraphData(value);
  }
  
  /* Populates the select dropdown with the tags */
  populateSelect() {
    const { tags } = this.props;
    if (tags) {
      const options = [];
      let defaultValue;

      Object.entries(tags).forEach(([tagId, tag], index) => {
        if (index === 0) defaultValue = tagId;
        options.push({ value: tagId, label: `${tag.icon} ${tag.title}` });
      });

      this.setState({
        options,
        defaultValue,
        currentValue: defaultValue,
      });
    } else {
      this.setState({
        defaultValue: 'empty',
        noneTagged: true,
      });
    }
  }

  /* Updates the graph with data from the current stats */
  updateGraphData(value) {
    const { stats } = this.props;
    const { currentValue } = this.state;
    const data = [];
    const tagStats = stats && stats[value || currentValue] ? Object.entries(stats[value || currentValue]) : []; // stats for selected tag
    const noneTagged = (tagStats.length === 0); // whether there are any tagged days
    
    // populating data array with selected tag stats
    tagStats.forEach(([date, count]) => {
      // getting month as abbreviated string (ex. Jan)
      const monthString = new Date(`${date}-04`).toLocaleString('default', { month: 'short' });
      data.push({
        label: monthString,
        value: count,
      });
    });

    this.setState({
      data,
      noneTagged,
    });
  }

  render() {
    const { options, defaultValue, data, noneTagged } = this.state;
    const { labelStep, lineStep, graphMax } = this.graphConfig;

    return (
      <div className="stats-container">
        <div className="stats-header flex space-between align-center">
          <h2>Tags Per Month</h2>
          { defaultValue && options && <Select value={defaultValue} options={options} onChange={this.onSelectChange} /> }
        </div>
        <Overlay show={noneTagged}>
          <BarGraph data={data} max={graphMax} lineStep={lineStep} labelStep={labelStep} />
          <div className="none-tagged-msg">
            <span>😮🔎</span><br />
            No tagged days found!
          </div>
        </Overlay>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
    stats: state.stats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetStats: (tagId) => dispatch(actions.getStats(tagId)),
    onClearStats: () => dispatch(actions.clearStats()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatsContainer);