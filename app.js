require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const layouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 8080;

// Middleware para parsear cookies
app.use(cookieParser());

// Configuração para parsear JSON e URL encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Configuração EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(layouts);
app.use(express.static('public'));

// Middleware para verificar token JWT e disponibilizar usuário
app.use((req, res, next) => {
    // Pega o token do cookie
    const token = req.cookies.token;
    
    if (token) {
        try {
            // Verifica e decodifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
            req.usuario = decoded;
            res.locals.usuario = decoded;
        } catch (error) {
            // Token inválido ou expirado
            res.clearCookie('token');
            req.usuario = null;
            res.locals.usuario = null;
        }
    } else {
        req.usuario = null;
        res.locals.usuario = null;
    }
    next();
});

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const indexRoutes = require('./routes/indexRoutes');

// Middleware de proteção
const { requireLogin, requireAdmin } = require('./middleware/authMiddleware');

// Rotas públicas
app.use('/', indexRoutes);
app.use('/', authRoutes); // login, logout

// Rotas protegidas
app.use('/users', requireLogin, userRoutes);
app.use('/produtos', requireLogin, produtoRoutes);
app.use('/categorias', requireLogin, categoriaRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
    
});