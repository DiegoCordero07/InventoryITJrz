# El Rincón Perfumado - Sistema de Gestión de Inventario

Sistema web para gestionar el inventario de una tienda de perfumes. Permite llevar control de existencias y recibir alertas cuando el stock es crítico.

## Características

- Autenticación de usuarios
- Gestión completa de inventario (CRUD)
- Sistema de alertas para stock crítico
- Diseño responsive adaptado a móviles

## Tecnologías utilizadas

- **Backend**: Node.js + Express.js
- **Frontend**: Bootstrap 5 + EJS (templates)
- **Base de datos**: SQLite3
- **Dependencias principales**: express-session, bcryptjs, sqlite3

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Iniciar la aplicación:
   ```
   npm start
   ```
   
## Credenciales por defecto

- **Usuario**: admin
- **Contraseña**: admin123

## Estructura del proyecto

```
El Rincón Perfumado/
├── database/               # Base de datos SQLite y configuración
│   └── inventario.db       # Base de datos
│   └── schema.js           # Esquema y funciones de base de datos
├── public/                 # Archivos estáticos
│   ├── css/                # Hojas de estilo
│   │   └── styles.css      # Estilos personalizados
│   └── js/                 # JavaScript cliente
│       └── scripts.js      # Lógica frontend
├── views/                  # Plantillas EJS
│   ├── layouts/            # Layouts reutilizables
│   │   └── main.ejs        # Layout principal
│   ├── login.ejs           # Vista de login
│   └── inventario.ejs      # Vista de inventario
├── app.js                  # Aplicación principal Express
├── package.json            # Dependencias y configuración
└── README.md               # Este archivo
```

## Desarrollo

Para ejecutar en modo desarrollo con recarga automática:

```
npm run dev
```

## Autor

El Rincón Perfumado 