import {
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
export class CreateCompraPlanDto {
  @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
  id_estudiante: number;

  @IsInt({ message: 'El id del plan ingresado debe ser de tipo int' })
  @Min(1, { message: 'El id del plan no debe ser menor a 1' })
  @IsIn([1, 2, 3, 4], { message: 'El del plan debe ser 1,2,3 o 4' })
  id_plan: number;

  @IsInt({ message: 'El id de la compra ingresada debe ser de tipo int' })
  @Min(1, { message: 'El id de la compra no debe ser menor a 1' })
  id_compra: number;

  @IsNumber(
    {},
    { message: 'El precio total ingresado debe ser de tipo numero' },
  )
  @Min(0, { message: 'El precio total no debe ser menor a 0' })
  precio_total: number;

  @IsString({ message: 'El tipo de moneda debe ser de tipo string' })
  @IsIn(['USD', 'PEN'], {
    message: 'El tipo de moneda debe ser: USD, PEN',
  })
  tipo_moneda: string;
}
