import { PartialType } from '@nestjs/swagger';
import { CreatePreguntaFrecuenteDto } from './create-pregunta-frecuente.dto';

export class UpdatePreguntaFrecuenteDto extends PartialType(CreatePreguntaFrecuenteDto) {}
