async function sendLoginRequest() {
    let login = document.querySelector('#login');
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

    if (response.status > 200) {
        response.json()
            .then(json => {
                alert(json.message);
                window.location.replace('/login');
            });
    }

    const { token } = await response.json();
    document.cookie = "token=" + token;
    window.location.replace('/dashboard');
}
