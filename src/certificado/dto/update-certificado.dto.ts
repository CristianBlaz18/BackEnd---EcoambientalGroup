import { IsInt, IsNumber, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class UpdateCertificadoDto{
    @IsNumber({},{message:'La idEstudiante debe ser de tipo number'})
    @Min(1,{message:'El idEstudiante no puede ser menor a 1'})
    idEstudiante: number

    @IsNumber({},{message:'El idCurso debe ser de tipo int'})
    @Min(1,{message:'El idCurso no puede ser menor a 1'})
    idCurso: number

    @IsNumber({},{message:'La respuesta del usuario debe ser de tipo int'})
    respuesta: number
    


}