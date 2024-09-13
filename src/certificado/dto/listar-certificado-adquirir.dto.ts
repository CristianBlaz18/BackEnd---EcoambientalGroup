import { Type } from "class-transformer";
import { IsIn, IsNumber, IsString, Min } from "class-validator";

export class ListarCertificadoAdquirirDto{
    @Type(()=> Number)
    @IsNumber({}, {message: 'La variable id_estudiante debe ser de tipo entero'})
    @Min(1, {message: 'La variable debe id_estudiante no debe ser menor a 1'})
    id_estudiante: number;

    @IsString({message: 'La varibale tipo_contenido debe ser de tipo string'})
    @IsIn(['Especializacion', 'Curso'], {})
    tipo_contenido: string;
}


