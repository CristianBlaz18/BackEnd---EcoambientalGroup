import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class QuerysCalificacionDto {
  @IsInt({ message: 'El idContenido debe ser de tipo int' })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'El idContenido debe ser de tipo int' })
  idContenido?: number | null = null;

  @IsInt({ message: 'El tipoContenido debe ser de tipo int' })
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1], {
    message: 'El tipoContenido debe ser de tipo 0 para curso y 1 para paquete',
  })
  tipoContenido?: number | null = null;

  @IsInt({ message: 'La pagina debe ser de tipo number' })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'La pagina no debe ser menor a 1' })
  page: number = 1;

  @IsInt({ message: 'El tamaño de pagina debe ser de tipo number' })
  @Type(() => Number)
  @IsOptional()
  @Min(1, { message: 'El tamaño de pagina no debe ser menor a 1' })
  sizePage: number = 5;
}
