import React, { Component } from 'react';
import './BarGraph.scss';

class BarGraph extends Component {
  static range(maxVal, step) {
    return Array.from({ length: (maxVal / step) + 1 }, (x, i) => (maxVal - (i * step)));
  }

  constructor(props) {
    super(props);
    this.barsRef = React.createRef();
  }

  componentDidMount() {
    // get the width of the bars div
    this.barsWidth = this.barsRef.current.getBoundingClientRect().width;
  }

  componentDidUpdate() {
    const barsRef = this.barsRef.current;
    const lastBar = barsRef.querySelector(':scope > div:last-child');
    
    if (lastBar) {
      lastBar.scrollIntoView(); // scroll last bar into view

      if (barsRef.scrollWidth > this.barsWidth) { // check if the graph bars are overflowing its container
        barsRef.parentElement.classList.add('overflow');
      } else {
        barsRef.parentElement.classList.remove('overflow');
      }
    }
  }

  render() {
    const { data, max, lineStep, labelStep } = this.props;
    const lineValues = BarGraph.range(max, lineStep);

    return (
      <div className="bar-graph">
        <div className="graph-inner">
          <div className="x-axis">
            { lineValues.map((value, index) => {
              return (
                <div className="x-axis-lines" key={index}>
                  { (index % labelStep === 0) && <span className="x-axis-label">{ value }</span> }
                </div>
              );
            }) }
          </div>
          <div className="bars" ref={this.barsRef}>
            { data.map((point, index) => {
              return (
                <div className="bar-wrapper" key={index}>
                  <div className="bar" style={{ 'minHeight': `calc((${point.value}/${max}) * 100%)` }}>
                    <span className="bar-value">{ point.value !== 0 ? point.value : '' }</span>
                  </div>
                  <span className="label">{ point.label }</span>
                </div>
              );
            }) }
          </div>
        </div>
      </div>
    );
  }
}

export default BarGraph;
