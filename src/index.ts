import express, { Application } from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

// Importar rutas de módulos
import userRoutes from './Users/routes/usersRoutes';

// Importar middlewares compartidos
import { errorHandler } from './shared/config/middlewares/errorHandler';
import { notFoundHandler } from './shared/config/middlewares/norFoundHandler';

// Configuración de variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10);

// Middleware de análisis del cuerpo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de los módulos
app.use('/api/user', userRoutes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://52.7.198.67:${port}`);
});