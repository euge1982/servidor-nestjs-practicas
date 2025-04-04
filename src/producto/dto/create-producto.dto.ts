// Archivo de la clase dto de producto

import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
    @ApiProperty({ description: 'Nombre de la obra', example: 'Noche estrellada' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)   // Nombre de 3 a 30 caracteres
    nombre: string;

    @ApiProperty({ description: 'Descripción de la obra', example: 'La obra de la noche estrellada...' })
    @IsString()
    @IsOptional()
    @Length(3, 100)   // Descripcion de 3 a 100 caracteres
    descripcion?: string;

    @ApiProperty({ description: 'Imagen de la obra', example: 'https://example.com/imagenObra.jpg' })
    @IsString()
    @IsOptional()
    @IsUrl()   // Validamos que sea una URL válida
    imagen?: string;
}