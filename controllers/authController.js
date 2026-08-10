const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const exibirLogin = (req, res) => {
    // Se já estiver logado, redireciona
    if (req.usuario) {
        return res.redirect('/');
    }
    res.render('login', { 
        layout: false,
        error: null
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca usuário pelo username
        const user = await User.findByUsername(username);

        if (!user) {
            return res.render('login', { 
                layout: false,
                error: 'Usuário não encontrado' 
            });
        }

        // Verifica senha
        if (user.password !== password) {
            return res.render('login', { 
                layout: false,
                error: 'Senha incorreta' 
            });
        }

        // Cria payload do JWT
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        // Gera token JWT
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Salva token em cookie HTTP-only (mais seguro)
        res.cookie('token', token, {
            httpOnly: true, // Não acessível via JavaScript
            secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
            maxAge: 3600000 // 1 hora em milissegundos
        });

        // Redireciona para página inicial
        res.redirect('/');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { 
            layout: false,
            error: 'Erro ao fazer login. Tente novamente.' 
        });
    }
};

const logout = (req, res) => {
    // Remove o cookie com o token
    res.clearCookie('token');
    res.redirect('/login');
};

// Função para gerar token via API (para integrações)
const gerarTokenAPI = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '1h' }
        );

        res.json({ 
            success: true, 
            token,
            user: payload
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar token' });
    }
};

module.exports = { exibirLogin, login, logout, gerarTokenAPI };