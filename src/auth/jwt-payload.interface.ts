// Interfaz para el payload del token

export interface JwtPayload {
    email: string;
    sub: number;   // Es el id del usuario
    role: ('USER' | 'ADMIN' | 'SUPER'); 
  }