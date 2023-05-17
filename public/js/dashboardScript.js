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
