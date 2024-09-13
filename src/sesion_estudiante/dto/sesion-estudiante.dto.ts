import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class SesionEstudianteDto {

    @Type(()=> Number)
    @IsNumber({}, {message: 'La variable id_estudiante debe ser tipo numerico'})
    @Min(1, {message: 'La variable id_curso no debe ser menor a 1'})
    id_estudiante: number;

    // @Type(()=> Number)
    // @IsNumber({}, {message: 'La variable id_curso debe ser tipo numerico'})
    // @Min(1, {message: 'La variable id_curso no debe ser menor a 1'})
    // id_curso: number;

    @Type(()=> Number)
    @IsNumber({}, {message: 'La variable id_sesion debe ser tipo numerico'})
    @Min(1, {message: 'La variable id_curso no debe ser menor a 1'})
    id_sesion: number;

}