# Infotec - Tienda de Informática

Infotec es una tienda de informática en línea, construida con Node.js y Express. Aquí puedes gestionar productos, usuarios y realizar compras. El sistema utiliza MySQL para almacenar los datos y tiene una interfaz de usuario construida con HTML, CSS y JavaScript.

## Requisitos

Asegúrate de tener los siguientes elementos instalados:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MySQL](https://www.mysql.com/)

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd infotec
    npm install

2. **Instala las dependencias:**

    npm install

3. **Configura la base de datos:**

    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=infotec
    mysql -u tu_usuario -p < infotec.sql

4. **Ejecuta el servidor de desarrollo:**

    npm run dev
