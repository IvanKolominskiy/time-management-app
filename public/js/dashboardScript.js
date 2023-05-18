async function sendAddTaskRequest() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    const token = results[1];

    const body = {
        name: document.querySelector('#name').value,
        description: document.querySelector('#description').value,
        deadlineDay: document.querySelector('#due-date-day').value,
        deadlineMonth: document.querySelector('#due-date-month').value,
        deadlineYear: document.querySelector('#due-date-year').value
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }

    const res = await fetch('/dashboard', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });
}

async function exit() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    if (results) {
        const token = results[1];
        document.cookie = "token=" + token + "; max-age=0";
    }

    window.location.replace('/');
}

async function sendGetNotesRequest() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    const token = results[1];

    const response = await fetch("/dashboard/getNotes", {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    const data = await response.json();
    return data;
}

async function checkAuth() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);

    if (!results) {
        alert('Please login or register first');
        window.location.replace('/register');
    }
}

checkAuth();

const notes = sendGetNotesRequest();
notes.then(data => {
    data.tasks.forEach(el => {
        const note = `
        <li class="task-item">
            <button class="task-button">
              <p class="task-name">${el.name}</p>
              <p class="task-due-date">${el.description}</p>
              <iconify-icon
                      icon="material-symbols:arrow-back-ios-rounded"
                      style="color: black"
                      width="18"
                      height="18"
                      class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>`;


        let noteContainer = document.querySelector(".tasks-list");
        noteContainer.innerHTML += note;
    })

    const taskItems = document.querySelectorAll(`.task-item`);
    taskItems.forEach((task) => {
        task.addEventListener("click", () => {
            viewTaskOverlay.classList.remove("hide");
            activeOverlay = viewTaskOverlay;
            document.body.classList.add("overflow-hidden");
        });
    });
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
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
let activeOverlay = null;


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

deleteTaskCTA.addEventListener("click", () => {
    activeOverlay.classList.add("hide");
    activeOverlay = null;
    document.body.classList.remove("overflow-hidden");
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
});