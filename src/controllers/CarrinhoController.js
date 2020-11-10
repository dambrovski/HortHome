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
        carrinho = req.body;
        let erro = false;
        var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), 
        ano  = data.getFullYear();
        var dataCarrinho = ano+'/'+mes+'/'+dia

        filter = " WHERE idCarrinho=" + carrinho.idCarrinhoFK;        
        query("SELECT * FROM carrinho" + filter, function (error, result, field) {            
        if (result.length < 1){
            console.log("nao encontrei carrinho")
        //CRIA CARRINHO SE NÃO TIVER:

            reservaEstoque = 1;
            gerouPedido = 0;
            
            filter = " WHERE idProdutoFK= '" + carrinho.idProdutoFK;        
            query(`INSERT INTO carrinho
            (dataCarrinho, idUsuarioFK, reservaEstoque, valorTotal, gerouPedido) 
            VALUES 
            ('${dataCarrinho}', '${carrinho.idUsuarioFK}',
            '${reservaEstoque}', '${carrinho.precoUnit}', '${gerouPedido}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                    erro = true;
                } else {
                    carrinho.idCarrinhoFK = parseInt(result['insertId'])
                    console.log(carrinho.idCarrinhoFK)
                    console.log("Alerta: Iniciado novo Carrinho!");
                }
            });
        }
        else{
            console.log("carrinho já existe")
        }
        console.log(carrinho.idCarrinhoFK)
        //se não ser erro 
        if(!erro){
            filter = ' WHERE idCarrinhoFK=' + parseInt(carrinho.idCarrinhoFK) + ' AND idProdutoFK=' + parseInt(carrinho.idProdutoFK);
            query("SELECT * FROM itemCarrinho" + filter, function (error, result, field) {      
            if (result.length < 1){
                query(`INSERT INTO itemCarrinho
                (idCarrinhoFK, idProdutoFK, precoUnit, qtd) 
                VALUES 
                ('${carrinho.idCarrinhoFK}', '${carrinho.idProdutoFK}',
                '${carrinho.precoUnit}', '${carrinho.qtd}')`,
                function (error, result, field) {
                    if (error) {
                        res.json(error);
                    } else {
                        res.json("Alerta: Produto incluso no Carrinho com Sucesso!");
                    }
                })
                }else{
                    res.json("Erro: Produto já está no carrinho!");
                }
            });
          }
        });
    }
}