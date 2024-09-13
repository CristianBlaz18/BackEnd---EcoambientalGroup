import { IsInt, IsNumberString } from "class-validator"

export class DataEvaluacionDto {
    @IsNumberString({},{ message: 'La variable ingresada debe ser de tipo number'})
    idCurso: number;
    @IsNumberString({},{ message: 'La variable ingresada debe ser de tipo number'})
    idEstudiante: number;
    @IsNumberString({},{ message: 'La variable ingresada debe ser de tipo number'})
    Idevaluacion: number;
}