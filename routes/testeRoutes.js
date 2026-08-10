const express = require('express');
const router = express.Router();

// Rota de teste
router.get('/teste', (req, res) => {
    console.log('🟢 ROTA DE TESTE FUNCIONOU!');
    res.send(`
        <h1>ROTA DE TESTE FUNCIONANDO!</h1>
        <p>Usuário logado: ${req.session.usuario ? req.session.usuario.username : 'Nenhum'}</p>
        <p>Role: ${req.session.usuario ? req.session.usuario.role : 'Nenhum'}</p>
        <a href="/categorias/new">Voltar para categorias/new</a>
    `);
});

module.exports = router;