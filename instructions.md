# INSTRUCCIONES DE DESARROLLO - EL RINCÓN PERFUMADO

## STACK TECNOLÓGICO
- **Backend**: Node.js + Express.js
- **Frontend**: Bootstrap 5 + EJS (templates)
- **Base de datos**: SQLite3
- **Dependencias principales**: express-session, bcryptjs, sqlite3

## CONFIGURACIÓN INICIAL
Ejecutar los siguientes comandos para iniciar el proyecto:
- `npm init -y`
- `npm install express sqlite3 ejs bcryptjs express-session`

## ESTRUCTURA DE ARCHIVOS
- `/database/inventario.db` - Base de datos SQLite
- `/public/css/styles.css` - Estilos personalizados
- `/public/js/scripts.js` - Lógica front-end básica
- `/views/layouts/` - Plantillas reutilizables
- `/views/login.ejs` - Vista de autenticación
- `/views/inventario.ejs` - Vista principal de gestión
- `app.js` - Configuración principal

## ESQUEMA DE BASE DE DATOS
**Tabla usuarios**:
- id (INTEGER PRIMARY KEY)
- usuario (TEXT UNIQUE)
- contrasena (TEXT)

**Tabla perfumes**:
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- nombre (TEXT NOT NULL)
- cantidad (INTEGER CHECK(cantidad >= 0))
- fecha_actualizacion (DATE DEFAULT CURRENT_DATE)

## REQUERIMIENTOS FUNCIONALES

### 1. Autenticación
- Login básico con usuario/contraseña
- Sesiones persistentes
- Todas las rutas de inventario deben estar protegidas
- Validación básica en formularios (campos no vacíos)

### 2. Gestión de Inventario
**CRUD Completo**:
- Crear: Formulario para agregar nuevos perfumes
- Leer: Tabla con lista completa de productos
- Actualizar: Modificar cantidad/existencia
- Eliminar: Botón de eliminación con confirmación

**Notificación Stock Crítico**:
- Sistema de alertas cuando cantidad = 1
- Dos niveles de notificación:
  - Fila resaltada en tabla
  - Banner superior cuando existan alertas

## DIRECTRICES DE DISEÑO

### Paleta de Colores
- Primario: #c94a2b (naranja terracota)
- Secundario: #000000 (negro)
- Fondos: #f8f9fa (gris claro de Bootstrap)
- Alertas: #fff3cd (amarillo claro)

### Elementos UI
- Botones personalizados con color primario
- Tablas con cabeceras en color primario
- Alertas con borde izquierdo destacado
- Diseño responsive (usar grid de Bootstrap)

## CRITERIOS DE ACEPTACIÓN
1. Funcionamiento básico sin errores en consola
2. Persistencia de datos en SQLite
3. Sistema de notificaciones visible para stock crítico
4. Diseño alineado con la paleta de colores especificada
5. Responsive en móviles (breakpoint de Bootstrap)
6. Validación de formularios en frontend y backend
7. Protección de rutas no autenticadas