import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    textBlurColor: string;
    bgColor: string;
    taskColor: string;
    taskDraggingColor: string;
    newTaskColor: string;
    trashCanColor: string;
    columnDraggingOverColor: string;
  }
}
