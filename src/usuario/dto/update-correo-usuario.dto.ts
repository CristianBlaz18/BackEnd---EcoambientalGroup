import { IsEmail, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateCorreoUsuario{
    @IsString({message:'La contraseña debe ser de tipo string'})
    @MinLength(5,{message:'La contraseña debe ser como minimo de 5 caracteres'})
    @MaxLength(20,{message:'La contraseña debe ser como maximo de 20 caracteres'})
    @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).+$/, { message: 'La contraseña debe contener al menos un número, una letra y un carácter especial' })
    password: string

    @IsString({ message: 'La variable correo debe ser de tipo string' })
    @IsEmail({}, { message: 'La variable correo debe ser de tipo correo' })
    @Length(5, 100, { message: 'La variable correo debe tener entre 5 a 100' })
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message:
      'La variable correo debe tener un formato de correo electrónico válido',
    })
    email: string
}