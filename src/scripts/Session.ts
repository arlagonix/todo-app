import { TodoListItem } from "./TodoList";

/**
 * Stores information that has to be saved after page reload
 */
export default class Session {
  private _isDarkMode: boolean;
  private _todoListItems: TodoListItem[];

  public constructor() {
    let maxId: number = 1;

    // If the theme is saved in local storage take it from there
    const isDarkModeFromStorage = JSON.parse(localStorage.getItem("isDarkMode") ?? "null");
    if (isDarkModeFromStorage) this._isDarkMode = isDarkModeFromStorage;
    // Otherwise use theme from user's system settings
    else
      this._isDarkMode =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // If there are any items save in local storage, take them from local storage
    // Otherwise use default list of items
    this._todoListItems = JSON.parse(localStorage.getItem("todoListItems") ?? "null") ?? [
      {
        id: maxId++,
        isCompleted: false,
        content: "Book flight to Israel",
      },
      {
        id: maxId++,
        isCompleted: false,
        content: "Get a haircut",
      },
      {
        id: maxId++,
        isCompleted: false,
        content: "Review Hibernate in Action second edition",
      },
      {
        id: maxId++,
        isCompleted: false,
        content: "Blog about workspace management",
      },
      {
        id: maxId++,
        isCompleted: false,
        content: "Send copy to editor for review",
      },
    ];
  }

  get isDarkMode() {
    return this._isDarkMode;
  }

  get todoListItems() {
    return this._todoListItems;
  }

  public toggleDarkMode() {
    this._isDarkMode = !this._isDarkMode;
    localStorage.setItem("isDarkMode", JSON.stringify(this._isDarkMode));
  }

  public set todoListItems(newTodoListItems: TodoListItem[]) {
    this._todoListItems = newTodoListItems;
    localStorage.setItem("todoListItems", JSON.stringify(this._todoListItems));
  }
}
