import React from 'react';

import Button from '../Button/Button';
import './Pagination.scss';

function Pagination(props) {
  const { prevClick, nextClick, children } = props;
  return (
    <div className="pagination">
      <Button type="pagination-arrow" clicked={prevClick} ariaLabel="Previous Month">&lt;</Button>
      {children}
      <Button type="pagination-arrow" clicked={nextClick} ariaLabel="Next Month">&gt;</Button>
    </div>
  );
}

export default Pagination;
