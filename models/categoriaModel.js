// Mock do banco de dados para categorias
const mockDBCategorias = {
    categorias: [
        { id: 1, nome: 'Eletrônicos' },
        { id: 2, nome: 'Roupas' },
        { id: 3, nome: 'Alimentos' }
    ],
    nextId: 4
};

const Categoria = {
    // Criar categoria
    create: (categoriaData) => {
        const { nome } = categoriaData;
        
        // Verifica se já existe
        const existing = mockDBCategorias.categorias.find(c => c.nome.toLowerCase() === nome.toLowerCase());
        if (existing) {
            throw new Error('Categoria já existe');
        }
        
        const newCategoria = {
            id: mockDBCategorias.nextId++,
            nome
        };
        
        mockDBCategorias.categorias.push(newCategoria);
        return newCategoria;
    },
    
    // Buscar por ID
    findById: (id) => {
        return new Promise((resolve) => {
            const categoria = mockDBCategorias.categorias.find(c => c.id === parseInt(id)) || null;
            resolve(categoria);
        });
    },
    
    // Buscar por nome
    findByNome: (nome) => {
        return new Promise((resolve) => {
            const categoria = mockDBCategorias.categorias.find(c => c.nome.toLowerCase() === nome.toLowerCase()) || null;
            resolve(categoria);
        });
    },
    
    // Atualizar categoria
    update: (id, categoriaData) => {
        return new Promise((resolve) => {
            const index = mockDBCategorias.categorias.findIndex(c => c.id === parseInt(id));
            if (index === -1) {
                resolve(null);
                return;
            }
            
            const categoria = mockDBCategorias.categorias[index];
            mockDBCategorias.categorias[index] = { ...categoria, ...categoriaData };
            resolve(mockDBCategorias.categorias[index]);
        });
    },
    
    // Deletar categoria
    delete: (id) => {
        return new Promise((resolve) => {
            const index = mockDBCategorias.categorias.findIndex(c => c.id === parseInt(id));
            if (index === -1) {
                resolve(false);
                return;
            }
            
            mockDBCategorias.categorias.splice(index, 1);
            resolve(true);
        });
    },
    
    // Listar todas
    getAll: () => {
        return new Promise((resolve) => {
            resolve(mockDBCategorias.categorias);
        });
    }
};

module.exports = Categoria;