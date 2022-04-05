import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { columnColorList, taskState } from '../../models/atoms';
// @ts-ignore
import uniqid from 'uniqid';
import { loadColorCount, saveColorCount } from '../../models/localStorage';
import { PlusIcon, Button } from 'evergreen-ui';
import CreateColumn from './dialogs/CreateColumn';

interface INewColumnForm {
  columnId: string;
}

const Wrapper = styled.div`
  width: 400px;
  margin-left: 100px;
`;

const AddButtonContainer = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  min-width: 318px;
`;

function AddColumn({ index }: { index: number }) {
  const setTasks = useSetRecoilState(taskState);
  const colors = useRecoilValue(columnColorList);
  const [shownDialogs, setShownDialogs] = useState({
    createColumn: false,
  });
  const [colorCount, setColorCount] = useState(loadColorCount);
  const nextColor = colors[colorCount % colors.length];
  const { setValue } = useForm<INewColumnForm>();

  const onColumnAdd = (name: string, description: string) => {
    const columnId = uniqid();
    setTasks((allTasks) => ({
      ...allTasks,
      [columnId]: { name, description, color: nextColor, tasks: [] },
    }));
    setColorCount(colorCount + 1);
    //Save Count in localStorage
    saveColorCount({ count: colorCount });
    setValue('columnId', '');
  };

  return (
    <Wrapper>
      <CreateColumn
        onClose={() => setShownDialogs({ ...shownDialogs, createColumn: false })}
        isShown={shownDialogs.createColumn}
        onCreate={onColumnAdd}
      />
      <AddButtonContainer onClick={() => setShownDialogs({ ...shownDialogs, createColumn: true })}>
        <Button>
          <PlusIcon /> Add Column
        </Button>
      </AddButtonContainer>
    </Wrapper>
  );
}

export default React.memo(AddColumn);
