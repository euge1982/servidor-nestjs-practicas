// Archivo de controlador de usuario

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  /**
   * Crea un nuevo usuario, solo con el rol USER
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario creado o un error 
   */
  @Post('register')
  @ApiOperation({ summary: 'Crea un nuevo usuario con el rol USER solamente' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el usuario' })
  async create(@Body() dto: CreateUserDto){
    return await this.userService.register(dto);
  }


  /**
   * Se loguea un usuario
   * @param dto que es del tipo CreateUserDto
   * @returns el usuario logueado
   */  
  @Post('login')
  async login(@Body() dto: CreateUserDto) {
    return await this.userService.login(dto);
  }


  /**
   * Se encarga de buscar todos los usuarios, solo los SUPER pueden hacerlo
   * @returns todos los usuarios
   */
  @ApiOperation({ summary: 'Busca todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados correctamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar los usuarios' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('SUPER')
  async findAll() {
    return await this.userService.findAll();
  }


  /**
   * Busca un usuario por su ID, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @returns el usuario con ese ID o un error
   */
  @ApiOperation({ summary: 'Busca un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar el usuario' })
  @Roles('SUPER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }


  /**
   * Actualiza el rol de un usuario, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @param updateRoleDto del tipo UpdateRoleDto
   * @returns el usuario con el nuevo rol
   */
  @ApiOperation({ summary: 'Actualiza el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el rol del usuario' })  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  @Roles('SUPER')
  async assignRole(
    @Param('id', ParseIntPipe ) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return await this.userService.assignRole(id, updateRoleDto.role);
  }


  /**
   * Elimina un usuario por su ID, solo los SUPER pueden hacerlo
   * @param id del usuario
   * @returns el mensaje de que se ha eliminado el usuario o un error
   */
  @ApiOperation({ summary: 'Elimina un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('SUPER')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}