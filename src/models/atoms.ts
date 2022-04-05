import { atom } from 'recoil';
import { loadArchivedTasks, loadTasks } from './localStorage';

export interface ITask {
  id: string;
  name: string;
  description: string;
  status: string;
  createdDate: Date;
}

export interface ITaskState {
  [key: string]: {
    name: string;
    description: string;
    color: string;
    tasks: ITask[];
  };
}

export interface IArchivedTaskState {
  tasks: ITask[];
}

export const draggingAtomState = atom({
  key: 'draggingAtomState',
  default: false,
});

export const columnColorList = atom({
  key: 'columnColorList',
  default: ['#2ecc71', '#e67e22', '#e74c3c', '#2c3e50', '#8e44ad', '#16a085', '#f39c12'],
});

export const taskState = atom<ITaskState>({
  key: 'taskState',
  default: loadTasks() ?? {
    '1234512345123': { tasks: [], name: 'Completed', color: '#2ecc71', description: 'Completed cards', status: 'Open' },
    '1234512345124': {
      tasks: [],
      name: 'In progress',
      color: '#e67e22',
      description: 'In progress cards',
      status: 'Open',
    },
    '1234512345125': {
      tasks: [],
      name: 'Not started',
      color: '#e74c3c',
      description: 'Cards that have not been started',
      status: 'Open',
    },
  },
});

export const archivedTaskState = atom<IArchivedTaskState>({
  key: 'archivedTaskState',
  default: loadArchivedTasks() ?? { tasks: [] },
});
