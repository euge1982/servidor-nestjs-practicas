import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { prisma } from 'src/config/database';

@Injectable()
export class ProductoService {
  async create(createProductodto: CreateProductoDto) {
    return await prisma.producto.create({ data: createProductodto });
  }

  async findAll() {
    return await prisma.producto.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  async update(id: number, dto: UpdateProductoDto) {
    return prisma.producto.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return prisma.producto.delete({ where: { id } });
  }
}
