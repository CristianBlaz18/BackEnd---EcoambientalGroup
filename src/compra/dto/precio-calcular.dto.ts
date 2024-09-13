import { IsNumber, IsOptional, IsString, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductoDto {
  @IsNumber()
  idProducto: number;

  @IsNumber()
  @IsOptional()
  id_cupon?: number;

  @IsString()
  @IsIn(['Certificado', 'Curso', 'Especializacion', 'Promocion'])
  tipo: string;
  
  @IsString({ message: 'El tipo_moneda debe ser de tipo string' })
  @IsIn(['PEN', 'USD'], {
    message: 'El tipo_moneda debe ser PEN, USD',
  })
  tipo_moneda: string;
}

export class PrecioDto {
  @ValidateNested({ each: true })
  @Type(() => ProductoDto)
  productos: ProductoDto[];
}