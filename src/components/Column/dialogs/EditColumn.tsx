import { Dialog, TextInputField, Pane, Button } from 'evergreen-ui';
import React, { useState } from 'react';

interface IEditColumnDialog {
  columnId: string;
  name: string;
  isShown: boolean;
  onUpdate: (columnId: string, columnName: string) => void;
  onClose: () => void;
}

const EditColumn = ({ name, columnId, isShown, onUpdate, onClose }: IEditColumnDialog) => {
  const [columnName, setColumnName] = useState(name);

  const handleClose = (close: any) => {
    close();
    onUpdate(columnId, columnName);
  };

  return (
    <Dialog
      onCloseComplete={onClose}
      isShown={isShown}
      title="Edit In progress"
      intent="success"
      confirmLabel="Update column"
      hasFooter={false}
    >
      {({ close }) => (
        <Pane>
          <TextInputField
            label="Column name"
            autoFocus
            value={columnName}
            name="text-input-name"
            onChange={(e: any) => setColumnName(e.target.value)}
            placeholder="Column name"
          />
          <Button appearance={'primary'} intent={'success'} marginTop={16} onClick={() => handleClose(close)}>
            Update column
          </Button>
        </Pane>
      )}
    </Dialog>
  );
};

export default React.memo(EditColumn);
