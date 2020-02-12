import React from 'react';
import './BarGraph.scss';

function BarGraph(props) {
  // const { data } = props;
  // { [ { value: 8, label: Jan } ]}
  let data = [{ label: 'Jan', value: 10 }, { label: 'Jan', value: 10 }];
  const barStyle = {
    height: 'calc((10/31) * 100%)',
  };
  return (
    <div className="bar-graph">
      <div className="graph-inner">
        <div className="x-axis">
          <div className="x-axis-lines">
            <div className="x-axis-label">30</div>
          </div>
          <div className="x-axis-lines" />
          <div className="x-axis-lines">
            <div className="x-axis-label">20</div>
          </div>
          <div className="x-axis-lines" />
          <div className="x-axis-lines">
            <div className="x-axis-label">10</div>
          </div>
          <div className="x-axis-lines" />
          <div className="x-axis-lines" />
        </div>
        <div className="bar-wrapper">
          <div className="bar" style={barStyle} />
          <div className="label">Jan</div>
        </div>
        <div className="bar-wrapper">
          <div className="bar" style={barStyle} />
          <div className="label">Feb</div>
        </div>
        <div className="bar-wrapper">
          <div className="bar" style={barStyle} />
          <div className="label">Mar</div>
        </div>
        <div className="bar-wrapper">
          <div className="bar" style={barStyle} />
          <div className="label">Apr</div>
        </div>
        <div className="bar-wrapper">
          <div className="bar" style={barStyle} />
          <div className="label">May</div>
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
