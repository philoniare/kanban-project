import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { archivedTaskState, taskState } from '../models/atoms';
import { saveArchivedTasks, saveTasks } from '../models/localStorage';
import Column from '../components/Column/Column';
import AddColumn from '../components/AddColumn/AddColumn';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Columns = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: baseline;
`;
const MainPane = styled.div`
  display: flex;
`;

const Home = () => {
  const [tasks, setTasks] = useRecoilState(taskState);
  const [archivedTasks, _] = useRecoilState(archivedTaskState);
  const columnWidthRef = useRef<HTMLDivElement>(null);

  const onDragEnd = (dropResult: DropResult) => {
    const { source, destination, type } = dropResult;
    if (!destination) return;
    if (type === 'columns') {
      if (source.droppableId === destination?.droppableId) {
        // Move columns
        setTasks((allTasks) => {
          let columns = Object.entries(allTasks);
          const [sourceColumn] = columns.splice(source.index, 1);
          columns.splice(destination.index, 0, sourceColumn);
          return columns.reduce(
            (modifiedColumns, [columnId, tasks]) => ({
              ...modifiedColumns,
              [columnId]: tasks,
            }),
            {},
          );
        });
      }
    } else {
      // Move Tasks
      if (source.droppableId === destination?.droppableId) {
        // Move a task in same column.
        setTasks((allTasks) => {
          let currentColumn = allTasks[destination.droppableId];
          let reOrderedTasks = [...currentColumn.tasks];
          const sourceTask = reOrderedTasks[source.index];
          reOrderedTasks.splice(source.index, 1);
          reOrderedTasks.splice(destination?.index, 0, sourceTask);
          return {
            ...allTasks,
            [destination?.droppableId]: { ...currentColumn, tasks: reOrderedTasks },
          };
        });
      } else if (source?.droppableId !== destination?.droppableId) {
        // Move task to different column
        setTasks((allTasks) => {
          let sourceColumn = allTasks[source.droppableId];
          let destinationColumn = allTasks[destination?.droppableId];
          let modifiedSourceTasks = [...sourceColumn.tasks];
          let modifiedDestinationTasks = [...destinationColumn.tasks];
          const sourceTask = modifiedSourceTasks[source.index];
          modifiedSourceTasks.splice(source.index, 1);
          modifiedDestinationTasks.splice(destination?.index, 0, sourceTask);
          return {
            ...allTasks,
            [source.droppableId]: { ...sourceColumn, tasks: modifiedSourceTasks },
            [destination?.droppableId]: { ...destinationColumn, tasks: modifiedDestinationTasks },
          };
        });
      } else {
        return;
      }
    }
  };

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveArchivedTasks(archivedTasks);
  }, [archivedTasks]);

  return (
    <MainPane>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'columns'} type={'columns'} direction={'horizontal'}>
          {({ innerRef, droppableProps, placeholder }) => (
            <Wrapper ref={innerRef} {...droppableProps}>
              <Columns ref={columnWidthRef}>
                {Object.keys(tasks).map((columnId, index) => (
                  <Column
                    order={index}
                    key={columnId}
                    columnId={columnId}
                    description={tasks[columnId].description}
                    color={tasks[columnId].color}
                    name={tasks[columnId].name}
                    tasks={tasks[columnId].tasks}
                  />
                ))}
              </Columns>
              {placeholder}
            </Wrapper>
          )}
        </Droppable>
      </DragDropContext>
      <AddColumn index={Object.keys(tasks).length} />
    </MainPane>
  );
};

export default Home;
