const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const sidebarList = document.getElementById("sidebar-list");
const todoDisplay = document.getElementById("todo-display");
const darkToggle = document.getElementById("dark-toggle");
const deleteAllBtn = document.getElementById("delete-all");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const remainingCount = document.getElementById("remaining-count");

let selectedId = null;

document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    loadTheme();
});

addBtn.addEventListener("click", addTodo);
darkToggle.addEventListener("click", toggleDarkMode);
deleteAllBtn.addEventListener("click", deleteAllTodos);

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    const todos = getTodos();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    input.value = "";
    loadTodos();
}

function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function loadTodos() {
    sidebarList.innerHTML = "";
    const todos = getTodos();

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.text.substring(0, 20);
        li.classList.add("sidebar-item");

        if (todo.completed) {
            li.style.textDecoration = "line-through";
        }

        li.addEventListener("click", () => showTodo(todo.id));
        sidebarList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const todos = getTodos();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
}

function showTodo(id) {
    selectedId = id;
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);

    todoDisplay.innerHTML = `
        <h3 class="todo-text ${todo.completed ? "completed" : ""}">
            ${todo.text}
        </h3>
        <p class="date">Created: ${todo.createdAt}</p>
        <div class="actions">
            <button class="complete-btn">
                ${todo.completed ? "Undo" : "Complete"}
            </button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    document.querySelector(".complete-btn")
        .addEventListener("click", () => toggleComplete(id));

    document.querySelector(".delete-btn")
        .addEventListener("click", () => deleteTodo(id));

    document.querySelector(".edit-btn")
        .addEventListener("click", () => editTodo(id));
}

function toggleComplete(id) {
    let todos = getTodos();

    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
    showTodo(id);
}

function deleteTodo(id) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);

    localStorage.setItem("todos", JSON.stringify(todos));
    todoDisplay.innerHTML = "<p>Select a todo from sidebar</p>";
    loadTodos();
}

function deleteAllTodos() {
    if (!confirm("Are you sure you want to delete all todos?")) return;

    localStorage.removeItem("todos");
    todoDisplay.innerHTML = "<p>Select a todo from sidebar</p>";
    loadTodos();
}

function editTodo(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);

    todoDisplay.innerHTML = `
        <input class="edit-input" value="${todo.text}" />
        <p class="date">Created: ${todo.createdAt}</p>
        <div class="actions">
            <button class="complete-btn">Save</button>
        </div>
    `;

    document.querySelector(".complete-btn")
        .addEventListener("click", () => saveEdit(id));
}

function saveEdit(id) {
    const newText = document.querySelector(".edit-input").value.trim();
    if (!newText) return;

    let todos = getTodos();

    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.text = newText;
        }
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
    showTodo(id);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}