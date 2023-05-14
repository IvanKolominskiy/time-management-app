async function sendLoginRequest() {
    let login = document.querySelector('#username');
    let password = document.querySelector('#password');

    let body = { login: login.value, password: password.value };

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    const { token } = await response.json();
    document.cookie = "token=" + token;
}
