// Mock do banco de dados para produtos
const mockDBProdutos = {
    produtos: [
        { 
            id: 1, 
            nome: 'Smartphone', 
            descricao: 'Smartphone Android 128GB', 
            preco: 1999.99, 
            quantidade: 10,
            categoria_id: 1 
        },
        { 
            id: 2, 
            nome: 'Camiseta', 
            descricao: 'Camiseta de algodão', 
            preco: 49.99, 
            quantidade: 50,
            categoria_id: 2 
        }
    ],
    nextId: 3
};

const Produto = {
    // Criar produto
    create: (produtoData) => {
        console.log('📦 Produto.create chamado com:', produtoData);
        const { nome, descricao, preco, quantidade, categoria_id } = produtoData;
        
        const newProduto = {
            id: mockDBProdutos.nextId++,
            nome,
            descricao,
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade),
            categoria_id: parseInt(categoria_id)
        };
        
        mockDBProdutos.produtos.push(newProduto);
        console.log('✅ Produto criado:', newProduto);
        return newProduto;
    },
    
    // Buscar por ID
    findById: (id) => {
        return new Promise((resolve) => {
            const produto = mockDBProdutos.produtos.find(p => p.id === parseInt(id)) || null;
            resolve(produto);
        });
    },
    
    // Atualizar produto
    update: (id, produtoData) => {
        return new Promise((resolve) => {
            const index = mockDBProdutos.produtos.findIndex(p => p.id === parseInt(id));
            if (index === -1) {
                resolve(null);
                return;
            }
            
            const produto = mockDBProdutos.produtos[index];
            mockDBProdutos.produtos[index] = { 
                ...produto, 
                ...produtoData,
                preco: parseFloat(produtoData.preco || produto.preco),
                quantidade: parseInt(produtoData.quantidade || produto.quantidade),
                categoria_id: parseInt(produtoData.categoria_id || produto.categoria_id)
            };
            resolve(mockDBProdutos.produtos[index]);
        });
    },
    
    // Deletar produto
    delete: (id) => {
        return new Promise((resolve) => {
            const index = mockDBProdutos.produtos.findIndex(p => p.id === parseInt(id));
            if (index === -1) {
                resolve(false);
                return;
            }
            
            mockDBProdutos.produtos.splice(index, 1);
            resolve(true);
        });
    },
    
    // Listar todos (com opção de filtro por categoria)
    getAll: (categoriaId = null) => {
        return new Promise((resolve) => {
            let produtos = mockDBProdutos.produtos;
            if (categoriaId) {
                produtos = produtos.filter(p => p.categoria_id === parseInt(categoriaId));
            }
            resolve(produtos);
        });
    },
    
    // Buscar produtos por nome
    searchByName: (searchTerm) => {
        return new Promise((resolve) => {
            if (!searchTerm) {
                resolve(mockDBProdutos.produtos);
                return;
            }
            const results = mockDBProdutos.produtos.filter(p => 
                p.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            resolve(results);
        });
    }
};

module.exports = Produto;