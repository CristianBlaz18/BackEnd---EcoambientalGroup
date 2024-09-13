import {
  IsString,
  IsBoolean,
  IsInt,
  Length,
  IsDateString,
  IsEmail,
  IsIn,
  Matches,
  MaxLength,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateDocenteDto {
  @IsString({ message: 'La variable correo debe ser de tipo string' })
  @IsEmail({}, { message: 'La variable correo debe ser de tipo correo' })
  @Length(5, 100, { message: 'La variable correo debe tener entre 5 a 100' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message:
      'La variable correo debe tener un formato de correo electrónico válido',
  })
  correo: string;

  @IsString({ message: 'La clave ingresada debe ser de tipo string' })
  @Length(5, 20, {
    message: 'La contraseña debe tener entre 5 a 20 caracteres',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe contener al menos un número, una letra y un carácter especial',
  })
  clave: string;


  @IsString({
    message: 'La variable nombres ingresada debe ser de tipo string',
  })
  @Length(1, 200, {
    message:
      'La variable nombres ingresada debe tener entre 1 a 50 caracteres',
  })
  nombres: string;

  

  @IsString({
    message: 'La variable apellidos ingresada debe ser de tipo string',
  })
  @Length(1, 200, {
    message:
      'La variable apellidos ingresada debe tener entre 1 a 50 caracteres',
  })
  apellidos: string;

  @IsString({
    message: 'La variable pais_origen ingresada debe ser de tipo string',
  })
  @IsIn([
    'Argentina',
    'Bahamas',
    'Barbados',
    'Bolivia',
    'Brasil',
    'Canadá',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Dominica',
    'Ecuador',
    'El Salvador',
    'España',
    'Estados Unidos',
    'Granada',
    'Guatemala',
    'Guyana',
    'Honduras',
    'Jamaica',
    'México',
    'Nicaragua',
    'Panamá',
    'Paraguay',
    'Perú',
    'Puerto Rico',
    'República Dominicana',
    'Surinam',
    'Trinida y Tobago',
    'Uruguay',
    'Venezuela',
  ])
  pais_origen: string;

  @IsString({
    message: 'La variable carnet_identidad ingresada debe ser de tipo string',
  })
  @MaxLength(100, {
    message:
      'La variable carnet_identidad ingresada debe tener como maximo 100 caracteres',
  })
  carnet_identidad: string;

  @IsString({
    message: 'La variable nombre_usuario ingresada debe ser de tipo string',
  })
  @Length(5, 20, {
    message:
      'La variable nombre_usuario ingresada debe ser tener entre 5 a 20 caracteres',
  })
  nombre_usuario: string;

  @IsDateString(
    {},
    {
      message:
        'La variable fecha_nacimiento ingresada debe ser de tipo string y Date XXXX-XX-XX',
    },
  )
  fecha_nacimiento: string;

  @IsNumberString(
    {},
    {
      message: 'La variable telefono ingresada debe ser de tipo number-string',
    },
  )
  @Length(8, 30, {
    message: 'La variable telefono debe tener entre 8 a 30 caracteres',
  })
  telefono: string;

  @IsString({ message: 'La variable pais ingresada debe ser de tipo string' })
  
  pais: string;

  @IsString({ message: 'La variable genero ingresada debe ser de tipo string' })
  @IsIn(['Masculino', 'Femenino', 'Binario', 'No especificado'])
  genero: string;

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
    message: 'La variable grado_ocupacion ingresada debe ser de tipo string',
  })
  @MaxLength(200, {
    message:
      'La variable grado_ocupacion ingresada debe tener como maximo 200 caracteres',
  })
  grado_ocupacion?: string;

  @IsOptional()
  @IsString({
    message: 'La variable carrera ingresada debe ser de tipo string',
  })
  @MaxLength(200, {
    message: 'La variable carrera ingresada debe tener máximo 200 caracteres',
  })
  carrera?: string;

  @IsBoolean({
    message: 'La variable publicidad ingresada debe ser de tipo boleana',
  })
  publicidad: boolean;

  @IsString({
    message:
      'La variable usuario_descripcion ingresada debe ser de tipo string',
  })
  usuario_descripcion: string;

  @IsOptional()
  @IsString({
    message: 'La variable docente_linkedin ingresada debe ser de tipo string',
  })
  docente_linkedin: string;

  @IsOptional()
  @IsString({
    message: 'La variable docente_youtube ingresada debe ser de tipo string',
  })
  docente_youtube: string;

  @IsOptional()
  @IsString({
    message: 'La variable docente_instagram ingresada debe ser de tipo string',
  })
  docente_instagram: string;

  // @IsOptional()
  // @IsString({
  //     message: 'La variable docente_permiso ingresada debe ser de tipo string',
  //   })
  // docente_permiso :string;
}
