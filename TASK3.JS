let tasks = [];
let currentMenu = 'all';

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const menuButtons = document.querySelectorAll(".menu-btn");

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".menu-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentMenu = btn.dataset.menu;
    renderTasks();
  });
});

function addTask() {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false, trashed: false });
    taskInput.value = "";
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks[index].trashed = true;
  renderTasks();
}

function restoreTask(index) {
  tasks[index].trashed = false;
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let visibleTasks = tasks.filter((task, index) => {
    if (currentMenu === "all") return !task.trashed;
    if (currentMenu === "active") return !task.completed && !task.trashed;
    if (currentMenu === "completed") return task.completed && !task.trashed;
    if (currentMenu === "trash") return task.trashed;
  });

  if (visibleTasks.length === 0) {
    taskList.innerHTML = `<li style="text-align:center; opacity: 0.6;">Nothing here yet 🪄</li>`;
    return;
  }

  visibleTasks.forEach((task, index) => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    if (task.trashed) li.classList.add("trashed");

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="task-btns">
        ${!task.trashed ? `
          <button onclick="toggleComplete(${realIndex})">${task.completed ? '↩️' : '✅'}</button>
          <button onclick="deleteTask(${realIndex})">🗑️</button>
        ` : `
          <button onclick="restoreTask(${realIndex})">♻️</button>
        `}
      </div>
    `;
    taskList.appendChild(li);
  });
}
