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

export class PaqueteFilterDto {
  @IsOptional()
  @IsString({ message: 'El input debe ser de tipo string' })
  // @Matches(/^[A-Za-z0-9\s]+$/, {
  //   message: 'El input solo debe contener letras, números y espacios.',
  // })
  @MaxLength(200, { message: 'El input maximo es de 200 caracteres' })
  input?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El orden debe ser de tipo number' })
  @IsIn(['1', '2', '3', '4', '5', '6'], {
    message:
      'El orden debe ser 1:asc por nombre, 2:des por nombre, 3:asc por fecha, 4:des por fecha, 5:asc por precio y 6:desc por precio',
  })
  orden?: number;

  @IsNotEmpty({ message: 'El tipo no debe estar vacio' })
  @IsNumberString({}, { message: 'El tipo debe ser de tipo number' })
  @IsIn(['0', '1'], {
    message: 'El tipo debe ser 0:especialización o 1:promoción',
  })
  tipo: number;

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
