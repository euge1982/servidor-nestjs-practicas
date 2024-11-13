import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from 'src/config/database';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import { Usuario, Role } from '@prisma/client';

@Injectable()
export class UserService {
  async create(dto: CreateUserDto) {
    return prisma.usuario.create({ data: dto });
  }

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  async assignRole(id: number, role: Role): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id: id },
      data: { role },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return prisma.usuario.findMany();
  }

  async updateRole(id: number, dto: UpdateRoleDto) {
    return prisma.usuario.update({
      where: { id },
      data: { role: dto.role },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return prisma.usuario.delete({ where: { id } });
  }
}
