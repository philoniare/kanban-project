import { Dialog, TextInput, Pane, Paragraph, Button } from 'evergreen-ui';
import React, { useState } from 'react';

interface ICreateColumnDialog {
  isShown: boolean;
  onCreate: (name: string, description: string) => void;
  onClose: () => void;
}

const CreateColumn = ({ isShown, onCreate, onClose }: ICreateColumnDialog) => {
  const [columnName, setColumnName] = useState('');
  const [columnDescription, setColumnDescription] = useState('');

  const handleCreate = (close: any) => {
    close();
    onCreate(columnName, columnDescription);
  };

  return (
    <Dialog
      isShown={isShown}
      title="Add a column"
      intent="success"
      onCloseComplete={onClose}
      confirmLabel="Update column"
      hasFooter={false}
    >
      {({ close }) => (
        <Pane>
          <Paragraph>Column name</Paragraph>
          <Paragraph>
            <TextInput
              name="text-input-name"
              onChange={(e: any) => setColumnName(e.target.value)}
              placeholder="Enter a column name (To Do, In Progress, Done)"
            />
          </Paragraph>
          <Paragraph>Column description</Paragraph>
          <Paragraph>
            <TextInput
              name="text-input-name"
              onChange={(e: any) => setColumnDescription(e.target.value)}
              placeholder="Enter a column description"
            />
          </Paragraph>
          <Button appearance={'primary'} intent={'success'} marginTop={16} onClick={() => handleCreate(close)}>
            Create column
          </Button>
        </Pane>
      )}
    </Dialog>
  );
};

export default React.memo(CreateColumn);
