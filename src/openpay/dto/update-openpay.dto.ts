import { PartialType } from '@nestjs/swagger';
import { CreateOpenpayDto } from './create-openpay.dto';

export class UpdateOpenpayDto extends PartialType(CreateOpenpayDto) {}
