# Bienvenido a Realtime Chat

Este proyecto es un chat que recibe mensajes en tiempo real, utilizando socket.io

# Como ejecutar el proyecto

## Clonar el proyecto

Crea una carpeta donde guardar el proyecto y ejecuta el comando
git clone https://github.com/fromant65/Realtime-Chat.git

## Instalar paquetes

Necesitaremos tener instalado NPM. Una vez que tengamos esta herramienta, ejecutamos dentro de la carpeta del proyecto el siguiente comando
npm install
Esto instalará todas las dependencias del proyecto

## Crear una database en MongoDB

El proyecto utiliza una base de datos para guardar los mensajes enviados. Por lo que deberemos crear una database en MongoDB y linkearla al proyecto
Para poder linkearla, tendremos que agregar las siguientes variables en un archivo .env

ACCESS_TOKEN_SECRET = password
Es un token que nos permite encriptar las sesiones

DATABASE_URI = link de la database con los datos de autenticación pertinentes

## Correr el proyecto

Podemos ejecutar el proyecto en un servidor local con el comando
npm run dev
Y luego dirigirnos a http://localhost:3500
