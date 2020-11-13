const {query} = require('../database/connectionMysql');



module.exports = {
    index(req, res){
        let filter = '';
        console.log(req.headers.authorization)
        if(req.headers.authorization) filter = ' WHERE a.idUsuarioFK = ' + parseInt(req.headers.authorization) + ' AND a.gerouPedido = 0  ';
        query("SELECT a.idCarrinho, a.dataCarrinho,a.valorTotal, a.reservaEstoque, b.idProdutoFK,c.email, d.descricao FROM carrinho AS a INNER JOIN itemCarrinho AS b ON a.idCarrinho = b.idCarrinhoFK INNER JOIN usuario AS c ON a.idUsuarioFK = c.idUsuario INNER JOIN produto AS d ON d.idProduto = b.idProdutoFK" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },
 

    delete(req, res){
        let filter = '';
        filter = ' WHERE idCarrinhoFK=' + parseInt(req.params.idCarrinhoFK) + ' AND idProdutoFK=' + parseInt(req.params.idProdutoFK);
        console.log(filter)
        query("SELECT * FROM itemCarrinho" + filter, function (error, result, field) {
            console.log(result)
            if (result.length > 0){
                query("DELETE FROM itemCarrinho" + filter, function (error, result, field) {
                    if (error) {
                        console.log("erro")
                        res.json("Erro na exclusão!");
                    } else {  
                        console.log(filter)           
                        res.json("Item deletado do Carrinho!")
                    }
                });                        
            }
            else{
                res.json("Item não localizado no Carrinho!")
            }
        });
    },

    create(req, res){
        //recuperando dados do pedido
        pedido = req.body;
        let erro = false;


        //criando data
        var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), 
        ano  = data.getFullYear();
        var dataPedido = ano+'/'+mes+'/'+dia
        //finalizando data

        //valida se já foi gerado pedido
        filter = ' WHERE idUsuarioFK=' + pedido.idUsuarioFK + ' AND pgtoFinalizado=0 AND pedFinalizado=0';
        query("SELECT * FROM pedido" + filter, function (error, result, field) { 
            if (result.length < 1){
                query(`INSERT INTO pedido
                (idCarrinhoFK, idUsuarioFK, dataPedido, valorTotal) 
                VALUES 
                ('${pedido.idCarrinhoFK}', '${pedido.idUsuarioFK}',
                '${dataPedido}', '${pedido.valorTotal}')`,
                function (error, result, field) {
                    if (error) {
                        res.json(error);
                        erro = true;
                    } else {
                        //gravar os itens do carrinho no itempedido
                        filter = ' WHERE idCarrinhoFK=' + pedido.idCarrinhoFK;
                        query("SELECT * FROM itemCarrinho" + filter, function (error, result, field) { 

                            result.forEach(dado => {
                                query(`INSERT INTO pedido
                                (idCarrinhoFK, idUsuarioFK, dataPedido, valorTotal) 
                                VALUES 
                                ('${dado.idCarrinhoFK}', '${dado.idProdutoFK}',
                                '${dado.precoUnit}', '${dado.qtd}')`,
                                function (error, result, field) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("item incluso na itempedido");
                                }
                            });
                        });
                            //id do produto: console.log(result[0].idProdutoFK)
                            //tamanho do array: console.log(result.length)
                            console.log("ok")
                        });
                        //caso de tudo certo, só manda um comando de update para o
                        //carrinho, pra que ele marque como pedido gerado
                        filter = ' WHERE idCarrinho = ' + pedido.idCarrinhoFK;
                        query(`UPDATE carrinho SET gerouPedido = 1` + filter,
                        function (error, results, field) {
                        if (error) {
                            console.log(error);
                            res.json("Erro!")
                        } else {
                            res.json("Alerta: Iniciado novo pedido!")
                    }
                                            
                });
            }

        }); 
    }
    else {
        res.json("Já existe um pedido em andamento, favor finalize o mesmo antes de iniciar um novo!.")
    }
}); 
    
}
}