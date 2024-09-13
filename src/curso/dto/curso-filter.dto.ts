import { IsNumber, IsString, IsOptional, IsNumberString, IsIn } from 'class-validator';

export class CursoFilterDto {
  // @IsNotEmpty()
  // id_estudiante: number;

  @IsString({ message: 'El nombre_curso  debe ser de tipo string' })
  @IsOptional()
  nombre_curso?: string;

  @IsString( { message: 'El categoria_curso debe ser de tipo string' })
  @IsOptional()
  categoria_curso?: string;
  
  @IsOptional()
    @IsString({message: 'La variable nombre_paquete debe ser de tipo string'})
    nombre_paquete?: string | null;

    
}