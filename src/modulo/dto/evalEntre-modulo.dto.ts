import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';
export class MostrarEvalEntreDto {
  @Type(() => Number)
  @IsInt({ message: 'El idCurso debe ser de tipo int' })
  @Min(1, { message: 'El idCurso no debe ser menor a 1' })
  idCurso: number;


}