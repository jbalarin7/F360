document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/portfolio/investments');

        if (response.status == 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) throw new Error("Erro inesperado.")

        const investments = await response.json();
        renderInvestments(investments); // Renderiza os investimentos
    } catch (error) {
        console.error('Erro ao carregar investimentos:', error);
        alert('Erro ao carregar investimentos.');
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('Logout realizado com sucesso!');
            window.location.href = '/login.html'; // Redireciona para a tela de login
        } else {
            alert('Erro ao tentar fazer logout.');
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
});

document.getElementById('investmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('investmentId').value;
    const name = document.getElementById('ticker').value;
    const value = parseFloat(document.getElementById('value').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/portfolio/investments/${id}` : '/api/portfolio/investments';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, quantity }),
        });

        if (response.status == 401) {
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            alert('Investimento salvo com sucesso!');
            window.location.reload(); // Atualiza a página
        } else {
            alert('Erro ao salvar investimento.');
        }
    } catch (error) {
        console.error('Erro ao salvar investimento:', error);
    }
});

async function deleteInvestment(id) {
    try {
        const response = await fetch(`/api/portfolio/investments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Investimento excluído!');
            window.location.reload(); // Atualiza a página
        } else {
            alert('Erro ao excluir investimento.');
        }
    } catch (error) {
        console.error('Erro ao excluir investimento:', error);
    }
}

function editInvestment(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    document.getElementById('investmentId').value = id;
    document.getElementById('ticker').value = row.querySelector('.ticker').textContent;
    document.getElementById('value').value = row.querySelector('.value').textContent.replace('R$ ', '');
    document.getElementById('quantity').value = row.querySelector('.quantity').textContent;
}

// Função para gerar o gráfico de pizza
function renderPieChart(investments) {
    const investmentChart = document.getElementById('investmentChart').getContext('2d');
    
    // Calculando os valores totais dos investimentos
    const totalValue = investments.reduce((acc, investment) => acc + (investment.value * investment.quantity), 0);

    // Dados para o gráfico
    const chartData = investments.map(investment => ({
        label: investment.name,
        value: (investment.value * investment.quantity) / totalValue * 100
    }));

    const data = {
        labels: chartData.map(item => item.label),
        datasets: [{
            data: chartData.map(item => item.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            hoverBackgroundColor: ['#FF758F', '#49C8F2', '#FFD03B', '#4CD9D5', '#FFAA58'],
        }]
    };

    // Opções do gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                    }
                }
            }
        }
    };

    // Criando o gráfico
    new Chart(investmentChart, {
        type: 'pie',
        data: data,
        options: options
    });
}

function renderInvestments(investments) {
    const investmentsContainer = document.getElementById('investments-container');
    if (investments.length > 0) {
        investmentsContainer.innerHTML = investments.map(investment => `
            <tr data-id="${investment.id}">
                <td class="ticker">${investment.name}</td>
                <td class="value">R$ ${investment.value.toFixed(2)}</td>
                <td class="quantity">${investment.quantity}</td>
                <td>
                    <button onclick="editInvestment(${investment.id})">Editar</button>
                    <button onclick="deleteInvestment(${investment.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }

    renderPieChart(investments);
}

// Atualiza o redirecionamento do botão "Voltar para a Tela Inicial"
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.querySelector('.home-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = `/index.html`;
        });
    }
});