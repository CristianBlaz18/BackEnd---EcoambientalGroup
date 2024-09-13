import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class DataEvualuacionNota{
    @Type(()=> Number)
    @IsInt({message: 'La variable id_estudiante debe ser de tipo entero'})
    @Min(1, {message: 'La varible id_estudiante debe ser no menor a 1'})
    id_estudiante: number;
    
    @Type(()=> Number)
    @IsInt({message: 'La variable id_evaluacion debe ser de tipo entero'})
    @Min(1, {message: 'La varible id_evaluacion debe ser no menor a 1'})
    id_evaluacion: number;
}