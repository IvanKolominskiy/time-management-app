async function sendAddTaskRequest() {
    const results = document.cookie.match(/token=(.+?)(;|$)/);
    const token = results[1];

    const text = document.querySelector('#task');
    const body = { text: text.value };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }

    await fetch('/dashboard', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });
}