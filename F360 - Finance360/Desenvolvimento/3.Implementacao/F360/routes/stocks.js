// Buscar informações de uma ação específica
app.get('/api/stock-info/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        // Verificar se os dados estão no banco de dados
        const dadosDoBanco = await buscarDadosDoBanco(ticker);

        if (dadosDoBanco) {
            return res.status(200).json(dadosDoBanco);
        }

        // Caso não estejam no banco, buscar da API Brapi
        const response = await fetch(`https://brapi.dev/api/quote/${ticker}`, {
            headers: {
                Authorization: `Bearer ${process.env.BRAPI_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na API da Brapi: ${response.status}`);
        }

        const brapiData = await response.json();
        const stockInfo = brapiData.results[0];

        if (!stockInfo) {
            throw new Error('Nenhum dado encontrado para o ticker na API da Brapi');
        }

        // Enviar dados formatados para o cliente
        res.status(200).json({
            ticker: stockInfo.symbol,
            date: obterUltimaDataValida(),
            open_price: stockInfo.regularMarketOpen || 'N/A',
            close_price: stockInfo.regularMarketPrice || 'N/A',
            high_price: stockInfo.regularMarketDayHigh || 'N/A',
            low_price: stockInfo.regularMarketDayLow || 'N/A',
            change_percent: stockInfo.regularMarketChangePercent || 'N/A',
            volume: stockInfo.regularMarketVolume || 'N/A',
            long_name: stockInfo.longName || 'Não disponível',
            logourl: stockInfo.logourl || 'N/A',
            earnings_per_share: stockInfo.earningsPerShare || 'N/A',
        });

        // Salvar ou atualizar os dados no banco
        await salvarOuAtualizarDados(ticker, stockInfo);
    } catch (error) {
        console.error('Erro ao buscar ou salvar dados:', error.message);
        res.status(500).json({ error: 'Erro ao buscar ou salvar dados da ação' });
    }
});

// Rota para ranking das ações com maiores valores de fechamento
app.get('/api/ranking/maiores-valores', async (req, res) => {
    try {
        const sql = `
            SELECT ticker, MAX(close_price) AS valor
            FROM stock_history
            GROUP BY ticker
            ORDER BY valor DESC
            LIMIT 5;
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno do servidor ao consultar banco' });
            }
            res.status(500).json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para ranking baseado nos maiores lucros por ação (EPS)
app.get('/api/ranking/earnings', async (req, res) => {
    try {
        const sql = `
            SELECT ticker, long_name, earnings_per_share
            FROM stock_history
            WHERE earnings_per_share IS NOT NULL
            ORDER BY earnings_per_share DESC
            LIMIT 5;
        `;
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Erro interno no servidor');
    }
});

// Rota para ranking das ações com maior volume (receita)
app.get('/api/ranking/receitas', async (req, res) => {
    try {
        const sql = `
            SELECT ticker, long_name, MAX(volume) AS receita
            FROM stock_history
            GROUP BY ticker
            ORDER BY receita DESC
            LIMIT 5;
        `;
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Erro interno no servidor');
    }
});