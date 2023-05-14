async function sendRegisterRequest() {
    let login = document.querySelector('#username');
    let password = document.querySelector('#password');
    let email = document.querySelector('#useremail');

    let body = { login: login.value, password: password.value, email: email.value };

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = await fetch('/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    const { token } = await response.json();
    document.cookie = "token=" + token;
}