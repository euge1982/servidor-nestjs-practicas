import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('producto')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @Roles('ADMIN', 'SUPER')
  create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'SUPER', 'USER')
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER')
  update(@Param('id') id: number, @Body() dto: UpdateProductoDto) {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER')
  remove(@Param('id') id: number) {
    return this.productoService.remove(id);
  }
}
