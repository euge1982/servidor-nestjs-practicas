// Interfaz para el payload del token

export interface JwtPayload {
    email: string;
    sub: number;   //El sub es el id del usuario
    role: ('USER' | 'ADMIN' | 'SUPER'); 
  }