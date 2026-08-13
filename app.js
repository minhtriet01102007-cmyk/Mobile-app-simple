const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  emptyMessage.style.display = tasks.length ? "none" : "block";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.done ? "done" : ""}`;

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span>${escapeHtml(task.text)}</span>
      <button class="delete-btn" title="Xóa">🗑️</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  taskCount.textContent = total;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% hoàn thành`;
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.push({
    text,
    done: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeBtn.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("darkMode", dark);
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

renderTasks();
