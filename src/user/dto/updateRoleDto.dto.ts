//Archivo de la clase UpdateRoleDto de usuario

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateRoleDto {
    @ApiProperty({ description: 'Rol del usuario', example: 'USER' })
    @IsString()
    role: 'USER' | 'ADMIN' | 'SUPER';
}