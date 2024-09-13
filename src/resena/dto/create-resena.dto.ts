import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsDecimal,
  Max,
  Min,
} from 'class-validator';
import { Double } from 'typeorm';

export class CreateResenaDto {
  @IsString({
    message: 'El campo nombre_institucion debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El campo nombre_institucion no debe estar vacío' })
  nombre_institucion: string;

  @IsNumber({}, { message: 'El campo id_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_curso no debe estar vacío' })
  @Min(1,{message:'El campo id_curso debe ser como minimo 1'})
  id_curso: number;

  @IsNumber({}, { message: 'El campo id_usuario debe ser un número' })
  @IsNotEmpty({ message: 'El campo id_usuario no debe estar vacío' })
  @Min(1,{message:'El campo id_usuario debe ser como minimo 1'})
  id_estudiante: number;

  @IsNumber({}, { message: 'El campo calificacion_curso debe ser un número' })
  @IsNotEmpty({ message: 'El campo calificacion_curso no debe estar vacío' })
  @Min(1, { message: 'La calificación del curso debe ser igual o mayor a 1' })
  @Max(5, { message: 'La calificación del curso debe ser igual o menor a 5' })
  calificacion_curso: number;

  @IsString({
    message: 'El campo comentario_curso debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'El campo comentario_curso no debe estar vacío' })
  comentario_curso: string;
}
