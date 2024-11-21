//Archivo de controlador de producto

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Productos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  /**
   * Crea un producto, solo los ADMIN y SUPER pueden crear
   * @param dto que es del tipo CreateProductoDto
   * @returns el producto creado
   */
  @Post()
  @ApiOperation({ summary: 'Crea un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles('ADMIN', 'SUPER')
  async create(@Body() dto: CreateProductoDto) {
    //Se llama al servicio para crear el producto
    return await this.productoService.create(dto);
  }

  /**
   * Obtiene todos los productos, sin importar el rol
   * @returns todos los productos
   */
  @Get()
  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles('ADMIN', 'SUPER', 'USER')
  async findAll() {
    //Se llama al servicio para obtener todos los productos
    return await this.productoService.findAll();
  }

  /**
   * Encuentra un producto por id, sin importar el rol
   * @param id el id del producto
   * @returns 
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto obtenido' })
  @ApiResponse({ status: 403, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER', 'USER')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    //Se llama al servicio para obtener el producto
    return await this.productoService.findOne(id);
  }

  /**
   * Actualiza un producto por id
   * @param id que es el id del producto
   * @param dto que es del tipo UpdateProductoDto
   * @returns el producto actualizado, siempre y cuando exista
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('SUPER')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    //Se llama al servicio para actualizar el producto
    return await this.productoService.update(id, dto);
  }

  /**
   * Elimina un producto por id, solo los ADMIN y SUPER pueden eliminar
   * @param id que es el id del producto
   * @returns el msj de producto eliminado o producto no encontrado
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER')
  async remove(@Param('id', ParseIntPipe) id: number) {
    //Se llama al servicio para eliminar el producto
    return await this.productoService.remove(id);
  }
}