import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaisEstudianteDto {
  @Type(() => Number)
  @IsInt({ message: 'El idEstudiante debe ser de tipo int' })
  @Min(1, { message: 'El idEstudiante debe ser como minimo 1' })
  idEstudiante: number;
}
