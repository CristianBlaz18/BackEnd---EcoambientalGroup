import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class SolicitarEnvioCertificado{
    
    @IsString({message: 'La variable departamento debe ser de tipo string'})
    departamento: string;

    @IsString({message: 'La variable provincia debe ser de tipo string'})
    provincia: string;

    @IsString({message: 'La variable distrito debe ser de tipo string'})
    distrito: string;

    @IsString({message: 'La variable direccion debe ser de tipo string'})
    direccion: string;

    @IsString({message: 'La variable referencia debe ser de tipo string'})
    referencia: string;
}