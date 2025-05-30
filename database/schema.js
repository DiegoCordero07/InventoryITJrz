/**
 * Esquema de base de datos para El Rincón Perfumado
 * Configura las tablas necesarias para la aplicación
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'inventario.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas si no existen
function inicializarBaseDeDatos() {
  // Tabla usuarios
  db.serialize(() => {
    // Crear tabla usuarios primero
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY,
        usuario TEXT UNIQUE NOT NULL,
        contrasena TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error al crear tabla usuarios:', err.message);
        return;
      }
      
      // Crear tabla perfumes después
      db.run(`
        CREATE TABLE IF NOT EXISTS perfumes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          cantidad INTEGER CHECK(cantidad >= 0),
          ubicacion TEXT,
          fecha_actualizacion DATE DEFAULT CURRENT_DATE
        )
      `, (err) => {
        if (err) {
          console.error('Error al crear tabla perfumes:', err.message);
          return;
        }
        
        // Verificar si existe un usuario administrador, si no, crearlo
        db.get('SELECT COUNT(*) as count FROM usuarios', [], (err, row) => {
          if (err) {
            console.error('Error al verificar usuarios:', err.message);
            return;
          }

          if (row.count === 0) {
            // Crear usuario administrador por defecto
            const salt = bcrypt.genSaltSync(10);
            const hashContrasena = bcrypt.hashSync('admin123', salt);
            
            db.run(
              'INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)',
              ['admin', hashContrasena],
              function(err) {
                if (err) {
                  console.error('Error al crear usuario admin:', err.message);
                } else {
                  console.log('Usuario administrador creado con éxito');
                  console.log('Usuario: admin');
                  console.log('Contraseña: admin123');
                }
              }
            );
          }
        });
      });
    });
  });
}

// Exportar funciones y objetos
module.exports = {
  db,
  inicializarBaseDeDatos
}; 