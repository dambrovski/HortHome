const express = require('express');
const cors = require('cors')

const ProdutoController = require('./controllers/ProdutoController');
const VitrineController = require('./controllers/VitrineController');
const UsuarioController = require('./controllers/UsuarioController');
const CarrinhoController = require('./controllers/CarrinhoController');

const FornecedorController = require('./controllers/FornecedorController');
const CfopController = require('./controllers/CfopController');
const MovimentacaoController = require('./controllers/MovimentacaoController');

const DepositoController = require('./controllers/DepositoController');



const routes = express.Router();

routes.get('/', ProdutoController.index);

routes.post('/produto', ProdutoController.create);
routes.get('/produto', ProdutoController.index);

//routes.post('/produto/embalagem', ProdutoController.createEmbalagem);
//routes.get('/produto/estoqueFilial/:idFilial', ProdutoController.indexEstoqueFilial);
//routes.get('/produto/estoqueFilial/:idFilial/:idProduto', ProdutoController.indexEstoqueFilialProduto);
//routes.get('/produto/estoqueDeposito/:idDepositoFK', ProdutoController.indexPorDeposito);
//routes.get('/produto/estoqueLocalizacao/:idLocalizacaoFK', ProdutoController.indexPorLocalizacao);


routes.post('/fornecedor', FornecedorController.create);
routes.get('/fornecedor', FornecedorController.index);

routes.post('/cfop', CfopController.create);
routes.get('/cfop', CfopController.index);

routes.post('/movimentacao', MovimentacaoController.create);
routes.get('/movimentacao', MovimentacaoController.index);

routes.post('/vitrine', VitrineController.create);
routes.get('/vitrine', VitrineController.index);

routes.post('/deposito', DepositoController.create);
routes.get('/deposito', DepositoController.index);

routes.post('/carrinho', CarrinhoController.create);
routes.get('/carrinho', CarrinhoController.index);
routes.delete('/carrinho/delete/:idCarrinhoFK/:idProdutoFK', CarrinhoController.delete);

routes.post('/usuario', UsuarioController.create);
routes.get('/usuario', UsuarioController.index);


module.exports = routes;





