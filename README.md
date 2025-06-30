## Descripcion
Servidor-Nestjs, que maneja la gestion de usuarios y productos
Incluye autenticacion con JWT, autorizacion por roles y se trabaja con Prisma tambien.

## Tecnologias utilizadas
- Nest.js
- TypeScript

## Objetivo
Manejar la gestion de usuarios y productos para el proyecto de GalerIA.

## Para poder llegar a la ejecucion del proyecto:

1- Solo hay que clonar el proyecto y correr npm i o npm install para instalar las dependencias que
se necesitan para que el mismo funcione

2- Luego de eso se debe configurar el archivo .env con las variables de entorno que son:
PORT= 3000
JWT_SECRET=nada
DATABASE_URL="mysql://root:@localhost:3306/db_servidor?schema=public"

3- Como estamos utilizando Prisma se deben aplicar las migraciones para configurar la DB.
npx prisma migrate dev

4- Ahora se debe ejecutar el proyecto: npm start

5- Endpoints Principales
*Autenticación:
POST /auth/register: Crea un usuario administrador (SUPER).
POST /auth/login: Autentica un usuario y devuelve un token JWT, esta habilitado para cualquier usuario

*Gestión de Usuarios:
POST /user/register: Registra nuevos usuarios con rol por defecto USER.
PATCH /user/:id/role: Cambia el rol de un usuario (solo permitido para SUPER).
Las demas rutas estan declaradas, pero solo son accesibles por el SUPER
GET /user: Busca todos los usuarios.
GET /user/:id : Busca el usuario con el id dado
...

*Gestión de Productos:
POST /producto: Crea un producto (roles permitidos: ADMIN, SUPER).
GET /producto/:id : Lista un producto (roles permitidos: ADMIN, SUPER, USER).
GET /producto: Lista todos los productos (roles permitidos: ADMIN, SUPER, USER).
PATCH /producto/:id: Actualiza un producto (roles permitidos: SUPER).
DELETE /producto/:id: Elimina un producto (roles permitidos: ADMIN, SUPER).

6- Cada metodo esta documentado, con que hace, que recibe y que retorna.
Tambien trabajamos con Swwager
http://localhost:3000/api/docs#/ Es donde esta la documentacion de Swwager

7- Documentamos el codigo con JSDoc, pero la documentacion se genera con TypeDoc
ya que se trabaja con TypeScript
Se debe ejecutar el comando: npx typedoc --entryPoints src --entryPointStrategy expand --out docs 
Se busca el index.html en la carpeta /docs y se ejecuta con Open with Live Server
Se mostrara la pagina con el detalle de la documentacion



