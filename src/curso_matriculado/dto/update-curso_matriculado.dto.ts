import { PartialType } from '@nestjs/swagger';
import { CreateCursoMatriculadoDto } from './create-curso_matriculado.dto';

export class UpdateCursoMatriculadoDto extends PartialType(CreateCursoMatriculadoDto) {}
