import { IsIn, IsInt, Min } from "class-validator";

export class NotificarFinCursoDto{
    @IsInt({message:'El campo idCurso debe ser de tipo int'})
    @Min(1,{message:'El campo idCurso debe ser como minimo 1'})
    idCurso: number;

    @IsInt({message:'El campo idMatricula debe ser de tipo int'})
    @Min(1,{message:'El campo idMatricula debe ser como minimo 1'})
    idMatricula: number;

    @IsInt({message:'El campo idEstudiante debe ser de tipo int'})
    @Min(1,{message:'El campo idEstudiante debe ser como minimo 1'})
    idEstudiante: number;

    @IsInt({message:'El campo estadoMatricula debe ser de tipo int'})
    @IsIn([0,1],{message:'El campo estadoMatricula debe ser de 0(en progreso) o 1(culminado)'})
    estadoMatricula: number;
}