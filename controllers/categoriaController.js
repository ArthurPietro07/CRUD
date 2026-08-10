const Categoria = require('../models/categoriaModel');

const categoriaController = {
    // Listar todas as categorias
    listCategorias: async (req, res) => {
        try {
            const categorias = await Categoria.getAll();
            res.render('categorias/index', { 
                categorias,
                title: 'Lista de Categorias'
            });
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            res.status(500).send('Erro ao listar categorias');
        }
    },

    // Mostrar formulário de criação - CORRIGIDO
    showCreateForm: (req, res) => {
        res.render('categorias/create', { 
            title: 'Cadastrar Categoria',
            error: null  // <-- ADICIONAR error: null
        });
    },

    // Criar categoria
    createCategoria: async (req, res) => {
        try {
            const { nome } = req.body;
            
            if (!nome) {
                return res.render('categorias/create', {
                    title: 'Cadastrar Categoria',
                    error: 'Nome da categoria é obrigatório'  // <-- PASSA error
                });
            }

            await Categoria.create({ nome });
            res.redirect('/categorias');
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            res.render('categorias/create', {
                title: 'Cadastrar Categoria',
                error: error.message || 'Erro ao criar categoria'  // <-- PASSA error
            });
        }
    },

    // Mostrar detalhes da categoria
    showCategoria: async (req, res) => {
        try {
            const categoria = await Categoria.findById(req.params.id);
            if (!categoria) {
                return res.status(404).send('Categoria não encontrada');
            }
            res.render('categorias/show', { 
                categoria,
                title: 'Detalhes da Categoria'
            });
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            res.status(500).send('Erro ao buscar categoria');
        }
    },

    // Mostrar formulário de edição
    showEditForm: async (req, res) => {
        try {
            const categoria = await Categoria.findById(req.params.id);
            if (!categoria) {
                return res.status(404).send('Categoria não encontrada');
            }
            res.render('categorias/edit', { 
                categoria,
                title: 'Editar Categoria',
                error: null  // <-- ADICIONAR error: null
            });
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            res.status(500).send('Erro ao buscar categoria');
        }
    },

    // Atualizar categoria
    updateCategoria: async (req, res) => {
        try {
            const { nome } = req.body;
            const categoriaId = req.params.id;

            if (!nome) {
                const categoria = await Categoria.findById(categoriaId);
                return res.render('categorias/edit', {
                    categoria,
                    title: 'Editar Categoria',
                    error: 'Nome da categoria é obrigatório'  // <-- PASSA error
                });
            }

            await Categoria.update(categoriaId, { nome });
            res.redirect('/categorias');
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            res.status(500).send('Erro ao atualizar categoria');
        }
    },

    // Deletar categoria
    deleteCategoria: async (req, res) => {
        try {
            const categoriaId = req.params.id;
            const deleted = await Categoria.delete(categoriaId);
            
            if (!deleted) {
                return res.status(404).send('Categoria não encontrada');
            }

            res.redirect('/categorias');
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
            res.status(500).send('Erro ao deletar categoria');
        }
    }
};

module.exports = categoriaController;