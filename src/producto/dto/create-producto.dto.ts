//Archivo de la clase dto de producto

import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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

    @ApiProperty({ description: 'Precio del producto', example: 1000 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)   //Precio no puede ser negativo
    precio: number;

    @ApiProperty({ description: 'Cantidad del producto', example: 10 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)   //Cantidad no puede ser negativa
    cantidad: number;
}
