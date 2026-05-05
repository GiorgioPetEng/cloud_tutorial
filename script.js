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
const emptyState = getRequiredElement("#empty-state");
const progressBadge = getRequiredElement("#progress-badge");
const themeToggle = getRequiredElement("#theme-toggle");

const DARK = "dark";
const LIGHT = "light";

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === DARK ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", theme === DARK ? "Switch to light mode" : "Switch to dark mode");
};

const savedTheme = localStorage.getItem("theme") ?? LIGHT;
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === DARK ? LIGHT : DARK;
  applyTheme(next);
  localStorage.setItem("theme", next);
});

const setHelperMessage = (message, isError = false) => {
  helperText.textContent = message;
  helperText.classList.toggle("helper-text--error", isError);
};

const saveTodos = () => {
  const todos = Array.from(todoList.querySelectorAll(".todo-item")).map((item) => ({
    text: item.querySelector(".todo-text")?.textContent ?? "",
    completed: item.classList.contains("todo-item--completed"),
  }));

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateHelperText = () => {
  const total = todoList.childElementCount;
  const completed = todoList.querySelectorAll(".todo-item--completed").length;

  setHelperMessage(total === 0
    ? "Add your first task to get started."
    : `${total} task${total === 1 ? "" : "s"} in the list.`);

  if (total === 0) {
    emptyState.removeAttribute("hidden");
    emptyState.setAttribute("aria-hidden", "false");
    progressBadge.setAttribute("hidden", "");
    return;
  }

  emptyState.setAttribute("hidden", "");
  emptyState.setAttribute("aria-hidden", "true");
  progressBadge.removeAttribute("hidden");
  progressBadge.textContent = `${completed} of ${total} done`;
};

const createTodoItem = (value, completed = false) => {
  const item = document.createElement("li");
  item.className = "todo-item";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "toggle-button";
  toggle.setAttribute("aria-label", `${completed ? "Unmark" : "Mark"} "${value}" as complete`);
  toggle.setAttribute("aria-pressed", String(completed));

  if (completed) {
    item.classList.add("todo-item--completed");
  }

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

const loadTodos = () => {
  const todos = JSON.parse(localStorage.getItem("todos") ?? "[]");

  todos.forEach(({ text, completed }) => {
    todoList.append(createTodoItem(text, completed));
  });

  updateHelperText();
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
  saveTodos();
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
      `${completed ? "Unmark" : "Mark"} "${item?.querySelector(".todo-text")?.textContent}" as complete`);
    saveTodos();
    updateHelperText();
    return;
  }

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("delete-button")) {
    return;
  }

  const item = target.closest(".todo-item");
  const nextButton = item?.nextElementSibling?.querySelector(".delete-button");
  const previousButton = item?.previousElementSibling?.querySelector(".delete-button");

  if (nextButton instanceof HTMLButtonElement) {
    nextButton.focus();
  } else if (previousButton instanceof HTMLButtonElement) {
    previousButton.focus();
  } else {
    todoInput.focus();
  }

  if (item) {
    item.classList.add("todo-item--exiting");
    const removeItem = () => {
      item.remove();
      saveTodos();
      updateHelperText();
    };
    const fallback = setTimeout(removeItem, 300);
    item.addEventListener("animationend", () => {
      clearTimeout(fallback);
      removeItem();
    }, { once: true });
  }
});

loadTodos();