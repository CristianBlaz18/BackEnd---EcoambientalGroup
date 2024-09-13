import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsString({
    message: 'La variable nombre_usuario ingresada debe ser de tipo string',
  })
  @Length(5, 20, {
    message:
      'La variable nombre_usuario ingresada debe ser tener entre 5 a 20 caracteres',
  })
  nombre_usuario?: string;

  @IsDateString(
    {},
    {
      message:
        'La variable fecha_nacimiento ingresada debe ser de tipo string y Date XXXX-XX-XX',
    },
  )
  fecha_nacimiento?: string;

  @IsNumberString(
    {},
    {
      message: 'La variable telefono ingresada debe ser de tipo number-string',
    },
  )
  @Length(8, 30, {
    message: 'La variable telefono debe tener entre 8 a 30 caracteres',
  })
  telefono?: string;

  @IsString({ message: 'La variable pais ingresada debe ser de tipo string' })
  
  pais?: string;

  @IsOptional()
  @IsString({
    message: 'La variable grado_estudio ingresada debe ser de tipo string',
  })
  @MaxLength(100, {
    message: 'La variable grado_estudio debe tener como maximo 100 caracteres',
  })
  grado_estudio?: string;

  @IsOptional()
  @IsString({
    message: 'La variable ocupacion ingresada debe ser de tipo string',
  })
  @MaxLength(200, {
    message:
      'La variable ocupacion ingresada debe tener como maximo 200 caracteres',
  })
  ocupacion?: string;

  @IsString({ message: 'La variable imagen ingresada debe ser de tipo string' })
  @MaxLength(1000, {
    message:
      'La variable imagen ingresada debe tener como maximo 1000 caracteres',
  })
  imagen?: string;
}
