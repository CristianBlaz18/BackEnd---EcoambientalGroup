import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductCartDto } from './productos-cart.dto';

export class CreateCompraDto {
  @IsInt({ message: 'El id_estudiante debe ser de tipo int' })
  @Min(1, { message: 'El id_estudiante debe ser como minimo 1' })
  id_estudiante: number;

  @IsOptional()
  @IsInt({ message: 'El id_cupon debe ser de tipo int' })
  @Min(1, {
    message: 'El id_cupon debe ser como minimo 1',
  })
  id_cupon?: number;

  @IsNumber({}, { message: 'El precio_total debe ser de tipo number' })
  @Min(0, { message: 'El precio_total debe ser como minimo 0' })
  precio_total: number;

  @IsString({ message: 'El tipo_moneda debe ser de tipo string' })
  @IsIn(['PEN', 'USD'], {
    message: 'El tipo_moneda debe ser PEN, USD',
  })
  tipo_moneda: string;

  // @IsNumber({}, { message: 'El impuestro_transaccion debe ser de tipo number' })
  // @Min(0, { message: 'El impuesto_transaccion debe ser como minimo 0' })
  // impuesto_transaccion?: number;

  // @IsString({ message: 'El token_pasarela debe ser de tipo string' })
  // @MaxLength(100, {
  //   message: 'El token_pasarela debe tener como maximo 100 caracteres',
  // })
  // token_pasarela: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCartDto)
  productos: ProductCartDto[];
}
