import { SetMetadata } from "@nestjs/common";

/**
 * Decorador para roles permitidos 
 * 
 * @param {...string} roles - Lista de roles permitidos para que accedan
 * @returns El decorador
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);