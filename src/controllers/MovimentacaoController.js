const {query} = require('../database/connectionMysql');
const {cfop} = require('../controllers/CfopController'); 

let saida = 1;
module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idMovimentacao) filter = ' WHERE idMovimentacao=' + parseInt(req.params.idMovimentacao);
        query("SELECT * FROM movimentacao" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        movimentacao = req.body.cabecalho;
        produtos = req.body.produtos;

        //atualiza lançamento movimentações 
        for (let index = 0; index < produtos.length; index++) {
            query(`INSERT INTO movimentacao
            (dataMovimentacao, idProdutoFK, nfe,
                idCfopFK,idFornecedorFK,idClienteFK,
                quantidade, precoUnit, idDepositoFK, valorTotal
                  ) 
            VALUES 
            (
            '${movimentacao.dataMovimentacao}', 
            '${produtos[index].idProdutoFK}', 
            '${movimentacao.nfe}',
            '${movimentacao.idCfopFK}',
            '${movimentacao.idFornecedorFK}',
            '${movimentacao.idClienteFK}',
            '${produtos[index].quantidade}',
            '${produtos[index].precoUnit}',
            '${movimentacao.idDepositoFK}',
            '${movimentacao.valorTotal}')`,
            function (error, result, field) {
                if (error) {                    
                    res.json(error);
                } else {
                    console.log("Gravado com sucesso!")                    
            } 
        });
    }  
                    //validaçao se a CFOP é de entrada ou de saida
                    query("SELECT * FROM cfop WHERE idCfop=" + movimentacao.idCfopFK, function (error, result, field) {
                        if (error) {
                            console.log(error)
                        } else {
                            saida = result[0].saida
                            console.log("cfop verificada")

                                for (let indexNew = 0; indexNew < produtos.length; indexNew++) {
                                    query("SELECT * FROM estoque WHERE idProdutoFK=" + produtos[indexNew].idProdutoFK + ' AND idDepositoFK=' + movimentacao.idDepositoFK, function (error, result, field) {
                                        if (error) {
                                            console.log(error)
                                        } else {
                                            //cria novo lançamento no estoque caso n tenha
                                            if(result.length == 0){
                                                console.log("este n ta lançado")
                                                query(`INSERT INTO estoque
                                                (idProdutoFK, qtdEstoque, idDepositoFK) 
                                                VALUES 
                                                (
                                                '${produtos[indexNew].idProdutoFK}',
                                                '${produtos[indexNew].quantidade}',
                                                '${movimentacao.idDepositoFK}')`,
                                                function (error, result, field) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log("estoque inserido!")
                                                    }
                                                })  
                                            }
                                            //atualiza estoque do produto
                                            else{
                                                if(saida == 0){
                                                    //caso seja entrada adiciona estoque
                                                    novoEstoque = result[0].qtdEstoque + produtos[indexNew].quantidade;
                                                    query("SELECT AVG(precoUnit) AS media FROM movimentacao WHERE idProdutoFK=" + produtos[indexNew].idProdutoFK, function (error, resultado, field) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            media = resultado[0].media.toFixed(3)
                                                            console.log(media);
                                                            filtro = ' WHERE idProduto= ' + parseInt(produtos[indexNew].idProdutoFK);
                                                            query(`UPDATE produto SET precoMedio = ('${media}')` + filtro,
                                                            function (error, result, field) {
                                                                if (error) {
                                                                console.log(error);
                                                                } else {
                                                                console.log("estoque inserido!")
                                                                }
                                                            })
                                                        }
                                                    });
                                                }
                                                else{
                                                    //caso seja saida subtrai estoque
                                                    novoEstoque = result[0].qtdEstoque - produtos[indexNew].quantidade;
                                                    console.log("Nota fiscal de Saída!")
                                                }
                                                
                                                filter = ' WHERE idProdutoFK = ' + parseInt(produtos[indexNew].idProdutoFK) +' AND idDepositoFK = ' + result[0].idDepositoFK;
                                                query(`UPDATE estoque SET qtdEstoque = ('${novoEstoque}')` + filter,
                                                function (error, result, field) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log("estoque inserido!")
                                                    }
                                                })
                                            }
                                        
                                        }
                                    });
                                }   
                            }                     
                        });
                res.json("Movimentação atualizada!");
            }
        }
                
        
        
 


