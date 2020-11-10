const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idFornecedor) filter = ' WHERE idFornecedor=' + parseInt(req.params.idFornecedor);
        query("SELECT * FROM fornecedor" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        fornecedor = req.body;
        fornecedorExiste = true;

        filter = " WHERE razaoSocial= '" + fornecedor.razaoSocial;        
        query("SELECT * FROM fornecedor" + filter + "'", function (error, result, field) {
            
        if (result.length < 1){
            query(`INSERT INTO fornecedor
            (razaoSocial) 
            VALUES 
            ('${fornecedor.razaoSocial}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: fornecedor cadastrado com Sucesso!");
                }
            })  
        }else{
            fornecedorExiste = true;
            res.json("Erro: fornecedor já cadastrado!");
        }
        });
    }
}