document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('authToken')) {
        // Se já estiver logado, redireciona para o portfolio
        window.location.href = 'portfolio.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', `Bearer ${data.token}`);
                window.location.href = '/portfolio.html';
            } else {
                alert('Erro ao fazer login');
            }
        })
        .catch((error) => console.error('Erro ao fazer login:', error));
});
