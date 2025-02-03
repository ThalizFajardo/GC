import express from 'express';
import "reflect-metadata";
import { envs } from "./config/env";
import { PostgresDatabase } from "./data/postgres/postgres-database"; 
import { AppRoutes } from "./presentation/routes"; 
import { Server } from "./presentation/server"; 



// Función principal para inicializar la aplicación
async function main() {
  // Configuración de la base de datos
  const postgres = new PostgresDatabase({
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    host: envs.DB_HOST,
    database: envs.DB_DATABASE,
    port: envs.DB_PORT,
  });

  await postgres.connect(); // Conexión a la base de datos

  // Configuración del servidor
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  await server.start(); // Inicialización del servidor
}

main();