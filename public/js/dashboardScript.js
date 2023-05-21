async function sendAddTaskRequest() {
    await checkTokenDate();

    const accessToken = localStorage.getItem("accessToken");

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
        'Authorization': accessToken
    }

    const response = await fetch('/dashboard', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    const data = await response.json();

    return { status: response.status, data: data };
}

async function sendGetTasksRequest() {
    await checkTokenDate();

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("/dashboard/getTasks", {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    });

    return await response.json();
}

async function sendEditRequest(taskId) {
    await checkTokenDate();

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

   const response = await fetch('/dashboard/editTask', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: headers
    });

    const data = await response.json();

    return { status: response.status, data: data };
}

async function sendRefreshTokenRequest() {
    const body = {
        refreshToken: localStorage.getItem("refreshToken"),
        accessToken: localStorage.getItem("accessToken"),
    }

    const response = await fetch('/refreshToken', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    return { status: response.status, data: data };
}

async function deleteTask(index) {
    await checkTokenDate();

    const tasks = JSON.parse(localStorage.getItem("tasks"));

    await fetch('/dashboard/deleteTask', {
        method: 'DELETE',
        body: JSON.stringify({id: tasks[index]._id}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    tasks.splice(index, 1);

    tasks.forEach((el, index) => {
        el.taskView = makeTaskView(el, index);
        el.taskInfo = makeTaskInfo(el, index);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    update();
}

async function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

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
        const res = await sendEditRequest(tasks[index]._id);

        if (res.status === 200) {
            tasks[index] = res.data.task;

            tasks[index].taskView = makeTaskView(tasks[index], index);
            tasks[index].taskInfo = makeTaskInfo(tasks[index], index);

            localStorage.setItem("tasks", JSON.stringify(tasks));

            update();
        }

        if (res.status === 500) {
            alert(res.data.message);
        }
    });
}

function exit() {
    localStorage.removeItem("accessToken");
    window.location.replace('/');
}

async function checkAuth() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert('Войдите или зарегистрируйтесь');
        window.location.replace('/');
    }

    await checkTokenDate();
}

function makeTaskView(task, index) {
    const date = checkDate(task.deadlineDay, task.deadlineMonth, task.deadlineYear);
    return `<li class="task-item">
            <button class="task-button" onclick="showInfo(${index})">
              <p class="task-name">${task.name}</p>
              <p class="task-due-date">${date}</p>
              <iconify-icon
                      icon="material-symbols:arrow-back-ios-rounded"
                      style="color: black"
                      width="18"
                      height="18"
                      class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>`;
}

function makeTaskInfo(task, index) {
    const date = checkDate(task.deadlineDay, task.deadlineMonth, task.deadlineYear);

    return `<h1 class="header no-margin">Имя</h1>
    <p class="value">${task.name}</p>
    <h1 class="header">Описание</h1>
    <p class="value">
        ${task.description}
    </p>
    <div class="flex items-center">
        <h1 class="header min-width">Дата завершения</h1>
        <p class="value">${date}</p>
    </div>
    <div class="flex items-center">
        <h1 class="header min-width">Статус</h1>
        <p class="value status-value">
            <span class="circle"></span><span>${task.status}</span>
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
            onclick="deleteTask(${index})"
        >
            <iconify-icon
                icon="ic:round-delete"
                style="color: black"
                width="24"
                height="24"
            ></iconify-icon>
        </button>
    </div>`
}

function showInfo(id){
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    const currentInfo = tasks[id].taskInfo;

    const tasksInfoContainer = document.querySelector('.task-info');
    tasksInfoContainer.innerHTML = currentInfo;
}

function showTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    tasks.reverse().forEach((el, index) => {
        let taskContainer;

        if (tasks[index].status === "Отложенное") {
            taskContainer = document.querySelector(".tasks-list-pending");
        }

        if (tasks[index].status === "Ближайшее") {
            taskContainer = document.querySelector(".tasks-list-nearest");
        }

        if (tasks[index].status === "Текущее") {
            taskContainer = document.querySelector(".tasks-list-current");
        }

        if (tasks[index].status === "Корзина") {
            taskContainer = document.querySelector(".tasks-list");
        }

        taskContainer.innerHTML += el.taskView;
    });

    const taskItems = document.querySelectorAll(`.task-item`);
    taskItems.forEach((task) => {
        task.addEventListener("click", () => {
            viewTaskOverlay.classList.remove("hide");
            activeOverlay = viewTaskOverlay;
            document.body.classList.add("overflow-hidden");
        });
    });
}

function checkDate(day, month, year) {
    if (month <= 0 || month > 12) {
        return "";
    }

    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа",
                            "Сентября", "Октябрь", "Ноября", "Декабря"];

    if (day && month && year) {
        return `Сделать до ${day} ${months[month - 1]} ${year}`;
    }

    if (day && month) {
        return `Сделать до ${day} ${months[month - 1]}`;
    }

    if (month && year) {
        return `Сделать до ${months[month - 1]} ${year}`;
    }

    if (month) {
        return `Сделать до ${months[month - 1]}`;
    }

    if (year) {
        return `Сделать до ${year}`;
    }

    return "";
}

function update() {
    window.location.replace("/dashboard");
}

async function checkTokenDate() {
    const currentTime = new Date().toISOString();
    const accessTokenTime = localStorage.getItem("expiresIn");

    if (Date.parse(currentTime) > Date.parse(accessTokenTime)) {
        const res = await sendRefreshTokenRequest();

        if (res.status === 200) {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("expiresIn", res.data.expiresIn);
        }

        if (res.status === 404) {
            alert(res.data.message);
            window.location.replace('/login');
        }
    }
}

checkAuth();

if (!localStorage.getItem("tasks")) {
    const res = sendGetTasksRequest();
    res.then(data => {
        let tasks = [];

        data.tasks.forEach((el, index) => {
            el.taskView = makeTaskView(el, index);
            el.taskInfo = makeTaskInfo(el, index);

            tasks.push(el);
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        showTasks();
    });
} else {
    showTasks();
}

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
            alert('Задача успешно создана');

            const tasks = JSON.parse(localStorage.getItem("tasks"));

            const currentTask = res.data.task;

            currentTask.taskView = makeTaskView(currentTask, tasks.length);
            currentTask.taskInfo = makeTaskInfo(currentTask, tasks.length);

            tasks.push(currentTask);

            localStorage.setItem("tasks", JSON.stringify(tasks));
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

