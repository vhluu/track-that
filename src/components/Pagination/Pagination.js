import React from 'react';
import Button from '../../components/Button/Button';
import './Pagination.scss';

function Pagination(props) {
  const { prevClick, nextClick, children } = props;
  return (
    <div className="pagination">
      <Button btnType="pagination-arrow" clicked={prevClick} ariaLabel="Previous Month">&lt;</Button>
      {children}
      <Button btnType="pagination-arrow" clicked={nextClick} ariaLabel="Next Month">&gt;</Button>
    </div>
  );
}

export default Pagination;
