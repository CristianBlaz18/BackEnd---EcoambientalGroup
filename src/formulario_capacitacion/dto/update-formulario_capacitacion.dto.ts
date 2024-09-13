import { PartialType } from '@nestjs/swagger';
import { CreateFormularioCapacitacionDto } from './create-formulario_capacitacion.dto';

export class UpdateFormularioCapacitacionDto extends PartialType(CreateFormularioCapacitacionDto) {}
