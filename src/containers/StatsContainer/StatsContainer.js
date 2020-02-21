import React, { Component } from 'react';

import { connect } from 'react-redux';

import BarGraph from '../../components/BarGraph/BarGraph';
import Select from '../../components/Select/Select';

import * as actions from '../../store/actions/index';

class StatsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stats } = this.props;
    // populateSelect();
    // getStats()
  }

  componentDidUpdate() {

  }
  

  render() {
    const { stats, tags } = this.props;

    // select dropdown options
    // const options = [ { label: '😃 hello', value: 't1' }, { label: '🌊 goodbye', value: 't2' } ];
    const options = [];
    let defaultValue;
    if (tags) {
      Object.entries(tags).forEach(([tagId, tag], index) => {
        if (index === 0) defaultValue = tagId;
        options.push({ value: tagId, label: `${tag.icon} ${tag.title}` });
      });
    }

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

    return (
      <div className="stats-container">
        <Select value={defaultValue} options={options} />
        <BarGraph data={data} max={graphMax} lineStep={lineStep} labelStep={labelStep} />
      </div>
    )
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