import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsNumberString, IsIn, Min, Max } from 'class-validator';

export class FiltrarServicioDTO {
  @IsOptional()
  @IsString({message: 'La variable nombre debe ser tipo caracter'})
  nombre?: string;

  @IsOptional()
  @IsNumberString({}, {message: 'La variable orden ingresada debe ser de tipo numerico'})
  @IsIn(['1', '2', '3', '4'], {
    message:
      'El orden debe ser 1:asc por nombre, 2:des por nombre, 3:asc por fecha creacion, 4:des por fecha creacion'
  })
  orden?: number;
}