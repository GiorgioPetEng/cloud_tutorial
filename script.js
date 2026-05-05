const getRequiredElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
};

const todoForm = getRequiredElement("#todo-form");
const todoInput = getRequiredElement("#todo-input");
const todoList = getRequiredElement("#todo-list");
const helperText = getRequiredElement("#helper-text");

const setHelperMessage = (message, isError = false) => {
  helperText.textContent = message;
  helperText.classList.toggle("helper-text--error", isError);
};

const updateHelperText = () => {
  setHelperMessage(todoList.childElementCount === 0
    ? "Add your first task to get started."
    : `${todoList.childElementCount} task${todoList.childElementCount === 1 ? "" : "s"} in the list.`);
};

const createTodoItem = (value) => {
  const item = document.createElement("li");
  item.className = "todo-item";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "toggle-button";
  toggle.setAttribute("aria-label", `Mark "${value}" as complete`);
  toggle.setAttribute("aria-pressed", "false");

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = value;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete "${value}"`);

  item.append(toggle, text, deleteButton);
  return item;
};

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = todoInput.value.trim();
  if (!value) {
    setHelperMessage("Task cannot be empty.", true);
    todoInput.focus();
    return;
  }

  todoList.append(createTodoItem(value));
  updateHelperText();
  todoForm.reset();
  todoInput.focus();
});

todoList.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLButtonElement && target.classList.contains("toggle-button")) {
    const item = target.closest(".todo-item");
    const completed = item?.classList.toggle("todo-item--completed");
    target.setAttribute("aria-pressed", String(completed));
    target.setAttribute("aria-label",
      `${completed ? "Mark" : "Unmark"} "${item?.querySelector(".todo-text")?.textContent}" as complete`);
    return;
  }

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("delete-button")) {
    return;
  }

  const item = target.closest(".todo-item");
  const nextButton = item?.nextElementSibling?.querySelector(".delete-button");
  const previousButton = item?.previousElementSibling?.querySelector(".delete-button");

  item?.remove();

  if (nextButton instanceof HTMLButtonElement) {
    nextButton.focus();
  } else if (previousButton instanceof HTMLButtonElement) {
    previousButton.focus();
  } else {
    todoInput.focus();
  }

  updateHelperText();
});

updateHelperText();