import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  isPositive,
} from 'class-validator';

export class CreateFormularioCapacitacionDto {
  @IsString({
    message: 'La variable formcap_nombres ingresada debe ser de tipo string',
  })
  @IsNotEmpty({ message: 'La variable formcap_nombres no debe estar vacio' })
  @MaxLength(80, {
    message:
      'La variable formcap_nombres ingresada debe tener como maximo 80 caracteres',
  })
  formcap_nombres: string;

  @IsString({
    message:
      'La variable formcap_apellido_paterno ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message:
      'La variable formcap_apellido_paterno ingresada no debe estar vacio',
  })
  @MaxLength(80, {
    message:
      'La variable formcap_apellido_paterno ingresada debe tener como maximo 80 caracteres',
  })
  formcap_apellido_paterno: string;

  @IsString({
    message:
      'La variable formcap_apellido_materno ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message:
      'La variable formcap_apellido_materno ingresada no debe estar vacio',
  })
  @MaxLength(80, {
    message:
      'La variable formcap_apellido_materno ingresada debe tener como maximo 80 caracteres',
  })
  formcap_apellido_materno: string;

  @IsString({
    message:
      'La variable formcap_organizacion ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message:
      'La variable formcap_organizacion_materno ingresada no debe estar vacio',
  })
  @MaxLength(100, {
    message:
      'La variable formcap_organizacion ingresada debe tener como maximo 100 caracteres',
  })
  formcap_organizacion: string;

  @IsString({
    message: 'La variable formcap_ruc ingresada debe ser de tipo string',
  })
  @IsOptional()
  @MaxLength(20, {
    message:
      'La variable formcap_ruc ingresada debe tener como maximo 20 caracteres',
  })
  formcap_ruc?: string;

  @IsString({
    message: 'La variable formcap_correo ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message: 'La variable formcap_correo ingresada no debe estar vacio',
  })
  @Length(5, 100, {
    message: 'La variable formcap_correo debe tener entre 5 a 100',
  })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message:
      'La variable formcap_correo debe tener un formato de correo electrónico válido',
  })
  @IsEmail(
    {},
    { message: 'La variable formcap_correo ingresada debe ser de tipo correo' },
  )
  formcap_correo: string;

  @IsNumberString(
    {},
    {
      message:
        'La variable formcap_celular ingresada debe ser de tipo number-string',
    },
  )
  @IsNotEmpty({
    message: 'La variable formcap_celular ingresada no debe estar vacia',
  })
  @MaxLength(15, {
    message:
      'La variable formcap_celular ingresada debe tener como maximo 15 caracteres',
  })
  formcap_celular: string;

  @IsString({
    message: 'La variable formcap_pais ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message: 'La variable formcap_pais ingresada no debe estar vacio',
  })
  @IsIn([
    'Argentina',
    'Bolivia',
    'Brasil',
    'Chile',
    'Colombia',
    'Ecuador',
    'Guyana',
    'Perú',
    'Surinam',
    'Uruguay',
    'Venezuela',
    'Bahamas',
    'Barbados',
    'Canadá',
    'Costa Rica',
    'Cuba',
    'Dominica',
    'Granda',
    'Jamaica',
    'Estados Unidos',
    'México',
    'Panamá',
    'República Dominicana',
    'Trinida y Tobago',
  ])
  formcap_pais: string;

  @IsString({
    message: 'La variable formcap_consulta ingresada debe ser de tipo string',
  })
  @IsNotEmpty({
    message: 'La variable formcap_consulta ingresada no debe estar vacia',
  })
  @MaxLength(800, {
    message:
      'La variable formcap_consulta ingresada debe tener como maximo 800 caracteres',
  })
  formcap_consulta: string;

  @IsInt({
    message: 'La variable capacitacion_id ingresada debe ser de tipo int',
  })
  @Min(1, {
    message: 'La variable capacitacion_id ingresada debe ser como minimo 1',
  })
  @IsNotEmpty({
    message: 'La variable capacitacion_id ingresada no debe estar vacia',
  })
  capacitacion_id: number;
}
