import { TodoListItem } from './TodoList';

/**
 * Stores information that has to be saved after page reload
 */
export default class Session {
  private _isDarkMode: boolean;
  private _todoListItems: TodoListItem[];

  public constructor() {
    let maxId: number = 1;

    const isDarkModeFromStorage: boolean = JSON.parse(
      localStorage.getItem('isDarkMode') ?? 'false'
    );
    if (isDarkModeFromStorage) this._isDarkMode = isDarkModeFromStorage;
    else {
      this._isDarkMode =
        window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;
    }

    this._todoListItems = JSON.parse(
      localStorage.getItem('todoListItems') ?? 'null'
    ) ?? [
      {
        id: maxId++,
        isCompleted: false,
        content: 'Book flight to Israel',
      },
      {
        id: maxId++,
        isCompleted: false,
        content: 'Get a haircut',
      },
      {
        id: maxId++,
        isCompleted: false,
        content: 'Review Hibernate in Action second edition',
      },
      {
        id: maxId++,
        isCompleted: false,
        content: 'Blog about workspace management',
      },
      {
        id: maxId++,
        isCompleted: false,
        content: 'Send copy to editor for review',
      },
    ];
  }

  public get isDarkMode(): boolean {
    return this._isDarkMode;
  }

  public get todoListItems(): TodoListItem[] {
    return this._todoListItems;
  }

  public set todoListItems(newTodoListItems: TodoListItem[]) {
    this._todoListItems = newTodoListItems;
    localStorage.setItem('todoListItems', JSON.stringify(this._todoListItems));
  }

  public toggleDarkMode(): void {
    this._isDarkMode = !this._isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this._isDarkMode));
  }
}
