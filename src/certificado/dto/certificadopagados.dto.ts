import { Type } from "class-transformer";
import { IsInt, IsString, Min, IsIn } from 'class-validator';

export class CertificadoPagadoDto {
  @IsInt({ message: 'El idContenido debe ser de tipo number-string' })
  @Type(() => Number)
  @Min(1, { message: 'El idContenido debe ser como minimo 1' })
  idContenido: number;

  @IsInt({ message: 'El idEstudiante debe ser de tipo number-string' })
  @Type(() => Number)
  @Min(1, { message: 'El idEstudiante debe ser como minimo 1' })
  idEstudiante: number;

  @IsString({ message: 'El tipo debe ser de tipo string' })
  @IsIn(['Curso', 'Especializacion'], {
    message: 'El tipo debe ser Curso o Especialización.',
  })
  tipoContenido: string;

  @IsInt({ message: 'El idCertificado debe ser de tipo number-string' })
  @Type(() => Number)
  @Min(1, { message: 'El idCertificado debe ser como minimo 1' })
  idCertificado: number;
}
