import React, { Component } from 'react';

import { connect } from 'react-redux';

import BarGraph from '../../components/BarGraph/BarGraph';
import Select from '../../components/Select/Select';

import * as actions from '../../store/actions/index';

class StatsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [], // options for select dropdown
      defaultValue: null, // default value for select dropdown
      data: [], // graph data
    };

    // setting graph config
    this.graphConfig = {
      labelStep: 2, // label step of 2 will show labels on every 2n line
      lineStep: 5, // line step of 5 will show a line for every 5n value
      graphMax: 30, // the max y-value of the graph
    };
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
      });
    }
  }

  /* Updates the graph with data from the current stats */
  updateGraphData() {
    const { stats } = this.props;
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

    this.setState({
      data,
    });
  }

  render() {
    const { stats, tags } = this.props;
    const { options, defaultValue, data } = this.state;
    const { labelStep, lineStep, graphMax } = this.graphConfig;

    return (
      <div className="stats-container">
        { defaultValue && options && <Select value={defaultValue} options={options} /> }
        <BarGraph data={data} max={graphMax} lineStep={lineStep} labelStep={labelStep} />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatsContainer);