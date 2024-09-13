import { Type } from "class-transformer"
import { IsInt, Min } from "class-validator"

export class ProgresoDto {
    
    @IsInt({message:'El idCurso debe ser de tipo int'})
    @Min(1,{message:'El idCurso debe ser como minimo 1'})
    @Type(() => Number)
    idCurso:number

    @IsInt({message:'El idEstudiante debe ser de tipo int'})
    @Min(1,{message:'El idEstudiante debe ser como minimo 1'})
    @Type(() => Number)
    idEstudiante:number
}