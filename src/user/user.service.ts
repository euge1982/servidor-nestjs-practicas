// Archivo de servicio de usuario

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cifra una contraseña con bcrypt
   * @param password Contraseña en texto plano
   * @returns Contraseña cifrada
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }


  /**
   * Crea un nuevo usuario con el rol USER (por defecto)
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error
   */
  async register(dto: CreateUserDto): Promise<Usuario> {
    try {
      // Ciframos la contraseña
      const hashedPassword = await this.hashPassword(dto.password);

      // Verificamos si el email ya está en uso
      if (await this.findByEmail(dto.email)) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      // Creamos el usuario con el rol USER por defecto
      return await this.prisma.usuario.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: 'USER',
        },
      });
    } 
    catch (error) {
      throw new HttpException(`Error registering USER user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Crea un nuevo usuario con el rol SUPER (por defecto)
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error
   */
  async registerSuper(dto: CreateUserDto): Promise<Usuario> {
    try {
      // Ciframos la contraseña
      const hashedPassword = await this.hashPassword(dto.password);

      // Verificamos si el email ya está en uso
      if (await this.findByEmail(dto.email)) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      // Creamos el usuario con el rol SUPER por defecto
      return await this.prisma.usuario.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: 'SUPER',
        },
      });
    } 
    catch (error) {
      throw new HttpException(`Error registering SUPER user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  /**
   * Este metodo se encarga de buscar un usuario por email
   * @param email 
   * @returns el usuario con ese email o un error
   */
  async findByEmail(email: string) {
    // Buscamos el usuario por email y lo devolvemos
    return this.prisma.usuario.findUnique({ where: { email }});
  }


  /**
  * Busca un usuario por ID
  * @param id del usuario
  * @returns el usuario con ese id o null
  */
  async findById(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { id }})
  }


  /**
   * Valida que la contraseña ingresada sea correcta
   * @param plainPassword contraseña ingresada
   * @param hashedPassword contraseña almacenada
   * @returns true si es correcta, false si no lo es
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }


  /**
   * Se encarga de loguear un usuario
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario logueado o un error
   */
  async login(dto: CreateUserDto): Promise<Usuario> {
    try {
      // Buscamos el usuario por email
      const user = await this.findByEmail(dto.email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Comprobamos que la contraseña coincida
      if (!(await this.validatePassword(dto.password, user.password))) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } 
    catch (error) {
      throw new HttpException(`Login failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Cambia el rol de un usuario, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @param role el nuevo rol
   * @returns el usuario con el nuevo rol
   */
  async assignRole(id: number, role: Role): Promise<Usuario> {
    // Validación manual de los roles permitidos
    const validRoles: Role[] = ['USER', 'ADMIN', 'SUPER'];
  
    if (!validRoles.includes(role)) {
      // Lanza una excepción con un código de estado 400
      throw new HttpException(`Invalid role: ${role}. Allowed roles are 'USER', 'ADMIN', 'SUPER'.`, HttpStatus.BAD_REQUEST);
    }
  
    try {
      // Si el rol es válido, procedemos a actualizar el usuario
      const updatedUser = await this.prisma.usuario.update({
        where: { id },
        data: { role },
      });
  
      return updatedUser;
    } 
    catch (error) {
      // Capturamos y lanzamos errores más específicos en caso de fallos
      throw new HttpException(`Error assigning role: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Obtiene todos los usuarios
   * @returns un array de usuarios
   */
  async findAll(): Promise<Usuario[]> {
    try {
      return await this.prisma.usuario.findMany();
    } 
    catch (error) {
      throw new HttpException(`Error fetching users: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Obtiene un usuario por su id
   * @param id del usuario
   * @returns el usuario con ese id o un error
   */
  async findOne(id: number): Promise<Usuario> {
    try {
      return await this.prisma.usuario.findUnique({ where: { id } });
    } 
    catch (error) {
      throw new HttpException(`Error fetching user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Actualiza un usuario
   * @param id del usuario
   * @param updateUserDto los datos para actualizar
   * @returns el usuario actualizado
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    try {
      return await this.prisma.usuario.update({
        where: { id },
        data: updateUserDto,
      });
    } 
    catch (error) {
      throw new HttpException(`Error updating user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  /**
   * Elimina un usuario por su id
   * @param id del usuario
   * @returns el mensaje de que se ha eliminado el usuario o un error
   */
  async remove(id: number): Promise<Usuario> {
    try {
      return await this.prisma.usuario.delete({ where: { id } });
    } 
    catch (error) {
      throw new HttpException(`Error deleting user: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}