import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';

@ApiTags('Productos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles('ADMIN', 'SUPER')
  create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @Roles('ADMIN', 'SUPER', 'USER')
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto obtenido' })
  @ApiResponse({ status: 403, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER', 'USER')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('SUPER')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
