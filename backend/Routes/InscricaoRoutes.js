const express = require('express');
const router = express.Router();
const InscricaoController = require('../Controller/InscricaoController');


router.get('/inscricoes/vaga/:codigoVaga', InscricaoController.getInscricoesByVaga);


router.get('/inscricoes', InscricaoController.getAllInscricoes);
router.get('/inscricoes/:cpf/:codigo', InscricaoController.getInscricaoByIds);
router.post('/inscricoes', InscricaoController.createInscricao);
router.delete('/inscricoes/:cpf/:codigo', InscricaoController.deleteInscricao);

module.exports = router;
