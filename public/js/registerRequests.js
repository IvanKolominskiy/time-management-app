async function sendRegisterRequest() {
    let login = document.querySelector('#login');
    let password = document.querySelector('#password');
    let email = document.querySelector('#email');

    let body = { login: login.value, password: password.value, email: email.value };

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = await fetch('/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    if (response.status === 400) {
        window.location.replace('/register');
    }

    if (response.status > 200) {
        window.location.replace('/register');
    }

    const { token } = await response.json();
    document.cookie = "token=" + token;
    window.location.replace('/dashboard');
}