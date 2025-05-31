import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar rutas publicas en NestJS
 *
 * Se utiliza para indicar que una ruta no necesita autenticación. 
 * 
 * @function
 * @returns El decorador que marca la ruta como publica
 */
export const Public = () => SetMetadata('isPublic', true);