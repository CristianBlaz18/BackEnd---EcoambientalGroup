import { IsInt, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class UpdateClaveUsuario{

    // @IsInt({message:'El id del usuario debe ser de tipo int'})
    // @Min(1,{message:'El id del usuario no puede ser menor a 1'})
    // idUser: number

    @IsString({message:'La contraseña debe ser de tipo string'})
    @MinLength(5,{message:'La contraseña debe ser como minimo de 5 caracteres'})
    @MaxLength(20,{message:'La contraseña debe ser como maximo de 20 caracteres'})
    @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).+$/, { message: 'La contraseña debe contener al menos un número, una letra y un carácter especial' })
    pass: string

    @IsString({message:'La contraseña nueva debe ser de tipo string'})
    @MinLength(5,{message:'La contraseña nueva debe ser como minimo de 5 caracteres'})
    @MaxLength(20,{message:'La contraseña nueva debe ser como maximo de 20 caracteres'})
    @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).+$/, { message: 'La contraseña nueva debe contener al menos un número, una letra y un carácter especial' })
    newPass: string

}