import { PartialType } from '@nestjs/swagger';
import { CreateCalificacionDto } from './create-calificacion.dto';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {
  @IsString({ message: 'El campo nombre_institucion ' })
  @IsString({ message: 'El campo nombre_institucion no debe estar vacío' })
  nombre_institucion: string;

  @IsNumber({}, { message: 'El campo id_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_curso no debe estar vacío' })
  @Min(1,{message:'El campo id_curso debe ser como minimo 1'})
  id_curso: number;

  @IsNumber({}, { message: 'El campo id_usuario debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_usuario no debe estar vacío' })
  @Min(1,{message:'El campo id_usuario debe ser como minimo 1'})
  id_usuario: number;

  @IsNumber({},{ message: 'El campo valoracion_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo valoracion_curso debe estar vacío' })
  @IsIn([1,1.5,2,2.5,3,3.5,4,4.5,5], {
    message: 'El campo valoracion_curso debe ser 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5',
  })
  valoracion_curso: number;

  @IsString({ message: 'El campo comentario debe ser un número' })
  @IsNotEmpty({ message: 'El campo comentario no debe estar vacío' })
  comentario: string;

  

  
}
