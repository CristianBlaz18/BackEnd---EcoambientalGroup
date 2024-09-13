import { IsNumber, IsString, IsBoolean, IsNotEmpty, IsIn, IsOptional, IsDecimal, Max, Min } from 'class-validator';
import { Double } from 'typeorm';

export class RegistrarLikeDto {
  @IsNumber({}, { message: 'El campo idPregunta debe ser un número' })
  @IsNotEmpty({ message: 'El campo idPregunta no debe estar vacío' })
  idPregunta: number;

  @IsNumber({}, { message: 'El campo tipoPor debe ser un número' })
  @IsNotEmpty({ message: 'El campo tipoPor no debe estar vacío' })
  tipoPor: number;

  @IsNumber({},{ message: 'El campo idUsuario debe ser un numero' })
  @IsNotEmpty({ message: 'El campo idUsuario no debe estar vacío' })
  idUsuario: number;

    

  
}