import { Dialog, TextInputField, Pane, Button, SelectField } from 'evergreen-ui';
import React, { useState } from 'react';
import { ITask } from '../../../models/atoms';

interface IEditColumnDialog {
  columnId: string;
  task: ITask;
  isShown: boolean;
  onUpdate: (columnId: string, name: string, description: string, status: string) => void;
  onClose: () => void;
}

const EditTask = ({ columnId, task, isShown, onUpdate, onClose }: IEditColumnDialog) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const handleUpdate = (close: any) => {
    close();
    onUpdate(columnId, name, description, status);
  };

  return (
    <Dialog
      isShown={isShown}
      title="Edit Task"
      intent="success"
      confirmLabel="Update column"
      onCloseComplete={onClose}
      hasFooter={false}
    >
      {({ close }) => (
        <Pane>
          <TextInputField
            autoFocus
            label="Task name"
            value={name}
            name="text-input-name"
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Task name"
          />
          <TextInputField
            label="Task description"
            value={description}
            name="text-input-name"
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Task description"
          />
          <SelectField label="Task status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </SelectField>
          <Button appearance={'primary'} intent={'success'} marginTop={16} onClick={() => handleUpdate(close)}>
            Update task
          </Button>
        </Pane>
      )}
    </Dialog>
  );
};

export default React.memo(EditTask);
