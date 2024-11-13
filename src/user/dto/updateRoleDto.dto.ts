import { IsString } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    role: 'USER' | 'ADMIN' | 'SUPER';
}