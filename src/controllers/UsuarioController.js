const {query} = require('../database/connectionMysql');

module.exports = {
    index(req, res){
        let filter = '';
        if(req.params.idUsuario) filter = ' WHERE idUsuario=' + parseInt(req.params.idUsuario);
        query("SELECT * FROM usuario" + filter, function (error, result, field) {
            if (error) {
                res.json(error);
            } else {
                res.json(result);
            }
        });
    },

    create(req, res){
        usuario = req.body;
        usuarioExiste = true;

        filter = " WHERE email= '" + usuario.email;        
        query("SELECT * FROM usuario" + filter + "'", function (error, result, field) {
            
        if (result.length < 1){
            query(`INSERT INTO usuario
            (email, cartao, senha) 
            VALUES 
            ('${usuario.email}', '${usuario.cartao}', '${usuario.senha}')`,
            function (error, result, field) {
                if (error) {
                    res.json(error);
                } else {
                    res.json("Alerta: Usuario cadastrado com Sucesso!");
                }
            })
        }else{
            usuarioExiste = true;
            res.json("Erro: Usuario já cadastrado!");
        }
        });
    }
}