async function sendAddTaskRequest() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    const token = results[1];

    const body = {
        name: document.querySelector('#name').value,
        description: document.querySelector('#description').value,
        deadlineDay: document.querySelector('#due-date-day').value,
        deadlineMonth: document.querySelector('#due-date-month').value,
        deadlineYear: document.querySelector('#due-date-year').value,
        status: currentStatusName
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }

    const response = await fetch('/dashboard', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    const data = await response.json();

    return { status: response.status, data: data };
}

async function sendGetNotesRequest() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    const token = results[1];

    const response = await fetch("/dashboard/getTasks", {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    const data = await response.json();
    return data;
}

async function sendEditRequest(taskId) {
    const body = {
        name: document.querySelector('#name').value,
        description: document.querySelector('#description').value,
        deadlineDay: document.querySelector('#due-date-day').value,
        deadlineMonth: document.querySelector('#due-date-month').value,
        deadlineYear: document.querySelector('#due-date-year').value,
        status: currentStatusName,
        id: taskId
    };

    const headers = {
        'Content-Type': 'application/json'
    }

   await fetch('/dashboard/editTask', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: headers
    });
}

function exit() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    if (results) {
        const token = results[1];
        document.cookie = "token=" + token + "; max-age=0";
    }

    window.location.replace('/');
}

function checkAuth() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);

    if (!results) {
        alert('Please login or register first');
        window.location.replace('/register');
    }
}

async function showInfo(id){
    const currentInfo = tasksInfo[id];

    const notesInfoContainer = document.querySelector('.task-info');
    notesInfoContainer.innerHTML = currentInfo;
}

function showNotes(mainPageFlag) {
    const tasksLength = tasks.length - 1;

    tasksViews.reverse().forEach((el, index) => {
        let noteContainer;

        if (tasks[tasksLength - index].status === "Отложенное") {
            noteContainer = document.querySelector(".tasks-list-pending");
        }

        if (tasks[tasksLength - index].status === "Ближайшее") {
            noteContainer = document.querySelector(".tasks-list-nearest");
        }

        if (tasks[tasksLength - index].status === "Текущее") {
            noteContainer = document.querySelector(".tasks-list-current");
        }

        if (tasks[tasksLength - index].status === "Корзина") {
            noteContainer = document.querySelector(".tasks-list");
        }

        noteContainer.innerHTML += el;
    });

    const taskItems = document.querySelectorAll(`.task-item`);
    taskItems.forEach((task) => {
        task.addEventListener("click", () => {
            viewTaskOverlay.classList.remove("hide");
            activeOverlay = viewTaskOverlay;
            document.body.classList.add("overflow-hidden");
        });
    });

    if (!mainPageFlag) {
        window.location.replace('/dashboard');
    }
}

