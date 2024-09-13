import { Type } from 'class-transformer';
import { IsInt, IsString, IsUrl, Min } from 'class-validator';

export class DataRegistroEntregable {
  // @Type(() => Number)
  // @IsInt({ message: 'La variable id_curso debe ser de tipo entero' })
  // @Min(1, { message: 'La variable id_curso debe ser de tipo entero' })
  // id_curso: number;

  @Type(() => Number)
  @IsInt({ message: 'La variable id_estudiante debe ser de tipo entero' })
  id_estudiante: number;

  @Type(() => Number)
  @IsInt({ message: 'La variable id_entregable debe ser de tipo entero' })
  id_entregable: number;

  @IsString({ message: 'La variable urlArchivo debe ser de tipo string' })
  // @IsUrl({}, { message: 'La variable urlArchivo debe ser de tipo url' })
  urlArchivo: string;
}
