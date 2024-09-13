## Instalación

```bash
#Instalacion de npm(gestor de paquetes)
$ npm install
```
```bash
#Instalacion de Nest.js
$ npm i -g@nestjs/cli 
```
## Dependencias
```bash
# .env
$ npm install dotenv
```
```bash
# Class Validator
$ npm install class-validator class-transformer -SE
```
```bash
# Variables de Entorno( Uso de .env)
$ npm install @nestjs/config
```
```bash
# Type ORM
$ npm install @nestjs/typeorm typeorm mysql2
```
```bash
# Swagger
$ npm i @nestjs/swagger -SE
```
```bash
# Date FNS
$ npm install date-fns
```
```bash
# bcryptjs
$ npm install bcryptjs
```
```bash
# Mailer
$ npm install nodemailer
$ npm install --save @nestjs-modules/mailer
```
## Ejecución

```bash

# Ejecucion para que se actualice el servidor en cada cambio
$ npm run start:dev

```
## Creación de entidades
```bash
#Reemplazar 'cats' por la entidad deseada.
$ nest g res "nombre de la entidad" --no-spec

