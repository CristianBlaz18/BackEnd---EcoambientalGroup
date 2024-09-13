import { Type } from "class-transformer";
import { IsInt, IsNumber, IsString } from "class-validator";

export class CertificadoCompradoServicio{

    @Type(() => Number)
    @IsInt({message: 'La variable id_estudiante debe ser de tipo entero'})
    id_estudiante: number;

    @Type(() => Number)
    @IsInt({message: 'La variable id_compra debe ser de tipo entero'})
    id_compra: number;

    @Type(() => Number)
    @IsInt({message: 'La variable id_certificado debe ser de tipo entero'})
    id_certificado: number;
}