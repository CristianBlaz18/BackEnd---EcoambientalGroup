import { IsIn, IsInt, IsString, Min, MaxLength, IsNumber, IsNumberString } from 'class-validator';

export class MejorarPlanDto {
  @IsInt({ message: 'El idEstudiante debe ser de tipo int' })
  @Min(1, { message: 'El idEstudiante debe ser como minimo 1' })
  idEstudiante: number;

  @IsInt({ message: 'El idPlan debe ser de tipo int' })
  @Min(1, { message: 'El idPlan debe ser como minimo 1' })
  @IsIn([1, 2, 3, 4], { message: 'El idPlan debe ser 1,2,3 o 4' })
  idPlan: number;

  @IsInt({ message: 'El idPlanNuevo debe ser de tipo int' })
  @Min(1, { message: 'El idPlanNuevo debe ser como minimo 1' })
  @IsIn([1, 2, 3, 4], { message: 'La idPlanNuevo debe ser 1,2,3 o 4' })
  idPlanNuevo: number;
  @IsNumber({}, { message: 'El impuestro_transaccion debe ser de tipo number' })
  @Min(0, { message: 'El impuesto_transaccion debe ser como minimo 0' })
  impuesto_transaccion: number;

  @IsString({ message: 'El token_pasarela debe ser de tipo string' })
  @MaxLength(100, {
    message: 'El token_pasarela debe tener como maximo 100 caracteres',
  })
  token_pasarela: string;

  @IsNumberString({},{message:'El numero_transaccion debe ser de tipo number-string'})
  @MaxLength(15,{message:'El numero_transaccion debe ser como maximo de 15 caractéres'})
  numero_transaccion: number;
}
