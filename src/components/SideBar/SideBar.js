import React from 'react';

function SideBar(props) {
  return (
    <div className="side-bar">
      { props.children }
    </div>
  );
}

export default SideBar;
