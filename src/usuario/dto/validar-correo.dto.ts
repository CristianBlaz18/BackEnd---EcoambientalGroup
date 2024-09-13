import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ValidarCorreoDto{

    @Type(()=> String)
    @IsNotEmpty({ message: 'La variable correo_usuario es requerida' })
    @IsString({ message: 'La variable correo_usuario debe ser de tipo string' })
    @IsEmail({}, { message: 'La variable correo_usuario debe ser de tipo correo' })
    @Length(3, 100, { message: 'La variable correo_usuario debe tener entre 5 a 100' })
    // @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    // message:
    //   'La variable correo debe tener un formato de correo electrónico válido',
    // })
    correo_usuario: string;
}