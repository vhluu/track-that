import React from 'react';

function Pagination(props) {
  const { prevClick, nextClick, children } = props;
  return (
    <div className="pagination">
      <div className="pagination-arrow" onClick={prevClick}>&lt;</div>
      {children}
      <div className="pagination-arrow" onClick={nextClick}>&gt;</div>
    </div>
  );
}

export default Pagination;
