import { updateItemStats, todoListOnScreen, session } from "../index";

export interface TodoListItem {
  id: number;
  isCompleted: boolean;
  content: string;
}

/**
 * Contains model, view, controller for interaction with Todo list
 */
export default class TodoList {
  private _maxId: number;
  private _items: TodoListItem[];
  private _whereToRender: Element | null;
  private _whatToShow: "all" | "active" | "completed";

  public constructor(newTodoListItems: TodoListItem[], todoListParent: Element | null) {
    this._maxId = newTodoListItems ? newTodoListItems.length + 1 : 1;
    this._items = newTodoListItems ? newTodoListItems : [];
    this._whereToRender = todoListParent;
    this._whatToShow = "all";
  }

  /**
   * Returns the current tab
   */
  public get whatToShow() {
    return this._whatToShow;
  }

  /**
   * Sets the tab (all, active, completed)
   */
  public set whatToShow(value) {
    this._whatToShow = value;
    this.renderList();
  }

  /**
   * Removes item with specified `id`
   */
  public removeItem(itemId: number): void {
    this._items.splice(this.getItemArrayIndexById(itemId), 1);
    if (this._items.length === 0) this._maxId = 1;
    this.renderList();
  }

  /**
   * Removes completed items from the list
   */
  public removeCompleted(): void {
    this._items = this._items.filter((item) => item.isCompleted === false);
    this.renderList();
  }

  /**
   * Adds a new item in the end of the list
   * @param isCompleted - Specifies whether the item is completed or not
   * @param content - Text content of the Todo list item
   */
  public addItem(isCompleted: boolean, content: string): void {
    const newElementId = this._maxId++;
    this._items.push({
      id: newElementId,
      isCompleted,
      content,
    });
    this.renderList();
  }

  /**
   * Returns a found list item. Throws exception when unable to find it
   */
  public getItemById(itemId: number) {
    for (let item of this._items) {
      if (item.id === itemId) return item;
    }
    throw "getItemById: Id not found";
  }

  /**
   * Returns a list item index in the items array by its `id`
   * @param id - Item id
   * @returns Index of the found item. Throws exception when unable to find it
   */
  public getItemArrayIndexById(itemId: number): number {
    for (let item of this._items) {
      if (item.id === itemId) return this._items.indexOf(item);
    }
    throw "getItemIndexById: Id not found";
  }

  /**
   * Moves an item from its current position to the position before the specified item
   * @param itemIdFrom - Item that has to be moved
   * @param itemIdTo - Item before which (or after which in case of the last item) to move the first item
   */
  public moveItem(itemIdFrom: number, itemIdTo: number): void {
    const itemFromIndex: number = this.getItemArrayIndexById(itemIdFrom);
    const itemToIndex: number = this.getItemArrayIndexById(itemIdTo);

    let movedElement: TodoListItem = this._items[itemFromIndex];
    this._items.splice(itemFromIndex, 1);
    this._items.splice(itemToIndex, 0, movedElement);

    this.renderList();
  }

  /**
   * Checks or uncheks a checkbox for the corresponding item
   */
  public toggleItem(itemID: number): void {
    const itemById = this.getItemById(+itemID);
    itemById.isCompleted = !itemById.isCompleted;
    this.renderList();
  }

  /**
   * Returns number of items for the tab "All" (checked + unchecked)
   */
  public getAllItemsNumber(): number {
    return this._items.length;
  }

  /**
   * Returns items for the tab "Active" (unchecked)
   */
  public getActiveItems(): TodoListItem[] {
    return this._items.filter((item) => item.isCompleted === false);
  }

  /**
   * Returns number of items for the tab "Active"
   */
  public getActiveItemsNumber(): number {
    return this._items.reduce((total, item) => {
      return total + (item.isCompleted === false ? 1 : 0);
    }, 0);
  }

  /**
   * Returns items for the tab "Completed"
   */
  public getCompletedItems(): TodoListItem[] {
    return this._items.filter((item) => item.isCompleted === true);
  }

  /**
   * Returns number of items for the tab "Completed"
   */
  public getCompletedItemsNumber(): number {
    return this._items.reduce((total, item) => {
      return total + (item.isCompleted === true ? 1 : 0);
    }, 0);
  }

  /**
   * Redraws on the screen items of the list
   */
  public renderList(): void {
    updateItemStats();
    session.todoListItems = this._items;

    // Removes all items from screen
    while (document.querySelector(".item") !== null) {
      todoListOnScreen?.removeChild(document.querySelector(".item") as Element);
    }

    // Depending on the chosen tab show different items
    let itemsToRender: TodoListItem[];
    switch (this._whatToShow) {
      case "all":
      default:
        itemsToRender = this._items;
        break;
      case "active":
        itemsToRender = this.getActiveItems();
        break;
      case "completed":
        itemsToRender = this.getCompletedItems();
        break;
    }

    // Checked items go in the end of the list
    itemsToRender.sort((a, b) => +a.isCompleted - +b.isCompleted);

    // If there are no items to display, shows text block
    // If there are some items, hides that text block
    const listEmpty: Element | null = document.querySelector(".list__empty");
    if (itemsToRender.length === 0) {
      listEmpty?.classList.remove("list--display-none");
    } else listEmpty?.classList.add("list--display-none");

    // Generate items from items array, append them to document fragment
    // Then append that document fragment to the DOM node
    const listItemsToAppend: DocumentFragment = document.createDocumentFragment();
    for (let listItem of itemsToRender) {
      let newChild: HTMLElement = document.createElement("article");
      newChild.classList.add("item");
      newChild.draggable = true;
      newChild.innerHTML = `
          <input type="checkbox" name="test" id="${listItem.id}" class="item__checkbox" $
        } ${listItem.isCompleted === true ? "checked" : ""}/>
          <label for="${listItem.id}" class="item__description"
            >${listItem.content}</label>
          <button class="item__del"></button>
        `;
      listItemsToAppend.appendChild(newChild);
    }
    todoListOnScreen?.appendChild(listItemsToAppend);
  }
}
