import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class ProductCartDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  id_cupon?: number;

  @IsString()
  @IsIn(['Certificado','Curso','Especializacion','Promocion'])
  tipo: string;

  // @IsNumber()
  // precio_soles: number;

  // @IsNumber()
  // @IsOptional()
  // precio_soles_antes?: number;

  // @IsNumber()
  // precio_dolar: number;

  // @IsNumber()
  // @IsOptional()
  // precio_dolar_antes?: number;
}
