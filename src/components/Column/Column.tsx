import { Draggable, Droppable } from 'react-beautiful-dnd';
// @ts-ignore
import uniqid from 'uniqid';
import { Popover } from 'evergreen-ui';
import Task from '../Task/Task';
import styled from 'styled-components';
import { ITask, taskState } from '../../models/atoms';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import React, { useState } from 'react';
import { MoreIcon, Menu, Position, Button } from 'evergreen-ui';
import DeleteColumnDialog from './dialogs/DeleteColumn';
import EditColumnDialog from './dialogs/EditColumn';

interface IForm {
  task: string;
}

interface IColumn {
  columnId: string;
  name: string;
  description: string;
  color: string;
  order: number;
  tasks: ITask[];
}

const Wrapper = styled.div`
  // Wrapping Handle, Area
  display: flex;
  flex-direction: column;
  width: 318px;
  padding-left: 100px;
`;
const Handle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 57px;
  align-items: center;

  img {
    width: 14px;
    padding: 5px;
    display: block;
  }
`;
const Header = styled.div`
  // Head of Column
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Label = styled.div<{ columnColor: string }>`
  width: 122px;
  margin-left: 10px;
  font-size: 13px;
  text-align: center;
  line-height: 2;
  padding: 2px 4px;
  border-radius: 5px;
  background-color: ${(props) => props.columnColor ?? '#333333'};
`;
const TaskCount = styled.div`
  padding-left: 10px;
  color: ${(props) => props.theme.textBlurColor};
`;
const NewTaskForm = styled.form`
  width: 100%;
`;
const NewTaskInput = styled.input`
  width: 274px;
  padding: 10px 22px 10px 22px;
  //styling
  border-style: solid;
  border-radius: 5px;
  border-color: transparent;
  outline: none;
  background-color: inherit;
  //font
  font-size: 14px;
  line-height: 2;
  text-align: left;
  color: ${(props) => props.theme.textColor};

  &:hover,
  &:focus {
    outline: none;
    background-color: ${(props) => props.theme.newTaskColor};
  }

  &:focus::placeholder {
    color: transparent;
  }

  &::placeholder {
    color: ${(props) => props.theme.textBlurColor};
  }
`;
const Area = styled.div<{ isDraggingOver: boolean }>`
  display: flex;
  min-height: 400px;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  row-gap: 2px;
  background-color: ${(props) => (props.isDraggingOver ? props.theme.columnDraggingOverColor : 'none')};
`;

function Column({ columnId, name, description, color, tasks, order }: IColumn) {
  const [shownDialogs, setShownDialogs] = useState({
    deleteColumn: false,
    editColumn: false,
  });
  const setTasks = useSetRecoilState(taskState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ task }: IForm) => {
    const newTask = { id: uniqid(), name: task, description: '', createdDate: new Date(), status: 'Open' };
    setTasks((allTasks) => ({
      ...allTasks,
      [columnId]: { ...allTasks[columnId], tasks: [newTask, ...allTasks[columnId].tasks] },
    }));
    setValue('task', '');
  };

  const onDeleteColumn = () => {
    setShownDialogs({ ...shownDialogs, deleteColumn: false });
    setTasks((allTasks) => {
      let columns = Object.entries(allTasks);
      columns.splice(order, 1);
      return columns.reduce(
        (modifiedColumns, [columnId, tasks]) => ({
          ...modifiedColumns,
          [columnId]: tasks,
        }),
        {},
      );
    });
  };
  const onUpdateColumnName = (columnId: string, updatedName: string) => {
    setShownDialogs({ ...shownDialogs, editColumn: false });
    setTasks((allTasks) => {
      return {
        ...allTasks,
        [columnId]: {
          ...allTasks[columnId],
          name: updatedName,
        },
      };
    });
  };
  return (
    <Draggable draggableId={columnId} index={order}>
      {(provided) => (
        <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
          <DeleteColumnDialog isShown={shownDialogs.deleteColumn} onDelete={onDeleteColumn} />
          <EditColumnDialog
            onClose={() => setShownDialogs({ ...shownDialogs, editColumn: false })}
            columnId={columnId}
            name={name}
            isShown={shownDialogs.editColumn}
            onUpdate={onUpdateColumnName}
          />
          <Handle {...provided.dragHandleProps}>
            <Header>
              <Label columnColor={color}>{name}</Label>
              <TaskCount>{tasks.length}</TaskCount>
            </Header>
            <Popover
              position={Position.BOTTOM_LEFT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item onSelect={() => setShownDialogs({ ...shownDialogs, editColumn: true })}>
                      Edit column
                    </Menu.Item>
                  </Menu.Group>
                  <Menu.Divider />
                  <Menu.Group>
                    <Menu.Item
                      onSelect={() => setShownDialogs({ ...shownDialogs, deleteColumn: true })}
                      intent="danger"
                    >
                      Delete column
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <Button marginRight={16}>
                <MoreIcon />
              </Button>
            </Popover>
          </Handle>
          <Droppable droppableId={columnId}>
            {(provided, snapshot) => (
              <Area ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                {tasks.map((task, order) => (
                  <Task columnId={columnId} key={task.id} order={order} task={task} />
                ))}
                {provided.placeholder}
                <NewTaskForm onSubmit={handleSubmit(onValid)}>
                  <NewTaskInput autoComplete={'off'} {...register('task', { required: true })} placeholder={'+ New'} />
                </NewTaskForm>
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Column);
