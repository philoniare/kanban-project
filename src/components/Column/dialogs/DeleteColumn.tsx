import { Dialog } from 'evergreen-ui';
import React from 'react';

interface IDeleteColumnDialog {
  isShown: boolean;
  onDelete: () => void;
}

const DeleteColumn = ({ isShown, onDelete }: IDeleteColumnDialog) => {
  return (
    <Dialog
      isShown={isShown}
      title="Delete in progress"
      intent="danger"
      onConfirm={() => onDelete()}
      confirmLabel="Delete"
    >
      This action will remove any cards associated with the column.
    </Dialog>
  );
};

export default React.memo(DeleteColumn);
