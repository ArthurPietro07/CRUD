const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.exibirLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rota para gerar token via API (opcional)
router.post('/api/login', authController.gerarTokenAPI);

module.exports = router;