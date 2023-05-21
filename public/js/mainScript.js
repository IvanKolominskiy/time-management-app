async function sendRegisterRequest() {
    let login = document.querySelector('#login');
    let password = document.querySelector('#password');
    let email = document.querySelector('#email');

    let body = { login: login.value, password: password.value, email: email.value };

    const headers = {
        'Content-Type': 'application/json'
    }

    const response = await fetch('/', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    });

    const data = await response.json();

    return { status: response.status, data: data };
}

if (localStorage.getItem("accessToken")) {
    window.location.replace('/dashboard');
}

const registerButton = document.getElementById("register");
registerButton.addEventListener("click", async () => {
    const res = await sendRegisterRequest();

    if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('expiresIn', res.data.expiresIn);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        window.location.replace('/dashboard');
    }

    if (res.status === 400) {
        let errors = '';
        res.data.errors.forEach((el) => errors = errors + el.msg + '\n');
        alert(errors);

        document.querySelector('#login').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#email').value = '';
    }

    if (res.status === 500) {
        alert(res.data.message);

        document.querySelector('#login').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#email').value = '';
    }
});