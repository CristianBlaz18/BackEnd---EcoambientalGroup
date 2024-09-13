import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class CertificadoDto {
  
  @IsInt( { message: 'El idContenido debe ser de tipo number-string' })
  @Type(() => Number)
  @Min(1,{message:'El idContenido debe ser como minimo 1'})
  id_contenido: number;

  @IsInt( { message: 'El id_estudiante debe ser de tipo number-string' })
  @Type(() => Number)
  @Min(1,{message:'El id_estudiante debe ser como minimo 1'})
  id_estudiante: number;

  @IsString({ message: 'El tipo debe ser de tipo string' })
  @IsIn(['Curso', 'Especializacion'],{message:'El tipo debe ser Curso o Especialización.'})
  tipo: string;

}
