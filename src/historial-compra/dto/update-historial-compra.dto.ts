import { PartialType } from '@nestjs/swagger';
import { CreateHistorialCompraDto } from './create-historial-compra.dto';

export class UpdateHistorialCompraDto extends PartialType(CreateHistorialCompraDto) {}
