const apiUrl = '/api/investments';
const token = localStorage.getItem('token');

fetch('/api/investments', {
    method: 'GET',
    headers: { 'Authorization': token },
})

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '/login.html';
        return;
    }

    // Verificar se o token é válido
    const response = await fetch('/auth/validate', {
        method: 'GET',
        headers: { Authorization: token },
    });

    if (!response.ok) {
        alert('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return;
    }

    const data = await response.json();
    console.log('Usuário autenticado:', data.user);
});

// Carregar investimentos
function loadInvestments() {
    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    fetch(apiUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }, // Inclui o token no cabeçalho
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Erro ao carregar investimentos');
            }
            return res.json();
        })
        .then((data) => {
            const tableBody = document.getElementById('investmentsTableBody');
            tableBody.innerHTML = '';
            data.forEach((investment) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${investment.ticker}</td>
                    <td>R$ ${investment.value.toFixed(2)}</td>
                    <td>${investment.quantity}</td>
                    <td>
                        <button onclick="editInvestment(${investment.id})">Editar</button>
                        <button onclick="deleteInvestment(${investment.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => console.error('Erro ao carregar investimentos:', error));
}

// Adicionar ou editar investimento
document.getElementById('investmentForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Recupera o token
    const id = document.getElementById('investmentId').value;
    const ticker = document.getElementById('ticker').value;
    const value = parseFloat(document.getElementById('value').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Inclui o token
        },
        body: JSON.stringify({ ticker, value, quantity }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Erro ao salvar investimento');
            }
            return res.json();
        })
        .then(() => {
            loadInvestments();
            document.getElementById('investmentForm').reset();
        })
        .catch((error) => console.error('Erro ao salvar investimento:', error));
});

// Editar investimento
function editInvestment(id) {
    const token = localStorage.getItem('token');

    fetch(`${apiUrl}/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((investment) => {
            document.getElementById('investmentId').value = investment.id;
            document.getElementById('ticker').value = investment.ticker;
            document.getElementById('value').value = investment.value;
            document.getElementById('quantity').value = investment.quantity;
        })
        .catch((error) => console.error('Erro ao carregar investimento:', error));
}

function deleteInvestment(id) {
    const token = localStorage.getItem('token');

    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(() => loadInvestments())
        .catch((error) => console.error('Erro ao deletar investimento:', error));
}

// Inicializar
loadInvestments();
