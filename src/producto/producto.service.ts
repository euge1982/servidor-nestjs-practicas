import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { prisma } from 'src/config/database';

@Injectable()
export class ProductoService {
  async create(createProductodto: CreateProductoDto) {
    const { nombre, descripcion, precio, cantidad } = createProductodto;

    try {
      return await prisma.producto.create( { data: { nombre, descripcion, precio, cantidad } } );
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }

  async findAll() {
    return await prisma.producto.findMany();
  }

  async findOne(id: number) {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto) {
    try {
      await this.findOne(id);
    } catch (error) {
      throw new NotFoundException('Producto no encontrado');
    }
    
    return prisma.producto.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    try {
      return await prisma.producto.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}
