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

    const data = await response.json();

    return { status: response.status, data: data };
}

const loginButton = document.getElementById("enter");
loginButton.addEventListener("click", async () => {
    const res = await sendLoginRequest();

    if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('expiresIn', res.data.expiresIn);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        window.location.replace('/dashboard');
    } else {
        alert(res.data.message);

        document.querySelector('#login').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#email').value = '';
    }
});
