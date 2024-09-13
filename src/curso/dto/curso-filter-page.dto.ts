import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
export class CursoFilterPageDto {

  @IsNumberString({}, { message: 'El orden debe ser de tipo number' })
  idCurso: number;

  @IsInt({ message: 'El tamaño de pagina debe ser de tipo number' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El tamaño de pagina no debe estar vacio' })
  @Min(1, { message: 'El tamaño de pagina no debe ser menor a 1' })
  sizeCurso: number;
}