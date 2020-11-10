const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idCfop) filter = ' WHERE idCfop=' + parseInt(req.params.idCfop);
        query("SELECT * FROM cfop" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        cfop = req.body;
        cfopExiste = true;

        filter = " WHERE codigoCfop= '" + cfop.codigoCfop;        
        query("SELECT * FROM cfop" + filter + "'", function (error, result, field) {
            
        if (result.length < 1){
            query(`INSERT INTO cfop
            (codigoCfop, saida, descricao) 
            VALUES 
            ('${cfop.codigoCfop}', '${cfop.saida}', '${cfop.descricao}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: CFOP cadastrada com Sucesso!");
                }
            })
        }else{
            cfopExiste = true;
            res.json("Erro: Código de Natureza de Operação já cadastrado!");
        }
        });
    }
}