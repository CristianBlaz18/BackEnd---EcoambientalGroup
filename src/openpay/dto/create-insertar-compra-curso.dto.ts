import {
    IsIn,
    IsInt,
    IsNumber,
    IsString,
    MaxLength,
    Min,
  } from 'class-validator';
  
  export class CreateComprarCursoDto {
    @IsInt({ message: 'El id del cupon debe ser de tipo int' })
    @Min(1, { message: 'El id del cupon no debe ser menor a 1' })
    id_cupon: number;
  
    @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
    id_estudiante: number;
  
    @IsInt({ message: 'El id del curso ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id del curso no debe ser menor a 1' })
    id_curso: number;
  
    @IsInt({ message: 'El id de la compra ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id de la compra no debe ser menor a 1' })
    id_compra: number;
  
    // @IsNumber(
    //   {},
    //   { message: 'El precio total ingresado debe ser de tipo number' },
    // )
    // @Min(0, {
    //   message: 'El precio total no puede ser menor a 0',
    // })
    // precio_total: number;
  
    @IsString({ message: 'El tipo de moneda ingresado debe ser de tipo int' })
    @IsIn(['PEN', 'USD'])
    tipo_moneda: string;
  }
  