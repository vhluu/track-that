import React, { Component } from 'react';
import { connect } from 'react-redux';

import BarGraph from '../../components/BarGraph/BarGraph';
import Icon from '../../components/Icon/Icon';
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
        options.push({ 
          value: tagId,
          label: <><Icon data={tag.icon} /> {tag.title}</>
        });
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

    let fullStats = [];
    if (tagStats.length > 1) { // add missing months between start & end dates
      fullStats.push(tagStats[0]);
      for (let i = 0; i < tagStats.length - 1; i++) {
        let currDate = { 
          year: parseInt(tagStats[i][0].substring(0,4)),
          month: parseInt(tagStats[i][0].substring(5), 10)
        };

        let nextDate = {
          year: parseInt(tagStats[i+1][0].substring(0,4)),
          month: parseInt(tagStats[i+1][0].substring(5), 10)
        };

        let gap = (12 * (nextDate.year - currDate.year)) + nextDate.month - currDate.month;

        for (let j = 1; j < gap; j++) {
          currDate.year += Math.floor(currDate.month / 12);
          currDate.month = currDate.month == 12 ? 1 : currDate.month + 1;
          
          fullStats.push([`${currDate.year}-${currDate.month < 10 ? `0${currDate.month}` : currDate.month}`, 0]);
        }

        fullStats.push(tagStats[i+1]);
      }
    } else if (tagStats.length == 1) {
      fullStats.push(tagStats[0]);
    }

    let prevYear = '';
    fullStats.forEach(([date, count]) => { // convert stats in more legible graph data
      // get month as abbreviated string (ex. Jan)
      const monthStr = (new Date(`${date}-04`)).toLocaleString('default', { month: 'short' });
      const yearStr = date.substring(0,4);
      
      data.push({
        label: `${monthStr} ${yearStr !== prevYear ? yearStr : ''}`,
        value: count,
      });
      
      prevYear = yearStr;
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