import { PartialType } from '@nestjs/swagger';
import { CreateCompraCertificadoDto } from './create-compra-certificado.dto';

export class UpdateCompraCertificadoDto extends PartialType(CreateCompraCertificadoDto) {}
