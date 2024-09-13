import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionDto } from './create-evaluacion.dto';
import { IsString } from 'class-validator';

export class UpdateEstadoDto  {

    @IsString({ message: 'La variable estado_evaluacion ingresada debe ser de tipo string' })
    estado_evaluacion: string;
}

