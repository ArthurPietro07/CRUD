const jwt = require('jsonwebtoken');

const requireLogin = (req, res, next) => {
    // Verifica se tem usuário na requisição (vindo do middleware)
    if (!req.usuario) {
        return res.redirect('/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(403).render('erro', { 
            mensagem: 'Acesso negado. Requer permissão de administrador.',
            title: 'Acesso Negado'
        });
    }
    next();
};

// Middleware para verificar token via API (para requisições AJAX/Fetch)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = { requireLogin, requireAdmin, verifyToken };