import { Type } from "class-transformer";
import { IsInt, IsNumberString, IsOptional, IsString } from "class-validator";

export class DataHistorialCompra{

    @IsNumberString({},{message: 'La variable id_estudiante debe ser de tipo numerico string'})
    id_estudiante: string;

    @IsNumberString({},{message: 'La variable id_compra debe ser de tipo numerico string'})
    @IsOptional()
    id_compra?: string;
}