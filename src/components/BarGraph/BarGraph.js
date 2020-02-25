import React from 'react';
import './BarGraph.scss';

function BarGraph(props) {
  const { data, max, lineStep, labelStep } = props;

  // Returns an array with values starting from max to 0 (inclusive), with the given step
  const range = (maxVal, step) => Array.from({ length: (maxVal / step) + 1 }, (x, i) => (maxVal - (i * step)));

  const lineValues = range(max, lineStep);

  console.log(lineValues);

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
        <div className="bars">
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

export default BarGraph;
