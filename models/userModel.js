// Mock do banco de dados em memória
const mockDB = {
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'user', password: 'user123', role: 'user' }
    ],
    nextId: 3
};

// Funções para manipular usuários
const User = {
    // Criar usuário
    create: (userData) => {
        const { username, password, role } = userData;
        
        // Verifica se já existe
        const existing = mockDB.users.find(u => u.username === username);
        if (existing) {
            throw new Error('Usuário já existe');
        }
        
        const newUser = {
            id: mockDB.nextId++,
            username,
            password,
            role: role || 'user'
        };
        
        mockDB.users.push(newUser);
        return newUser;
    },
    
    // Buscar por ID
    findById: (id) => {
        return new Promise((resolve) => {
            const user = mockDB.users.find(u => u.id === parseInt(id)) || null;
            resolve(user);
        });
    },
    
    // Buscar por username
    findByUsername: (username) => {
        return new Promise((resolve) => {
            const user = mockDB.users.find(u => u.username === username) || null;
            resolve(user);
        });
    },
    
    // Atualizar usuário
    update: (id, userData) => {
        return new Promise((resolve) => {
            const index = mockDB.users.findIndex(u => u.id === parseInt(id));
            if (index === -1) {
                resolve(null);
                return;
            }
            
            const user = mockDB.users[index];
            mockDB.users[index] = { ...user, ...userData };
            resolve(mockDB.users[index]);
        });
    },
    
    // Deletar usuário
    delete: (id) => {
        return new Promise((resolve) => {
            const index = mockDB.users.findIndex(u => u.id === parseInt(id));
            if (index === -1) {
                resolve(false);
                return;
            }
            
            mockDB.users.splice(index, 1);
            resolve(true);
        });
    },
    
    // Listar todos
    getAll: () => {
        return new Promise((resolve) => {
            resolve(mockDB.users);
        });
    },
    
    // Buscar por nome
    searchByName: (searchTerm) => {
        return new Promise((resolve) => {
            if (!searchTerm) {
                resolve(mockDB.users);
                return;
            }
            const results = mockDB.users.filter(u => 
                u.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
            resolve(results);
        });
    }
};

module.exports = User;