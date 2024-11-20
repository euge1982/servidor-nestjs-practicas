export interface JwtPayload {
    email: string;
    sub: number; // El ID del usuario (esto depende de cómo lo manejes)
    role: ('USER' | 'ADMIN' | 'SUPER'); 
  }