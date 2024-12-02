document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.querySelector('#registerEmail').value;
            const password = document.querySelector('#registerPassword').value;

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '/login.html';
            } else {
                alert(result.error || 'Erro ao registrar usuário.');
            }
        });
    } else {
        console.error('Formulário de registro não encontrado.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Selecionar o formulário de login
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.querySelector('#loginEmail').value;
            const password = document.querySelector('#loginPassword').value;
            const keepLogged = document.querySelector('#keepLogged').checked;

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, keepLogged }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                alert(result.message);
                window.location.href = '/portfolio.html';
            } else {
                alert(result.error || 'Erro ao fazer login.');
            }
        });
    } else {
        console.error('Formulário de login não encontrado.');
    }
});

// Registro de usuário
document.querySelector('#registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Capturar apenas email e senha
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Removido o campo username
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        window.location.href = '/login.html';
    } else {
        alert(result.error || 'Erro ao registrar.');
    }
});

// Login de usuário
document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    const keepLogged = document.querySelector('#keepLogged').checked;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, keepLogged }),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token);
        alert(result.message);
        window.location.href = '/portfolio.html';
    } else {
        alert(result.error || 'Erro ao fazer login.');
    }
});
