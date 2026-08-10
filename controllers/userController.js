const User = require('../models/userModel');

const userController = {
    // Listar todos os usuários
    listUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.render('users/index', { 
                users,
                search: '',
                title: 'Lista de Usuários'
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).send('Erro ao listar usuários');
        }
    },

    // Buscar usuários
    searchUsers: async (req, res) => {
        try {
            const { search } = req.query;
            const users = await User.searchByName(search);
            res.render('users/index', { 
                users,
                search: search || '',
                title: 'Resultado da Busca'
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        }
    },

    // Mostrar formulário de criação - IGUAL À CATEGORIA
    showCreateForm: (req, res) => {
        res.render('users/create', { 
            title: 'Criar Usuário',
            user: null,
            errors: null  // <-- IGUAL À CATEGORIA (mas com errors)
        });
    },

    // Criar usuário - IGUAL À CATEGORIA
    createUser: async (req, res) => {
        try {
            const { username, password, role } = req.body;
            
            if (!username || !password) {
                return res.render('users/create', {
                    title: 'Criar Usuário',
                    user: { username, role },
                    errors: ['Usuário e senha são obrigatórios']  // <-- IGUAL À CATEGORIA
                });
            }

            const existing = await User.findByUsername(username);
            if (existing) {
                return res.render('users/create', {
                    title: 'Criar Usuário',
                    user: { username, role },
                    errors: ['Este usuário já existe']  // <-- IGUAL À CATEGORIA
                });
            }

            await User.create({
                username,
                password,
                role: role || 'user'
            });

            res.redirect('/users');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.render('users/create', {
                title: 'Criar Usuário',
                user: req.body,
                errors: ['Erro ao criar usuário: ' + error.message]  // <-- IGUAL À CATEGORIA
            });
        }
    },

    // Mostrar detalhes do usuário
    showUser: async (req, res) => {
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
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send('Erro ao buscar usuário');
        }
    },

    // Mostrar formulário de edição - IGUAL À CATEGORIA
    showEditForm: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.render('users/edit', { 
                user,
                title: 'Editar Usuário',
                errors: null  // <-- IGUAL À CATEGORIA
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send('Erro ao buscar usuário');
        }
    },

    // Atualizar usuário - IGUAL À CATEGORIA
    updateUser: async (req, res) => {
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
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).send('Erro ao atualizar usuário');
        }
    },

    // Deletar usuário
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            
            if (parseInt(userId) === req.session.usuario.id) {
                return res.status(400).send('Não é possível deletar seu próprio usuário');
            }

            const deleted = await User.delete(userId);
            if (!deleted) {
                return res.status(404).send('Usuário não encontrado');
            }

            res.redirect('/users');
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).send('Erro ao deletar usuário');
        }
    }
};

module.exports = userController;