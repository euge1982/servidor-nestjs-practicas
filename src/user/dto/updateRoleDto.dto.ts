// Archivo de la clase UpdateRoleDto de usuario

import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpdateRoleDto {
    @ApiProperty({ description: 'Rol del usuario', example: 'USER' })
    @IsString()
    @IsIn(['USER', 'ADMIN', 'SUPER'], { message: 'El rol debe ser USER, ADMIN o SUPER' })
    role: 'USER' | 'ADMIN' | 'SUPER';
}