import { Dialog, TextInputField, Pane, Button } from 'evergreen-ui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

interface ICreateColumnDialog {
  isShown: boolean;
  onCreate: (name: string, description: string) => void;
  onClose: () => void;
}

interface INewColumnForm {
  name: string;
  description: string;
}

const ErrorMessage = styled.div`
  font-size: 12px;
  padding-top: 10px;
  padding-left: 10px;
  text-align: left;
  color: red;
`;

const CreateColumn = ({ isShown, onCreate, onClose }: ICreateColumnDialog) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<INewColumnForm>();

  const onValid = ({ name, description }: INewColumnForm) => {
    onCreate(name, description);
    setValue('name', '');
    setValue('description', '');
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
          <TextInputField
            autoFocus
            required
            isInvalid={!!errors.name}
            validationMessage={<ErrorMessage>{errors.name?.message || ''}</ErrorMessage>}
            label="Column name"
            placeholder="Enter a column name (To Do, In Progress, Done)"
            {...register('name', {
              required: {
                value: true,
                message: 'Please enter a column name',
              },
              maxLength: {
                value: 12,
                message: 'Column name must be less than 12 characters',
              },
            })}
          />
          <TextInputField
            required
            label="Column description"
            isInvalid={!!errors.description}
            validationMessage={<ErrorMessage>{errors.description?.message || ''}</ErrorMessage>}
            placeholder="Enter a column description"
            {...register('description', {
              required: { value: true, message: 'Please enter a column description' },
            })}
          />
          <Button
            appearance={'primary'}
            intent={'success'}
            marginTop={16}
            onClick={() => {
              handleSubmit(onValid)();
              if (!Object.keys(errors).length) close();
            }}
          >
            Create column
          </Button>
        </Pane>
      )}
    </Dialog>
  );
};

export default React.memo(CreateColumn);
