import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
export class DataCertificadoGratuitoDto {
  @IsInt({
    message: 'El campo id_estudiante debe ser una cadena de caracteres',
  })
  @Min(1, { message: 'El id del estudiante no puede ser menor a 1' })
  @IsNotEmpty({ message: 'El campo id_estudiante no debe estar vacío' })
  id_estudiante: number;

  @IsInt({
    message: 'El campo id_detalleventa debe ser una cadena de caracteres',
  })
  @Min(1, { message: 'El id del detalle de venta no puede ser menor a 1' })
  @IsNotEmpty({ message: 'El campo id_detalleventa no debe estar vacío' })
  id_detalleventa: number;

  @IsInt({ message: 'El campo id_curso debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El campo id_curso no debe estar vacío' })
  @Min(1, { message: 'El id del curso no debe ser menor a 1' })
  id_curso: number;

  @IsInt({ message: 'El campo matricula_estado debe ser de tipo int' })
  @IsNotEmpty({ message: 'El campo matricula_estado no debe estar vacío' })
  @IsIn([0, 1])
  matricula_estado: number;

  @IsInt({
    message: 'El campo id_tipo_certificado debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El campo id_tipo_certificado no debe estar vacío' })
  @Min(1, { message: 'El id del tipo de certificado no puede ser menor a 1' })
  id_tipo_certificado: number;

  @IsString({
    message: 'El campo pais del estuciante ingresado debe ser de tipo string',
  })
  @MaxLength(30)
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
  @IsNotEmpty({ message: 'El campo pais_estudiante no debe estar vacío' })
  pais_estudiante: string;

  @IsInt({ message: 'El tiempo de acceso debe ser de tipo int' })
  @Min(1, { message: 'El timempo de aceso no debe ser menor a 1' })
  @IsOptional()
  tiempo_de_acceso?: number | null;

  @IsString({
    message: 'El campo tipo_moneda debe ser una cadena de caracteres',
  })
  @IsIn(['USD', 'PEN', 'EUR'], {
    message: 'El tipo de moneda debe ser: USD, PEN o EUR',
  })
  @IsNotEmpty({ message: 'El campo tipo_moneda no debe estar vacío' })
  tipo_moneda: string;

  @IsNumber(
    {},
    { message: 'El campo impuesto_transaccion_sol debe ser un número' },
  )
  @IsNotEmpty({
    message: 'El campo impuesto_transaccion_sol no debe estar vacío',
  })
  @Min(0, {
    message: 'El campo impuesto_transaccion_sol no debe ser menor a 0',
  })
  impuesto_transaccion_sol: number;

  @IsNumber(
    {},
    { message: 'El campo impuesto_transaccion_dolar debe ser un número' },
  )
  @IsNotEmpty({
    message: 'El campo impuesto_transaccion_dolar no debe estar vacío',
  })
  @Min(0, {
    message: 'El campo impuesto_transaccion_dolar no debe ser menor a 0',
  })
  impuesto_transaccion_dolar: number;

  @IsString({
    message: 'El campo token_pasarela debe ser una cadena de caracteres',
  })
  @MaxLength(100)
  @IsNotEmpty({ message: 'El campo token_pasarela no debe estar vacío' })
  token_pasarela: string;

  @IsString({
    message: 'El campo numero_transaccion debe ser una cadena de caracteres',
  })
  @MaxLength(15)
  @IsNotEmpty({ message: 'El campo numero_transaccion no debe estar vacío' })
  numero_transaccion: string;

  @IsInt({ message: 'El campo id_servicio debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El campo id_servicio no debe estar vacío' })
  id_servicio: number;

  @IsNumber({}, { message: 'El campo precio_actual_soles debe ser un número' })
  @IsNotEmpty({ message: 'El campo precio_actual_soles no debe estar vacío' })
  @Min(0, {
    message: 'El precio actual en soles no puede ser menor a 0',
  })
  precio_actual_soles: number;

  @IsNumber(
    {},
    { message: 'El campo precio_actual_dolares debe ser un número' },
  )
  @IsOptional()
  @Min(0, {
    message: 'El precio actual en dolares no puede ser menor a 0',
  })
  precio_actual_dolares: number | null;

  @IsString({
    message: 'El campo tipo_servicio debe ser una cadena de caracteres',
  })
  @MaxLength(20, {
    message: 'El tipo del servicio debe ser como maximo de 20 caracteres',
  })
  @IsIn([
    'Curso',
    'Especializacion',
    'Promocion',
    'Plan',
    'Certificado',
    'Ampliacion',
  ])
  @IsNotEmpty({ message: 'El campo tipo_servicio no debe estar vacío' })
  tipo_servicio: string;
}
