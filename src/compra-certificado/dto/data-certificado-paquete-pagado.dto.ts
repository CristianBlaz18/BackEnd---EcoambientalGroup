import { IsInt, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class DataCertificadoPaquetePagadoDto {
  @IsInt({ message: 'El curso completado debe ser de tipo int' })
  @Min(1, { message: 'El curso completado no debe ser menor a 1' })
  curso_completado: number;

  @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
  id_estudiante: number;

  @IsInt({ message: 'El id del paquete ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del paquete no debe ser menor a 1' })
  id_paquete: number;

  @IsInt({
    message: 'El id del detalle de venta ingresado debe ser de tipo int',
  })
  @Min(1, { message: 'El id del detalle de venta no debe ser menor a 1' })
  id_detalleventa: number;

  @IsInt({
    message: 'El id del tipo de certificado de la debe ser de tipo int',
  })
  @Min(1, { message: 'El id del tipo de certificado no debe ser menor a 1' })
  id_tipo_certificado: number;

  @IsNumber(
    {},
    { message: 'El impuesto transaccional en soles debe ser de tipo number' },
  )
  @Min(0, {
    message: 'El impuesto transaccional en soles no debe ser menor a 0',
  })
  impuesto_transaccion_sol: number;

  @IsString({
    message: 'El token de pasarela ingresado debe ser de tipo string',
  })
  @MaxLength(100)
  token_pasarela: string;

  @IsString({ message: 'El campo numero_transaccion debe ser una cadena de caracteres' })
  @MaxLength(15)
  numero_transaccion: string;
}
