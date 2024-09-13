import { PartialType } from '@nestjs/swagger';
import { CreateSesionEstudianteDto } from './create-sesion_estudiante.dto';

export class UpdateSesionEstudianteDto extends PartialType(CreateSesionEstudianteDto) {}
