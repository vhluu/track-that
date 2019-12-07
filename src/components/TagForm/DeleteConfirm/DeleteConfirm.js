import React from 'react';
import Button from '../../Button/Button';

function DeleteConfirm(props) {
  const { cancel, myDelete } = props;
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-title">Are you sure?</p>
      <p className="delete-confirm-desc">Deleting your tag will remove it from the calendar.</p>
      <Button btnType="btn-cancel" clicked={cancel}>Cancel</Button>
      <Button btnType="btn-delete" clicked={myDelete}>Delete</Button>
    </div>
  );
}

export default DeleteConfirm;
