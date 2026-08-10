const Produto = require('../models/produtoModel');
const Categoria = require('../models/categoriaModel');

const produtoController = {
    // Listar todos os produtos
    listProdutos: async (req, res) => {
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
            console.error('Erro ao listar produtos:', error);
            res.status(500).send('Erro ao listar produtos');
        }
    },

    // Mostrar formulário de criação - IGUAL À CATEGORIA
    showCreateForm: async (req, res) => {
        try {
            const categorias = await Categoria.getAll();
            res.render('produtos/create', { 
                categorias,
                title: 'Cadastrar Produto',
                error: null  // <-- IGUAL À CATEGORIA
            });
        } catch (error) {
            console.error('Erro ao carregar formulário:', error);
            res.status(500).send('Erro ao carregar formulário');
        }
    },

    // Criar produto - IGUAL À CATEGORIA
    createProduto: async (req, res) => {
        try {
            const { nome, descricao, preco, quantidade, categoria } = req.body;
            
            if (!nome || !descricao || !preco || !quantidade || !categoria) {
                const categorias = await Categoria.getAll();
                return res.render('produtos/create', {
                    categorias,
                    title: 'Cadastrar Produto',
                    error: 'Todos os campos são obrigatórios'  // <-- IGUAL À CATEGORIA
                });
            }

            await Produto.create({
                nome,
                descricao,
                preco: parseFloat(preco),
                quantidade: parseInt(quantidade),
                categoria_id: parseInt(categoria)
            });

            res.redirect('/produtos');
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            const categorias = await Categoria.getAll();
            res.render('produtos/create', {
                categorias,
                title: 'Cadastrar Produto',
                error: error.message || 'Erro ao criar produto'  // <-- IGUAL À CATEGORIA
            });
        }
    },

    // Mostrar detalhes do produto
    showProduto: async (req, res) => {
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
            console.error('Erro ao buscar produto:', error);
            res.status(500).send('Erro ao buscar produto');
        }
    },

    // Mostrar formulário de edição - IGUAL À CATEGORIA
    showEditForm: async (req, res) => {
        try {
            const produto = await Produto.findById(req.params.id);
            if (!produto) {
                return res.status(404).send('Produto não encontrado');
            }

            const categorias = await Categoria.getAll();
            res.render('produtos/edit', { 
                produto,
                categorias,
                title: 'Editar Produto',
                error: null  // <-- IGUAL À CATEGORIA
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).send('Erro ao buscar produto');
        }
    },

    // Atualizar produto - IGUAL À CATEGORIA
    updateProduto: async (req, res) => {
        try {
            const { nome, descricao, preco, quantidade, categoria } = req.body;
            const produtoId = req.params.id;

            if (!nome || !descricao || !preco || !quantidade || !categoria) {
                const produto = await Produto.findById(produtoId);
                const categorias = await Categoria.getAll();
                return res.render('produtos/edit', {
                    produto,
                    categorias,
                    title: 'Editar Produto',
                    error: 'Todos os campos são obrigatórios'  // <-- IGUAL À CATEGORIA
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
            console.error('Erro ao atualizar produto:', error);
            res.status(500).send('Erro ao atualizar produto');
        }
    },

    // Deletar produto
    deleteProduto: async (req, res) => {
        try {
            const produtoId = req.params.id;
            const deleted = await Produto.delete(produtoId);
            
            if (!deleted) {
                return res.status(404).send('Produto não encontrado');
            }

            res.redirect('/produtos');
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            res.status(500).send('Erro ao deletar produto');
        }
    }
};

module.exports = produtoController;