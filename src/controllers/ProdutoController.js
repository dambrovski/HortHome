const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idProduto) filter = ' WHERE idProduto=' + parseInt(req.params.idProduto);
        query("SELECT * FROM produto" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },


    indexPorDeposito(req, res){
        let filter = '';
        if(req.params.idDepositoFK) filter = ' WHERE a.idDepositoFK=' + parseInt(req.params.idDepositoFK);
        console.log(req.params.idDepositoFK)
        query("SELECT a.idProdutoFK, a.qtdEstoque, a.idDepositoFK, b.descricao, b.preco, c.terceiros, c.idFilialFK FROM estoque AS a INNER JOIN produto AS b ON a.idProdutoFK = b.idProduto INNER JOIN deposito AS c ON c.idDeposito = a.idDepositoFK" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    indexPorLocalizacao(req, res){
        let filter = '';
        if(req.params.idLocalizacaoFK) filter = ' WHERE d.idLocalizacao=' + parseInt(req.params.idLocalizacaoFK);
        query("SELECT a.idProdutoFK, a.qtdEstoque, a.idDepositoFK, b.descricao, b.preco, c.terceiros, c.idFilialFK, d.idLocalizacao, d.cep FROM estoque AS a INNER JOIN produto AS b ON a.idProdutoFK = b.idProduto INNER JOIN deposito AS c ON c.idDeposito = a.idDepositoFK INNER JOIN localizacao AS d ON c.idLocalizacaoFK = d.idLocalizacao " + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    indexEstoqueFilial(req, res){
        let filter = '';
        console.log(req.params.idFilial);
        if(req.params.idFilial) filter = ' WHERE b.idFilialFK=' + parseInt(req.params.idFilial);
        query("SELECT a.idProdutoFK, a.qtdEstoque, b.idLocalizacaoFK, b.terceiros FROM estoque AS a INNER JOIN deposito AS b ON a.idDepositoFK = b.idDeposito " + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    indexEstoqueFilialProduto(req, res){
        let filter = '';        
        if(req.params.idFilial) filter = ' WHERE b.idFilialFK=' + parseInt(req.params.idFilial) + ' AND a.idProdutoFK=' + parseInt(req.params.idProduto);
        query("SELECT a.idProdutoFK, a.qtdEstoque, b.idLocalizacaoFK, b.idFilialFK, b.terceiros FROM estoque AS a INNER JOIN deposito AS b ON a.idDepositoFK = b.idDeposito " + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        produto = req.body;
        produtoExiste = true;

        filter = " WHERE descricao= '" + produto.descricao ;        
        query("SELECT * FROM produto" + filter + "'", function (error, result, field) {
            
        if (result.length < 1){
            query(`INSERT INTO produto
            (descricao, precoUnit, qtdEstoque) 
            VALUES 
            (
            '${produto.descricao}', '${produto.precoUnit}', '${produto.qtdEstoque}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: Produto cadastrado com Sucesso!");
                }
            })
        }else{
            produtoExiste = true;
            res.json("Erro: Produto já cadastrado!");
        }
        });
    },

    createEmbalagem(req, res){
        produto = req.body;
        produtoExiste = true;
        
        filter = " WHERE idProduto= '" + produto.idEmbalagem ;        
        query("SELECT * FROM produto" + filter + "'", function (error, result, field) {
        if (result.length > 0){
            query(`INSERT INTO produto
            (descricao, preco, unidade, qtdUnidade, idFilialFK, idFornecedorFK, idEmbalagem) 
            VALUES 
            (
            '${produto.descricao}','${produto.preco}',
            '${produto.unidade}','${produto.qtdUnidade}',
            '${produto.idFilialFK}','${produto.idFornecedorFK}',
            '${produto.idEmbalagem}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: Embalagem de Produto cadastrado com Sucesso!");
                }
            })
        }else{
            produtoExiste = true;
            res.json("Alerta: Produto não localizado!");
        }
        });
    }
}