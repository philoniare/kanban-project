import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { archivedTaskState, draggingAtomState, ITask, taskState } from '../../models/atoms';
import { Menu, Position, Popover, MoreIcon } from 'evergreen-ui';
import EditTask from './dialogs/EditTask';

interface IIndexedTask {
  task: ITask;
  order: number;
  columnId: string;
}

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 274px;
  padding: 10px 22px 10px 22px;
  background-color: ${(props) =>
    props.isDragging ? (props) => props.theme.taskDraggingColor : (props) => props.theme.taskColor};
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${(props) => props.theme.taskDraggingColor};
  }
`;
const Text = styled.span`
  word-break: break-all;
  font-size: 14px;
  line-height: 2;
  text-align: left;
`;

function Task({ task, order, columnId }: IIndexedTask) {
  const { id, name } = task;
  const [isDragging, setIsDragging] = useState(false);
  const [tasks, setTasks] = useRecoilState(taskState);
  const [_, setArchivedTasks] = useRecoilState(archivedTaskState);
  const [draggingState, setDraggingAtomState] = useRecoilState(draggingAtomState);
  const [shownDialogs, setShownDialogs] = useState({
    editTask: false,
  });

  useEffect(() => {
    // prevent unlimited re-rendering
    setDraggingAtomState(isDragging);
  }, [isDragging, draggingState]);

  const onCardDelete = (columnId: string, taskIndex: number) => {
    // Delete task
    setTasks((allTasks) => {
      let modifiedTasks = [...allTasks[columnId].tasks];
      modifiedTasks.splice(taskIndex, 1);
      return {
        ...allTasks,
        [columnId]: { ...allTasks[columnId], tasks: modifiedTasks },
      };
    });
  };

  const onCardArchive = (columnId: string, taskIndex: number) => {
    setArchivedTasks((allArchivedTasks) => {
      const updateArchivedTasks = [...allArchivedTasks.tasks, tasks[columnId].tasks[taskIndex]];
      return {
        tasks: updateArchivedTasks,
      };
    });
    onCardDelete(columnId, taskIndex);
  };

  const toggleEditTaskDialog = () => {
    setShownDialogs({
      ...shownDialogs,
      editTask: !shownDialogs.editTask,
    });
  };

  const onTaskEdit = (columnId: string, name: string, description: string, status: string) => {
    setTasks((allTasks) => {
      let currentColumn = allTasks[columnId];
      const columnTasks = Object.assign(allTasks[columnId].tasks, {});
      let updatedTask: ITask = columnTasks.find((task) => task.id === id)!;
      const newTask = {
        ...updatedTask,
        name,
        description,
        status,
      };
      const updateIndex = columnTasks.findIndex((task) => task.id === id);
      let reOrderedTasks = [...currentColumn.tasks];
      reOrderedTasks.splice(updateIndex, 1, newTask);
      return {
        ...allTasks,
        [columnId]: { ...currentColumn, tasks: reOrderedTasks },
      };
    });
  };

  return (
    <Draggable draggableId={id + ''} index={order}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => {
        setIsDragging(isDragging);
        return (
          <Wrapper isDragging={isDragging} ref={innerRef} {...draggableProps} {...dragHandleProps}>
            <EditTask
              columnId={columnId}
              task={task}
              onClose={toggleEditTaskDialog}
              isShown={shownDialogs.editTask}
              onUpdate={onTaskEdit}
            />
            <Text>{name}</Text>
            <Popover
              position={Position.BOTTOM_LEFT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item onSelect={toggleEditTaskDialog}>Edit card</Menu.Item>
                  </Menu.Group>
                  <Menu.Divider />
                  <Menu.Group>
                    <Menu.Item onSelect={() => onCardArchive(columnId, order)}>Archive</Menu.Item>
                    <Menu.Item onSelect={() => onCardDelete(columnId, order)} intent="danger">
                      Delete
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <MoreIcon />
            </Popover>
          </Wrapper>
        );
      }}
    </Draggable>
  );
}

export default React.memo(Task);
