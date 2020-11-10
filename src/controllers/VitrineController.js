const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idVitrine) filter = ' WHERE idVitrine=' + parseInt(req.params.idVitrine);
        query("SELECT a.idProdutoFK, b.descricao, b.precoUnit, b.qtdEstoque FROM vitrine AS a INNER JOIN produto AS b ON a.idProdutoFK = b.idProduto" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        vitrine = req.body;
        vitrineProdutoExiste = true;

        filter = " WHERE idProdutoFK= '" + vitrine.idProdutoFK;        
        query("SELECT * FROM vitrine" + filter + "'", function (error, result, field) {
            
        if (result.length < 1){
            query(`INSERT INTO vitrine
            (idProdutoFK) 
            VALUES 
            ('${vitrine.idProdutoFK}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: Produto incluso na Vitrine com Sucesso!");
                }
            })
        }else{
            vitrineProdutoExiste = true;
            res.json("Erro: Produto já está na Vitrine!");
        }
        });
    }
}