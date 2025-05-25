/**
 * El Rincón Perfumado - Sistema de Gestión de Inventario
 * Aplicación principal con Express.js
 */

// Importación de módulos
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const bcrypt = require('bcryptjs');
const ejsLayouts = require('express-ejs-layouts');

// Importar configuración de base de datos
const { db, inicializarBaseDeDatos } = require('./database/schema');

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesión mejorada para producción
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: path.join(__dirname, 'database'),
    table: 'sessions'
  }),
  secret: process.env.SESSION_SECRET || 'elrinconperfumadosecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo usar cookies seguras en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax'
  },
  name: 'sessionId' // Cambiar el nombre de la cookie por defecto
}));

// Middleware para verificar autenticación
const autenticarUsuario = (req, res, next) => {
  if (req.session.usuario) {
    return next();
  }
  return res.redirect('/login');
};

// Middleware para verificar stock crítico en todas las rutas con autenticación
const verificarStockCritico = (req, res, next) => {
  if (req.session.usuario) {
    db.get('SELECT COUNT(*) as count FROM perfumes WHERE cantidad <= 1', [], (err, row) => {
      if (err) {
        console.error('Error al verificar stock crítico:', err.message);
        res.locals.hayStockCritico = false;
      } else {
        res.locals.hayStockCritico = row.count > 0;
      }
      next();
    });
  } else {
    next();
  }
};

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.mensaje = req.session.mensaje || null;
  res.locals.tipoMensaje = req.session.tipoMensaje || null;
  
  // Limpiar mensajes flash después de pasarlos a las vistas
  req.session.mensaje = null;
  req.session.tipoMensaje = null;
  
  next();
});

// Aplicar middleware de stock crítico
app.use(verificarStockCritico);

// Rutas
// Ruta principal redirige a login o inventario según autenticación
app.get('/', (req, res) => {
  if (req.session.usuario) {
    return res.redirect('/inventario');
  }
  return res.redirect('/login');
});

// Rutas de autenticación
app.get('/login', (req, res) => {
  if (req.session.usuario) {
    return res.redirect('/inventario');
  }
  res.render('login', { titulo: 'Iniciar Sesión' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validar entrada
  if (!username || !password) {
    req.session.mensaje = 'Usuario y contraseña son obligatorios';
    req.session.tipoMensaje = 'danger';
    return res.redirect('/login');
  }
  
  // Buscar usuario en la base de datos
  db.get('SELECT * FROM usuarios WHERE usuario = ?', [username], (err, usuario) => {
    if (err) {
      console.error('Error en la consulta:', err.message);
      req.session.mensaje = 'Error en el servidor';
      req.session.tipoMensaje = 'danger';
      return res.redirect('/login');
    }
    
    if (!usuario) {
      req.session.mensaje = 'Usuario o contraseña incorrectos';
      req.session.tipoMensaje = 'danger';
      return res.redirect('/login');
    }
    
    // Verificar contraseña
    const passwordValida = bcrypt.compareSync(password, usuario.contrasena);
    
    if (!passwordValida) {
      req.session.mensaje = 'Usuario o contraseña incorrectos';
      req.session.tipoMensaje = 'danger';
      return res.redirect('/login');
    }
    
    // Autenticación exitosa
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.usuario
    };
    
    req.session.mensaje = `¡Bienvenido, ${usuario.usuario}!`;
    req.session.tipoMensaje = 'success';
    
    return res.redirect('/inventario');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Rutas de inventario (protegidas)
app.get('/inventario', autenticarUsuario, (req, res) => {
  db.all('SELECT * FROM perfumes ORDER BY id DESC', [], (err, perfumes) => {
    if (err) {
      console.error('Error al obtener perfumes:', err.message);
      req.session.mensaje = 'Error al cargar el inventario';
      req.session.tipoMensaje = 'danger';
      return res.redirect('/');
    }
    
    res.render('inventario', {
      titulo: 'Gestión de Inventario',
      perfumes: perfumes || []
    });
  });
});

// Rutas para CRUD de perfumes
app.post('/perfume/agregar', autenticarUsuario, (req, res) => {
  const { nombre, cantidad } = req.body;
  
  // Validar entrada
  if (!nombre) {
    req.session.mensaje = 'El nombre del perfume es obligatorio';
    req.session.tipoMensaje = 'danger';
    return res.redirect('/inventario');
  }
  
  // Convertir cantidad a número entero
  const cantidadNum = parseInt(cantidad, 10) || 0;
  
  // Insertar nuevo perfume
  db.run(
    'INSERT INTO perfumes (nombre, cantidad) VALUES (?, ?)',
    [nombre, cantidadNum],
    function(err) {
      if (err) {
        console.error('Error al agregar perfume:', err.message);
        req.session.mensaje = 'Error al agregar el perfume';
        req.session.tipoMensaje = 'danger';
      } else {
        req.session.mensaje = `Perfume "${nombre}" agregado correctamente`;
        req.session.tipoMensaje = 'success';
      }
      
      return res.redirect('/inventario');
    }
  );
});

app.post('/perfume/editar', autenticarUsuario, (req, res) => {
  const { id, nombre, cantidad } = req.body;
  
  // Validar entrada
  if (!id || !nombre) {
    req.session.mensaje = 'Datos incompletos para editar';
    req.session.tipoMensaje = 'danger';
    return res.redirect('/inventario');
  }
  
  // Convertir cantidad a número entero
  const cantidadNum = parseInt(cantidad, 10) || 0;
  
  // Actualizar perfume
  db.run(
    'UPDATE perfumes SET nombre = ?, cantidad = ?, fecha_actualizacion = CURRENT_DATE WHERE id = ?',
    [nombre, cantidadNum, id],
    function(err) {
      if (err) {
        console.error('Error al actualizar perfume:', err.message);
        req.session.mensaje = 'Error al actualizar el perfume';
        req.session.tipoMensaje = 'danger';
      } else {
        req.session.mensaje = `Perfume "${nombre}" actualizado correctamente`;
        req.session.tipoMensaje = 'success';
      }
      
      return res.redirect('/inventario');
    }
  );
});

app.post('/perfume/eliminar', autenticarUsuario, (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    req.session.mensaje = 'ID no proporcionado';
    req.session.tipoMensaje = 'danger';
    return res.redirect('/inventario');
  }
  
  // Eliminar perfume
  db.run(
    'DELETE FROM perfumes WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Error al eliminar perfume:', err.message);
        req.session.mensaje = 'Error al eliminar el perfume';
        req.session.tipoMensaje = 'danger';
      } else {
        req.session.mensaje = 'Perfume eliminado correctamente';
        req.session.tipoMensaje = 'success';
      }
      
      return res.redirect('/inventario');
    }
  );
});

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).render('login', { 
    titulo: 'Página no encontrada',
    mensaje: 'La página que buscas no existe',
    tipoMensaje: 'danger'
  });
});

// Inicializar base de datos y arrancar servidor
inicializarBaseDeDatos();

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  console.log('Usuario por defecto: admin');
  console.log('Contraseña por defecto: admin123');
}); 