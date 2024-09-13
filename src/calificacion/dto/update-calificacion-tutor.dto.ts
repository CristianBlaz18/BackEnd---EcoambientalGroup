import { PartialType } from '@nestjs/swagger';
import { CreateCalificacionDto } from './create-calificacion.dto';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCalificacionTutorDto extends PartialType(CreateCalificacionDto) {
  @IsString({ message: 'El campo nombre_institucion ' })
  @IsString({ message: 'El campo nombre_institucion no debe estar vacío' })
  nombre_institucion: string;

  @IsNumber({}, { message: 'El campo id_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_curso no debe estar vacío' })
  @Min(1,{message:'El campo id_curso debe ser como minimo 1'})
  id_curso: number;

  @IsNumber({}, { message: 'El campo id_estudiante debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_estudiante no debe estar vacío' })
  @Min(1,{message:'El campo id_estudiante debe ser como minimo 1'})
  id_estudiante: number;

  @IsNumber({},{ message: 'El campo valoracion_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo valoracion_curso debe estar vacío' })
  @IsIn([1,1.5,2,2.5,3,3.5,4,4.5,5], {
    message: 'El campo valoracion_curso debe ser 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5',
  })
  valoracion_tutor: number;

  

}