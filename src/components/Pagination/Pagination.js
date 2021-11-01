import React from 'react';

import Button from '../Button/Button';
import './Pagination.scss';

function Pagination(props) {
  const { prevClick, nextClick, children } = props;

  const arrow = (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M.244 9.756a.833.833 0 0 1 0-1.179L3.821 5 .244 1.423A.833.833 0 0 1 1.423.244l4.166 4.167a.833.833 0 0 1 0 1.178L1.423 9.756a.833.833 0 0 1-1.179 0Z" fill="#fff" />
    </svg>
  );

  return (
    <div className="pagination">
      <Button type="pagination-arrow" clicked={prevClick} ariaLabel="Previous Month">{ arrow }</Button>
      {children}
      <Button type="pagination-arrow" clicked={nextClick} ariaLabel="Next Month">{ arrow }</Button>
    </div>
  );
}

export default Pagination;
