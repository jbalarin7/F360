import conexao from "../database/conexao";

class StockHistory{
    buscarUltimos10DiasDoBanco(ticker){
        const sql = `
                    SELECT * FROM stock_history
                    WHERE ticker = ?
                    ORDER BY date DESC
                    LIMIT 10
                `
        return new Promise((resolve, reject) => {
         
            conexao.query(sql,ticker,(erro,resultado)=>{
                if(erro){
                    reject(erro)
                }else{
                    resolve(resultado);
                }
            })
      
          })
    }
  
    salvarOuAtualizarDadosComTransacao(ticker, stockInfo) {
        return new Promise((resolve, reject) => {
            conexao.beginTransaction(async (err) => {
                if (err) return reject(err);
    
                try {
                    // Extrair a data da API
                    const dataDaApi = stockInfo.regularMarketTime
                        ? stockInfo.regularMarketTime.split('T')[0]
                        : null;
    
                    if (!dataDaApi) {
                        console.error('Erro: A API da Brapi não retornou uma data válida.');
                        throw new Error('A API não forneceu uma data válida.');
                    }
    
                    // SQL para verificar se os dados do dia já existem no banco
                    const sqlCheckHoje = `
                        SELECT * FROM stock_history WHERE ticker = ? AND date = ?
                    `;
                    const sqlInsert = `
                        INSERT INTO stock_history (
                            ticker, 
                            date, 
                            open_price, 
                            close_price, 
                            high_price, 
                            low_price, 
                            volume,
                            long_name,                    
                            change_percent,
                            earnings_per_share
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
    
                    // Verificar se os dados já estão no banco
                    const registrosHoje = await this.executarQuery(sqlCheckHoje, [ticker, dataDaApi]);
                    if (registrosHoje.length > 0) {
                        console.log(`Dados para ${ticker} na data ${dataDaApi} já encontrados no banco.`);
                        conexao.commit((commitErr) => {
                            if (commitErr) return conexao.rollback(() => reject(commitErr));
                            resolve({ dados: registrosHoje[0], atualizado: false });
                        });
                        return;
                    }
    
                    // Inserir os dados no banco
                    await this.executarQuery(sqlInsert, [
                        ticker,
                        dataDaApi, // Usa a data da API
                        stockInfo.regularMarketOpen || null,
                        stockInfo.regularMarketPrice || null,
                        stockInfo.regularMarketDayHigh || null,
                        stockInfo.regularMarketDayLow || null,
                        stockInfo.regularMarketVolume || null,
                        stockInfo.longName || null,
                        stockInfo.regularMarketChangePercent || null,
                        stockInfo.earningsPerShare || null
                    ]);
    
                    // Confirmar transação
                    conexao.commit((commitErr) => {
                        if (commitErr) return conexao.rollback(() => reject(commitErr));
                        console.log(`Dados inseridos no banco para ${ticker} na data ${dataDaApi}.`);
                        resolve({ dados: stockInfo, atualizado: true });
                    });
    
                } catch (error) {
                    // Reverter transação em caso de erro
                    conexao.rollback(() => {
                        console.error('Erro durante a transação:', error.message);
                        reject(error);
                    });
                }
            });
        });
    }
    
    // Função utilitária para executar queries com Promises
    executarQuery(sql, params) {
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}

export default new StockHistory;