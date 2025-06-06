const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const flash = require('express-flash');
const session = require('express-session');
const mysql = require('mysql2');
const connection  = require('./lib/db');
const MySQLStore = require('express-mysql-session')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const editorialesRouter = require('./routes/editoriales');
const autoresRouter = require('./routes/autores');
const categoriasRouter = require('./routes/categorias');
const usuarioRouter = require('./routes/usuario');
const prestamosRouter = require('./routes/prestamos');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root', // Cambia por tu usuario de MySQL
  password: '', // Cambia por tu contraseña de MySQL
  database: 'library' // Cambia por el nombre de tu base de datos
});

app.use(session({ 
    cookie: { maxAge: 1000 * 60 * 120 }, 
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    secret: 'secret'
}))

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId || null;
  res.locals.currentRole = req.session.role || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/home', homeRouter);
app.use('/auth', authRouter);
app.use('/editoriales', editorialesRouter);
app.use('/autores', autoresRouter);
app.use('/categorias', categoriasRouter);
app.use('/usuario', usuarioRouter);
app.use('/prestamos', prestamosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;