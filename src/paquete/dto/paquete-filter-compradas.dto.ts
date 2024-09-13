import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Paquete } from '../entities/paquete.entity';

export class PaqueteFilterCompradas{

    @IsNotEmpty({ message: 'El tipo no debe estar vacio' })
    @IsNumberString({},{message: 'La variable id_estudiante debe ser de tipo entero'})
    id_estudiante: number;
    
    @IsOptional()
    @IsString({message: 'La variable nombre_paquete debe ser de tipo string'})
    nombre_paquete?: string | null;

    @IsNumberString({},{message: 'La variable tipo_paquete debe ser de tipo numerico'})
    @IsIn(['0', '1'], {
        message:  
          'El orden debe ser 0: especializacion, 1: promocion'
      })
    tipo_paquete?: number;
    
}