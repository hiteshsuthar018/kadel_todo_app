const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#add-btn");
const sidebarList = document.querySelector("#sidebar-list");
const todoDisplay = document.querySelector("#todo-display");
const darkToggle = document.querySelector("#dark-toggle");

let selectedId = null;

//inital function to run
document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    loadTheme();
});

//event listeners
addBtn.addEventListener("click", addTodo);
darkToggle.addEventListener("click", toggleDarkMode);


//add todo 
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
//get all todos 
function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

//load todos 
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
}

//show todo
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

//toggle complete flag
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

//delete todo 
function deleteTodo(id) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);

    localStorage.setItem("todos", JSON.stringify(todos));
    todoDisplay.innerHTML = "<p>Select a todo from sidebar</p>";
    loadTodos();
}

//edit todo
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

//save edit
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

//toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

//loading theme to browser
function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}