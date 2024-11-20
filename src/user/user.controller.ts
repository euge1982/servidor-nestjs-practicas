import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { ParseIntPipe } from '@nestjs/common';

@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el usuario' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  @ApiOperation({ summary: 'Actualiza el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el rol del usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('SUPER')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Busca un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al buscar el usuario' })
  @Roles('SUPER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualiza el rol de un usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el rol del usuario' })  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  @Roles('SUPER')
  assignRole(
    @Param('id', ParseIntPipe ) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.userService.assignRole(id, updateRoleDto.role);
  }

  @ApiOperation({ summary: 'Elimina un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar el usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('SUPER')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
