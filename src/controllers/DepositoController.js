const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idDeposito) filter = ' WHERE idDeposito=' + parseInt(req.params.idDeposito);
        query("SELECT * FROM deposito" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        deposito = req.body;
            query(`INSERT INTO deposito
            (idLocalizacaoFK, idFilialFK) 
            VALUES 
            (
            '${deposito.idLocalizacaoFK}', '${deposito.idFilialFK}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: Depósito gravado com Sucesso!");
                }
            });
    }
}

