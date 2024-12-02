document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('authToken')) {
        // Se já estiver logado, redireciona para o portfolio
        window.location.href = 'portfolio.html';
    }
});
