const express = require('express');
const router = express.Router();
const VagaController = require('../Controller/VagaController');
router.get('/vagas', VagaController.getAllVagas);
router.get('/vagas/', VagaController.getVagaByCodigo);
router.post('/vagas', VagaController.createVaga);
router.put('/vagas/:codigo', VagaController.updateVaga);
router.delete('/vagas/:codigo', VagaController.deleteVaga);
router.patch('/vagas/:codigo/decrement', VagaController.decrementVagaQuantidade);
router.patch('/vagas/:codigo/increment', VagaController.incrementVagaQuantidade);
module.exports = router;

