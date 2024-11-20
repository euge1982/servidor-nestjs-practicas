import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from 'src/config/database';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import { Usuario, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.usuario.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      }  
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async assignRole(id: number, role: Role): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data: { role },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number): Promise<Usuario> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
