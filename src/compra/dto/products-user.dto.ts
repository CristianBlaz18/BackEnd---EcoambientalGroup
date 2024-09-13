import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class ProductosCompradosDto {
  @IsInt({ message: 'El id_estudiante debe ser de tipo int' })
  @Min(1, { message: 'El id_estudiante debe ser como minimo 1' })
  @Type(() => Number)
  id_estudiante: number;
}