async function deleteNote(index) {
    await fetch('/dashboard/deleteTask', {
        method: 'DELETE',
        body: JSON.stringify({id: tasks[index]._id}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    tasks.splice(index, 1);
    tasksInfo.splice(index, 1);
    tasksViews.splice(index, 1);

    showNotes(false);
}

async function editTask(index) {
    document.querySelector(".overlay-name").innerHTML = "<h1 class=\"header\">Изменить задачу</h1>";
    document.querySelector(".button-name").innerHTML =
        `<button
                type="submit"
                class="button regular-button green-background cta-button"
                id="edit-task-button"
        >
          Изменить задачу
        </button>`

    document.querySelector('#name').value = tasks[index].name;
    document.querySelector('#description').value = tasks[index].description;
    document.querySelector('#due-date-day').value = tasks[index].deadlineDay;
    document.querySelector('#due-date-month').value = tasks[index].deadlineMonth;
    document.querySelector('#due-date-year').value = tasks[index].deadlineYear;

    currentStatusName = tasks[index].status
    statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";

    activeOverlay.classList.add("hide");

    const editTaskOverlay = document.getElementById( "set-task-overlay");
    editTaskOverlay.classList.remove("hide");
    activeOverlay = editTaskOverlay;

    const editTaskButton = document.getElementById("edit-task-button");
    editTaskButton.addEventListener("click", async () => {
        await sendEditRequest(tasks[index]._id);
        showNotes(false);
    });
}

checkAuth();

let tasksInfo = [];
let tasks = []
let tasksViews = []

const res = sendGetNotesRequest();
res.then(data => {
    data.tasks.forEach((el, index) => {
        const note = `
        <li class="task-item">
            <button class="task-button" onclick="showInfo(${index})">
              <p class="task-name">${el.name}</p>
              <p class="task-due-date">Сделать до ${el.deadlineDay}.${el.deadlineMonth}.${el.deadlineYear}</p>
              <iconify-icon
                      icon="material-symbols:arrow-back-ios-rounded"
                      style="color: black"
                      width="18"
                      height="18"
                      class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>`;

        const noteInfo = `
            <h1 class="header no-margin">Имя</h1>
            <p class="value">${el.name}</p>
            <h1 class="header">Описание</h1>
            <p class="value">
              ${el.description}
            </p>
            <div class="flex items-center">
              <h1 class="header min-width">Дата завершения</h1>
              <p class="value">${el.deadlineDay}.${el.deadlineMonth}.${el.deadlineYear}</p>
            </div>
            <div class="flex items-center">
              <h1 class="header min-width">Статус</h1>
              <p class="value status-value">
                <span class="circle"></span><span>${el.status}</span>
              </p>
            </div>
            <div class="control-buttons-container">
              <button
                      class="button circle-button pink-background flex justify-center items-center"
                      onclick="editTask(${index})"
              >
                <iconify-icon
                        icon="material-symbols:edit-rounded"
                        style="color: black"
                        width="24"
                        height="24"
                ></iconify-icon>
              </button>
              <button
                      id="delete-task-cta"
                      class="button circle-button pink-background flex justify-center items-center"
                      onclick="deleteNote(${index})"
              >
                <iconify-icon
                        icon="ic:round-delete"
                        style="color: black"
                        width="24"
                        height="24"
                ></iconify-icon>
              </button>
            </div>`

        tasksViews.push(note);
        tasksInfo.push(noteInfo);
        tasks.push(el);
    });
    showNotes(true);
});

const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const viewTaskOverlay = document.getElementById("view-task-overlay");
let activeOverlay = null;

const basketStatusButton = document.getElementById("basket-radio");
const pendingStatusButton = document.getElementById("pending-radio");
const currentStatusButton = document.getElementById("current-radio");
const nearestStatusButton = document.getElementById("nearest-radio");

let currentStatusName = "Корзина";
const statusNameContainer = document.querySelector(".status-name");
statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";

basketStatusButton.addEventListener("click", () => {
    currentStatusName = "Корзина";
    statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";
    statusDropdown.classList.toggle("hide");
});

pendingStatusButton.addEventListener("click", () => {
    currentStatusName = "Отложенное";
    statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";
    statusDropdown.classList.toggle("hide");
});

currentStatusButton.addEventListener("click", () => {
    currentStatusName = "Текущее";
    statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";
    statusDropdown.classList.toggle("hide");
});

nearestStatusButton.addEventListener("click", () => {
    currentStatusName = "Ближайшее";
    statusNameContainer.innerHTML = "<span>" + currentStatusName + "</span>";
    statusDropdown.classList.toggle("hide");
});

radioViewOptions.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
        const eventTarget = event.target;
        const viewOption = eventTarget.value;

        switch (viewOption) {
            case "list":
                boardView.classList.add("hide");
                listView.classList.remove("hide");
                break;
            case "board":
                listView.classList.add("hide");
                boardView.classList.remove("hide");
                break;
        }
    });
});

addTaskCTA.addEventListener("click", () => {
    document.querySelector(".overlay-name").innerHTML = "<h1 class=\"header\">Добавить задачу</h1>";
    document.querySelector(".button-name").innerHTML =
        `<button
                type="submit"
                class="button regular-button green-background cta-button"
                id="add-task-button"
        >
          Добавить задачу
        </button>`

    const addTaskButton = document.getElementById("add-task-button");
    addTaskButton.addEventListener("click", async () => {
        const res = await sendAddTaskRequest();

        if (res.status === 400) {
            let errors = '';
            res.data.errors.forEach((el) => errors = errors + el.msg + '\n');
            alert(errors);
        }

        if (res.status === 500) {
            alert(res.data.message);
        }

        if (res.status === 200) {
            alert('The task was successfully created');
        }

        document.querySelector('#name').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#due-date-day').value = '';
        document.querySelector('#due-date-month').value = '';
        document.querySelector('#due-date-year').value = '';
    });


    setTaskOverlay.classList.remove("hide");
    activeOverlay = setTaskOverlay;
    document.body.classList.add("overflow-hidden");
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeOverlay.classList.add("hide");
        activeOverlay = null;
        document.body.classList.remove("overflow-hidden");
    });
});

statusSelect.addEventListener("click", () => {
    statusDropdown.classList.toggle("hide");
});

