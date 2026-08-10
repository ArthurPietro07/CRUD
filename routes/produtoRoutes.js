const express = require('express');
const router = express.Router();
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');
const Categoria = require('../models/categoriaModel');
const Produto = require('../models/produtoModel');

// ROTA LISTAR - IGUAL CATEGORIA
router.get('/', requireLogin, async (req, res) => {
    try {
        const { categoria } = req.query;
        const produtos = await Produto.getAll(categoria);
        const categorias = await Categoria.getAll();
        
        const produtosComCategoria = produtos.map(produto => {
            const categoriaEncontrada = categorias.find(c => c.id === produto.categoria_id);
            return {
                ...produto,
                categoria_nome: categoriaEncontrada ? categoriaEncontrada.nome : 'Sem categoria'
            };
        });

        res.render('produtos/index', { 
            produtos: produtosComCategoria,
            categorias,
            categoriaSelecionada: categoria || '',
            title: 'Lista de Produtos'
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao listar produtos');
    }
});

// ROTA NEW - IGUAL CATEGORIA (SIMPLIFICADA)
router.get('/new', requireLogin, requireAdmin, async (req, res) => {
    try {
        const categorias = await Categoria.getAll();
        console.log('🟢 /produtos/new acessado!');
        console.log('📦 Categorias:', categorias);
        res.render('produtos/create', { 
            categorias: categorias || [],
            title: 'Cadastrar Produto',
            error: null
        });
    } catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).send('Erro ao carregar formulário: ' + error.message);
    }
});

// ROTA POST - IGUAL CATEGORIA
router.post('/', requireLogin, requireAdmin, async (req, res) => {
    try {
        console.log('📝 POST /produtos recebido!');
        console.log('📦 Dados:', req.body);
        
        const { nome, descricao, preco, quantidade, categoria } = req.body;
        
        if (!nome || !descricao || !preco || !quantidade || !categoria) {
            const categorias = await Categoria.getAll();
            return res.render('produtos/create', {
                categorias: categorias || [],
                title: 'Cadastrar Produto',
                error: 'Todos os campos são obrigatórios'
            });
        }

        await Produto.create({
            nome,
            descricao,
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade),
            categoria_id: parseInt(categoria)
        });

        console.log('✅ Produto criado!');
        res.redirect('/produtos');
    } catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).send('Erro ao criar produto: ' + error.message);
    }
});

// ROTA SHOW
router.get('/:id', requireLogin, async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        const categorias = await Categoria.getAll();
        const categoriaEncontrada = categorias.find(c => c.id === produto.categoria_id);
        produto.categoria_nome = categoriaEncontrada ? categoriaEncontrada.nome : 'Sem categoria';
        res.render('produtos/show', { 
            produto,
            title: 'Detalhes do Produto'
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao buscar produto');
    }
});

// ROTA EDIT
router.get('/:id/edit', requireLogin, requireAdmin, async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }
        const categorias = await Categoria.getAll();
        res.render('produtos/edit', { 
            produto,
            categorias: categorias || [],
            title: 'Editar Produto',
            error: null
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao buscar produto');
    }
});

// ROTA UPDATE
router.put('/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        const { nome, descricao, preco, quantidade, categoria } = req.body;
        const produtoId = req.params.id;

        if (!nome || !descricao || !preco || !quantidade || !categoria) {
            const produto = await Produto.findById(produtoId);
            const categorias = await Categoria.getAll();
            return res.render('produtos/edit', {
                produto,
                categorias: categorias || [],
                title: 'Editar Produto',
                error: 'Todos os campos são obrigatórios'
            });
        }

        await Produto.update(produtoId, {
            nome,
            descricao,
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade),
            categoria_id: parseInt(categoria)
        });

        res.redirect('/produtos');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao atualizar produto');
    }
});

// ROTA DELETE
router.delete('/:id', requireLogin, requireAdmin, async (req, res) => {
    try {
        await Produto.delete(req.params.id);
        res.redirect('/produtos');
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao deletar produto');
    }
});

module.exports = router;