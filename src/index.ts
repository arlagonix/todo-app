import TodoList from "./scripts/TodoList";
import RememberedItem from "./scripts/RememberedItem";
import Session from "./scripts/Session";
import "./index.scss";

const page: Element | null = document.querySelector(".page");
const themeSwitcher: Element | null = document.querySelector(".theme-switcher");
const input: HTMLInputElement | null = document.querySelector(".input__field");
const submit: HTMLInputElement | null = document.querySelector(".input__submit");
export const todoListOnScreen: Element | null = document.querySelector(".list");

const tabAll: Element | null = document.querySelector(".list__tab--type_all");
const tabActive: Element | null = document.querySelector(".list__tab--type_active");
const tabCompleted: Element | null = document.querySelector(".list__tab--type_completed");

const listHeader: Element | null = document.querySelector(".list__header");

const listAll: Element | null = document.querySelector(".list__all");
const listActive: Element | null = document.querySelector(".list__active");
const listCompleted: Element | null = document.querySelector(".list__completed");

// localStorage.clear();

export const session = new Session();
if (session.isDarkMode) {
  page!.classList.toggle("dark-theme");
}
const todoList: TodoList = new TodoList(session.todoListItems, document.querySelector(".list"));
todoList.renderList();

// Updates numbers of items in tabs on screen
export function updateItemStats(): void {
  listAll!.innerHTML = todoList.getAllItemsNumber().toString();
  listActive!.innerHTML = todoList.getActiveItemsNumber().toString();
  listCompleted!.innerHTML = todoList.getCompletedItemsNumber().toString();
}

// Change theme on click
themeSwitcher!.addEventListener("click", (): void => {
  page!.classList.toggle("dark-theme");
  session.toggleDarkMode();
});

// Enable / disable submit button depending on the contents of input
input!.addEventListener("input", (): void => {
  if (input!.value.length > 0) {
    submit!.disabled = false;
    return;
  }
  submit!.disabled = true;
});

// Add an item in the list with the submit button
submit!.addEventListener("click", (e: Event): void => {
  e.preventDefault();
  if (input!.value.length > 0) {
    todoList.addItem(false, input!.value);
    input!.value = "";
    submit!.disabled = true;
  } else (e.target as HTMLInputElement).disabled = true;
});

// Update isCompleted of the corresponding element, update stats on click
todoListOnScreen!.addEventListener("change", (e: Event): void => {
  const eventTarget: Element | null = e.target as Element;
  todoList.toggleItem(+eventTarget!.id);
  if (todoList.whatToShow !== "all") todoList.renderList();
  else updateItemStats();
});

// Delete an item
todoListOnScreen!.addEventListener("click", (e: Event): void => {
  const eventTarget: Element | null = e.target as Element;
  const itemElement: Element | null = e.composedPath()[1] as Element;
  if (Array.from(eventTarget!.classList).includes("item__del")) {
    todoList.removeItem(+itemElement.children[0].id);
  }
});

// Switch between tabs
listHeader!.addEventListener("click", (e: Event): void => {
  const eventTarget: Element | null = e.target as Element;
  if (Array.from(eventTarget.classList).includes("list__clear")) {
    todoList.removeCompleted();
    return;
  }
  if (Array.from(eventTarget.classList).includes("list__tab--type_all")) {
    todoList.whatToShow = "all";
    tabAll!.classList.add("list__tab--active");
    tabActive!.classList.remove("list__tab--active");
    tabCompleted!.classList.remove("list__tab--active");
  }
  if (Array.from(eventTarget.classList).includes("list__tab--type_active")) {
    todoList.whatToShow = "active";
    tabAll!.classList.remove("list__tab--active");
    tabActive!.classList.add("list__tab--active");
    tabCompleted!.classList.remove("list__tab--active");
  }
  if (Array.from(eventTarget.classList).includes("list__tab--type_completed")) {
    todoList.whatToShow = "completed";
    tabActive!.classList.remove("list__tab--active");
    tabAll!.classList.remove("list__tab--active");
    tabCompleted!.classList.add("list__tab--active");
  }
});

const dragStartItem: RememberedItem = new RememberedItem();
todoListOnScreen!.addEventListener("dragstart", (e: Event): void => {
  const eventDataTransfer: DataTransfer | null = (e as DragEvent).dataTransfer;
  const eventTarget: Element | null = e.target as Element;
  eventDataTransfer!.setData("text/plain", eventTarget.children[0].id);
  eventDataTransfer!.effectAllowed = "move";
  dragStartItem.item = e.target;
  eventTarget.classList.add("item--translucent");
});

const rememberedItem: RememberedItem = new RememberedItem();
todoListOnScreen!.addEventListener("dragover", (e: Event): void => {
  e.preventDefault();
  let dragoveredListItem: Element | undefined;
  const eventDataTransfer: DataTransfer | null = (e as DragEvent).dataTransfer;

  for (let element of e.composedPath() as Element[]) {
    if (Array.from(element.classList ?? []).includes("item")) {
      dragoveredListItem = element;
      break;
    }
  }

  if (dragoveredListItem) {
    eventDataTransfer!.dropEffect = "move";
    if (rememberedItem.item) rememberedItem.item.classList.remove("item--highlighted");
    rememberedItem.item = dragoveredListItem;
    dragoveredListItem.classList.add("item--highlighted");
    return;
  }
});

todoListOnScreen!.addEventListener("dragend", (): void => {
  dragStartItem.item.classList.remove("item--translucent");
  if (rememberedItem.item) rememberedItem.item.classList.remove("item--highlighted");
});

todoListOnScreen!.addEventListener("drop", (e: Event): void => {
  e.preventDefault();
  const eventDataTransfer: DataTransfer | null = (e as DragEvent).dataTransfer;
  const itemIdFrom: number = +eventDataTransfer!.getData("text/plain");
  const itemIdTo: number = +rememberedItem.item.children[0].id;
  todoList.moveItem(itemIdFrom, itemIdTo);
});
