// Configuramos las variables de entorno

import * as joi from 'joi';
import * as dotenv from 'dotenv';


// Cargamos las variables de entorno
dotenv.config();

// Definimos la estructura de las variables
interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
}

// Configuramos el schema de JOI
const envsSchema = joi
    .object({
        PORT: joi.number().required(),   // Se le da tipo y que es requerido
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().required(),
    })
    .unknown(true);   // Permite todas las variables sin validarlas

// Se valida, puede devolver un error o las variables
const { error, value} = envsSchema.validate(process.env);

// Si hay error, se corta la ejecucion del servidor y se muestra el mensaje de error
if (error) throw new Error(`Error de validación de configuración: ${error.message}`);

// Si vino el valor, lo guardamos en una variable que va a ser del tipo EnvVars
const envVars: EnvVars = value;

// Exportamos las variables de entorno 
export const envs: EnvVars = value as EnvVars;