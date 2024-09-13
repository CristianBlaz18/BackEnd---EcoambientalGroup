import { Type } from "class-transformer"
import { IsInt, Min } from "class-validator"

export class CursosDocenteDto{
    @Type(() => Number)
    @IsInt({message: 'idDocente debe ser un int'})
    @Min(1, {message: 'idDocente debe ser mayor a 0'})
    idDocente: number
    @Type(() => Number)
    @IsInt({message: 'idEstudiante debe ser un int'})
    @Min(1, {message: 'idEstudiante debe ser mayor a 0'})
    idEstudiante: number
}