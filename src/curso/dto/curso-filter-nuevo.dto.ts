import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsNumberString,
  MaxLength,
  IsIn,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CursoFilterNewDto {
  @IsOptional()
  @IsString({ message: 'La variable input ingresada debe ser de tipo string' })
  @MaxLength(200, { message: 'El input maximo es de 200 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La variable tipo ingresada debe ser de tipo string' })
  @IsIn(['Pagado', 'Gratuito'])
  tipo?: string;

  @IsOptional()
  @IsString({ message: 'La variable modalidad ingresada debe ser de tipo string' })
  @IsIn(['Asincrónico', 'Vivo', 'Mixto'])
  modalidad?: string;

  

  @IsOptional()
  @IsString({ message: 'La variable nivel ingresada debe ser de tipo string' })
  @IsIn(['Básico', 'Intermedio', 'Avanzado'])
  nivel?: string;

  @IsOptional()
  @IsString({
    message: 'La variable categoria ingresada debe ser de tipo string',
  })
  categoria?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El orden debe ser de tipo number' })
  @IsIn(['1', '2', '3', '4', '5', '6'], {
    message:
      'El orden debe ser 1:asc por nombre, 2:des por nombre, 3:asc por fecha inicio, 4:des por fecha inicio, 5:asc por precio y 6:desc por precio',
  })
  orden?: number;

  @IsInt({ message: 'La pagina debe ser de tipo number' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'La pagina no debe estar vacio' })
  @Min(1, { message: 'La pagina no debe ser menor a 1' })
  page: number;

  @IsInt({ message: 'El tamaño de pagina debe ser de tipo number' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El tamaño de pagina no debe estar vacio' })
  @Min(1, { message: 'El tamaño de pagina no debe ser menor a 1' })
  sizePage: number;
}
