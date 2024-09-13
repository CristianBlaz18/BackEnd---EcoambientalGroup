import { IsNumber, IsString, IsBoolean, IsNotEmpty, IsIn, IsOptional, IsDecimal, Max, Min } from 'class-validator';
import { Double } from 'typeorm';

export class CreateRespuestaDto {
  @IsNumber({}, { message: 'El campo idPreguntaForo debe ser un número' })
  @IsNotEmpty({ message: 'El campo idPreguntaForo no debe estar vacío' })
  idPreguntaForo: number;

  @IsNumber({}, { message: 'El campo idUsuario debe ser un número' })
  @IsNotEmpty({ message: 'El campo idUsuario no debe estar vacío' })
  idUsuario: number;

  @IsString({ message: 'El campo UsuarioRespuesta debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El campo UsuarioRespuesta no debe estar vacío' })
  UsuarioRespuesta: string;

}