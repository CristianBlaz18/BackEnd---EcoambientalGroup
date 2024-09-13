import { IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateEvaluacionDto {
  @IsNumber({}, { message: 'La variable id_evaluacion ingresada debe ser de tipo number' })
  id_evaluacion: number;

  @IsNumber({}, { message: 'La variable id_estudiante ingresada debe ser de tipo number' })
  id_estudiante: number;

}
