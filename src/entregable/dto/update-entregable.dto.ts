import { PartialType } from '@nestjs/swagger';
import { CreateEntregableDto } from './create-entregable.dto';

export class UpdateEntregableDto extends PartialType(CreateEntregableDto) {}
