import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class ActivarPlanDto {
  @IsString({ message: 'El codigo de plan debe ser de tipo string' })
  @MaxLength(50, {
    message: 'El codigo de plan no debe contener mas de 50 caracteres',
  })
  planCodigo: string;

  @IsNumber({}, { message: 'El idEstudiante debe ser de tipo numero' })
  @Min(1, { message: 'El idEstudiante debe ser como minimo 1' })
  @Type(() => Number)
  idEstudiante: number;
}
