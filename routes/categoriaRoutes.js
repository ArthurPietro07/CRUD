const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

// ATENÇÃO: A ROTA /new DEVE VIR ANTES DA ROTA /:id
// Senão o Express vai interpretar "new" como um ID

// Rotas específicas PRIMEIRO
router.get('/new', requireLogin, requireAdmin, categoriaController.showCreateForm);
router.post('/', requireLogin, requireAdmin, categoriaController.createCategoria);

// Depois as rotas com parâmetros
router.get('/', requireLogin, categoriaController.listCategorias);
router.get('/:id', requireLogin, categoriaController.showCategoria);
router.get('/:id/edit', requireLogin, requireAdmin, categoriaController.showEditForm);
router.put('/:id', requireLogin, requireAdmin, categoriaController.updateCategoria);
router.delete('/:id', requireLogin, requireAdmin, categoriaController.deleteCategoria);

module.exports = router;