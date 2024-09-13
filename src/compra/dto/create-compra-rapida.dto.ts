import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCompraRapidaDto {
  @IsInt({ message: 'El id del estudiante debe ser de tipo number' })
  @Min(1, { message: 'El id del estudiante no puede ser menor a 1' })
  id_estudiante: number;

  @IsInt({ message: 'El id del servicio debe ser de tipo number' })
  @Min(1, { message: 'El id del servicio no puede ser menor a 1' })
  id_servicio: number;

  @IsString({
    message: 'El campo tipo_servicio debe ser una cadena de caracteres',
  })
  @MaxLength(20, {
    message: 'El tipo del servicio debe ser como maximo de 20 caracteres',
  })
  @IsIn([
    'Curso',
    'Especialziacion',
    'Promocion',
    'Plan',
    'Certificado',
    'Ampliacion',
  ])
  tipo_servicio: string;

  @IsNumber(
    {},
    { message: 'El impuesto de transaccion en soles debe ser de tipo number' },
  )
  @Min(1, {
    message: 'El impuestro de transaccion en soles no debe ser menor a 1',
  })
  impuesto_transaccion_sol: number;

  @IsNumber(
    {},
    { message: 'El campo impuesto_transaccion_dolar debe ser de tipo number' },
  )
  @Min(0, {
    message: 'El campo impuesto_transaccion_dolar no debe ser menor a 0',
  })
  impuesto_transaccion_dolar: number;

  @IsString({ message: 'El token de pasarella debe ser de tipo string' })
  @MaxLength(100)
  token_pasarela: string;

  @IsString({ message: 'El numero de transaccion debe ser de tipo string' })
  @MaxLength(15)
  numero_transaccion: string;

  @IsInt({ message: 'El id del cupon debe ser de tipo number o null' })
  @Min(1, { message: 'El id del cupon no puede ser menor a 1' })
  @IsOptional()
  id_cupon?: number | null;

  @IsString({
    message: 'El campo tipo_moneda debe ser una cadena de caracteres',
  })
  @IsIn(['USD', 'PEN', 'EUR'], {
    message: 'El tipo de moneda debe ser: USD, PEN o EUR',
  })
  tipo_moneda: string;

  @IsString({ message: 'El campo nombre debe ser de tipo string' })
  nombre: string;

  @IsString({ message: 'El campo imagen debe ser de tipo string' })
  imagen: string;

  @IsInt({ message: 'El tiempo de acceso debe ser de tipo int' })
  @Min(1, { message: 'El timempo de aceso no debe ser menor a 1' })
  tiempo_acceso: number;

  @IsNumber({}, { message: 'El campo precio_actual_soles debe ser un número' })
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
  precio_actual_dolares?: number | null;

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
  estudiante_pais: string;

  @IsInt({ message: 'El campo micupon debe ser de tipo int' })
  @Min(1, { message: 'El campo mi cupon no debe ser menor a 1' })
  @IsOptional()
  micupon?: number | null;

  @IsInt({ message: 'El campo plan_codigo debe ser de tipo int' })
  @Min(1, { message: 'El campo plan_codigo no debe ser menor a 1' })
  @IsOptional()
  plan_codigo?: number | null;
}
