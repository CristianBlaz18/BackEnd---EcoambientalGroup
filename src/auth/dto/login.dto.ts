import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El usuario debe ser de tipo string' })
  @MinLength(5, { message: 'El usuario no puede tener menos de 5 caracteres' })
  @MaxLength(255, { message: 'El usuario no puede tener mas de 20 caracteres' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  nombre_usuario: string;

  @IsString({ message: 'La contraseña debe ser de tipo string' })
  @MinLength(5, {
    message: 'La contraseña no puede tener menos de 5 caracteres',
  })
  @MaxLength(20, {
    message: 'La contraseña no puede tener mas de 20 caracteres',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe contener al menos un número, una letra y un caracter especial',
  })
  clave: string;
}
