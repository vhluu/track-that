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
    this.resetScroll(); // scrolls to the rightmost bar
  }

  componentDidUpdate() {
    this.resetScroll(); // scrolls to the rightmost bar
  }

  /* Sets the scroll position to initially display the rightmost item in the graph, if there is overflow */
  resetScroll() {
    const barsRef = this.barsRef.current;
    const { scrollWidth } = barsRef;

    if (scrollWidth > this.barsWidth) { // check if the graph bars are overflowing its container
      barsRef.scrollLeft = scrollWidth;
      barsRef.parentElement.classList.add('overflow');
    } else {
      barsRef.parentElement.classList.remove('overflow');
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
                <div className="x-axis-lines">
                  { (index % labelStep === 0) && <div className="x-axis-label">{ value }</div> }
                </div>
              );
            }) }
          </div>
          <div className="bars" ref={this.barsRef}>
            { data.map((point) => {
              return (
                <div className="bar-wrapper">
                  <div className="bar" style={{ 'min-height': `calc((${point.value}/${max}) * 100%)` }}>
                    <div className="bar-value">{ point.value }</div>
                  </div>
                  <div className="label">{ point.label }</div>
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
