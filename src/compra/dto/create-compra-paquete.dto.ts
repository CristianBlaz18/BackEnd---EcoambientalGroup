import { IsIn, IsInt, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateCompraPaqueteDto {

  @IsInt({ message: 'El id de la compra ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id de la compra no debe ser menor a 1' })
  id_compra: number;

  @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
  id_estudiante: number;

  @IsInt({ message: 'El id del paquete ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del paquete no debe ser menor a 1' })
  id_paquete: number;

  @IsInt({ message: 'El id del cupon ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del cupon no debe ser menor a 1' })
  id_cupon: number;

  @IsNumber({},{ message: 'El precio total ingresado debe ser de tipo number' })
  @Min(0, {
    message: 'El precio total no puede ser menor a 0',
  })
  precio_total: number;

  @IsString({ message: 'El tipo de moneda ingresado debe ser de tipo string' })
  @IsIn(['PEN', 'USD'])
  tipo_moneda: string;
}
