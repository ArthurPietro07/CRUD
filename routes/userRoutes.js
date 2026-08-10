const express = require('express');
const router = express.Router();
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// ROTA LISTAR - IGUAL CATEGORIA
router.get('/', requireLogin, async (req, res) => {
    try {
        const users = await User.getAll();
        res.render('users/index', { 
            users: users || [],
            search: '',
            title: 'Lista de Usuários'
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao listar usuários');
    }
});

// ROTA SEARCH
router.get('/search', requireLogin, async (req, res) => {
    try {
        const { search } = req.query;
        const users = await User.searchByName(search);
        res.render('users/index', { 
            users: users || [],
            search: search || '',
            title: 'Resultado da Busca'
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao buscar usuários');
    }
});

// ROTA NEW - IGUAL CATEGORIA (SIMPLIFICADA)
router.get('/new', requireLogin, requireAdmin, (req, res) => {
    console.log('🟢 /users/new acessado!');
    res.render('users/create', { 
        title: 'Criar Usuário',
        user: null,
        errors: null
    });
});

// ROTA POST - IGUAL CATEGORIA
router.post('/', requireLogin, requireAdmin, async (req, res) => {
    try {
        console.log('📝 POST /users recebido!');
        console.log('📦 Dados:', req.body);
        
        const { username, password, role } = req.body;
        
        if (!username || !password) {
            return res.render('users/create', {
                title: 'Criar Usuário',
                user: { username, role },
                errors: ['Usuário e senha são obrigatórios']
            });
        }

        const existing = await User.findByUsername(username);
        if (existing) {
            return res.render('users/create', {
                title: 'Criar Usuário',
                user: { username, role },
                errors: ['Este usuário já existe']
            });
        }

        await User.create({
            username,
            password,
            role: role || 'user'
        });

        console.log('✅ Usuário criado!');
        res.redirect('/users');
    } catch (error) {
        console.error('❌ Erro:', error);
        res.render('users/create', {
            title: 'Criar Usuário',
            user: req.body,
            errors: ['Erro ao criar usuário: ' + error.message]
        });
    }
});

// ROTA SHOW
router.get('/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('users/show', { 
            user,
            title: 'Detalhes do Usuário'
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao buscar usuário');
    }
});

// ROTA EDIT
router.get('/:id/edit', requireLogin, requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('users/edit', { 
            user,
            title: 'Editar Usuário',
            errors: null
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao buscar usuário');
    }
});

// ROTA UPDATE
router.put('/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const userId = req.params.id;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).send('Usuário não encontrado');
        }

        const updateData = {
            username: username || currentUser.username,
            role: role || currentUser.role
        };

        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        await User.update(userId, updateData);
        res.redirect('/users');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao atualizar usuário');
    }
});

// ROTA DELETE
router.delete('/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        if (parseInt(userId) === req.session.usuario.id) {
            return res.status(400).send('Não é possível deletar seu próprio usuário');
        }
        await User.delete(userId);
        res.redirect('/users');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao deletar usuário');
    }
});

module.exports = router;