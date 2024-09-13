import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsNumberString,

} from 'class-validator';

export class EvaluacionesEstudianteDto {
  
  
  @IsNumberString({},{ message: 'La variable idEvaluacion ingresada debe ser de tipo number' })
  @IsNotEmpty({ message: 'El campo no debe ser vacio' })
  idEstudiante: number;

  @IsNumberString({},{ message: 'La variable idEvaluacion ingresada debe ser de tipo number' })
  @IsNotEmpty({ message: 'El campo no debe ser vacio' })
  idEvaluacion: number;

  @IsNumberString({},{ message: 'La variable IdCurso ingresada debe ser de tipo number' })
  @IsNotEmpty({ message: 'El campo no debe ser vacio' })
  IdCurso: number;

}