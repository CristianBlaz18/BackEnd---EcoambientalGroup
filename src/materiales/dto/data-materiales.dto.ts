import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class DataMaterialesDto{
    @Type(()=> Number)
    @IsInt({message: 'La varible id_estudiante debe ser de tipo entero'})
    @Min(1, {message: 'La variable id_estudiante no debe ser menor a 1'})
    id_estudiante: number;

    @Type(()=> Number)
    @IsInt({message: 'La varible id_id_curso debe ser de tipo entero'})
    @Min(1, {message: 'La variable id_curso no debe ser menor a 1'})
    id_curso: number;
}