import { IsNumber, IsString, IsBoolean, IsNotEmpty, IsIn, IsOptional, IsDecimal, Max, Min } from 'class-validator';
import { Double } from 'typeorm';

export class CreatePreguntaDto {
  // @IsNumber({}, { message: 'El campo idForo debe ser un número' })
  // @IsNotEmpty({ message: 'El campo idForo no debe estar vacío' })
  // idForo: number;
  @IsNumber({}, { message: 'El campo idCurso debe ser un número' })
  @IsNotEmpty({ message: 'El campo idCurso no debe estar vacío' })
  idCurso: number;

  @IsNumber({}, { message: 'El campo idUsuario debe ser un número' })
  @IsNotEmpty({ message: 'El campo idUsuario no debe estar vacío' })
  idUsuario: number;

  @IsString({ message: 'El campo UsuarioPregunta debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El campo UsuarioPregunta no debe estar vacío' })
  UsuarioPregunta: string;

}