//Archivo de la clase dto de producto

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
    @ApiProperty({ description: 'Nombre del producto', example: 'Laptop' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Descripción del producto', example: 'Laptop Dell 2022' })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ description: 'Imagen del producto', example: 'https://example.com/laptop.jpg' })
    @IsString()
    @IsOptional()
    imagen?: string;
}
