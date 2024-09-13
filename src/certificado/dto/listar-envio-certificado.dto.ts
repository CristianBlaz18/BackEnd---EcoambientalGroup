import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class ListarEnvioCertificadoDto{
    @Type(()=>Number)
    @IsNumber({}, {message: 'La variable id_estudiante debe ser de tipo numerico'})
    @Min(1, {message: 'La variable de id_estudiante no debe ser menor a 1'})
    id_estudiante: number;

    @Type(()=>Number)
    @IsNumber({}, {message: 'La variable id_certificado debe ser de tipo numerico'})
    @Min(1, {message: 'La variable de id_certificado no debe ser menor a 1'})
    id_certificado: number
}