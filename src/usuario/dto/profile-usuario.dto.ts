import { IsString } from "class-validator";

export class ProfileUsuario{
    @IsString({message: 'La variable de rol_nombre debe ser de tipo string'})
    rol_nombre: string;
}