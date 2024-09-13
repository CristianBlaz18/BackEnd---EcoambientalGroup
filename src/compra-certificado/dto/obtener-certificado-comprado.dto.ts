import { Type } from "class-transformer";
import { IsInt, IsNumberString, IsString, Min } from "class-validator";

export class ObtenerCertificadoComprado {

    @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
    @Type(() => Number)
    id_servicio: number

    @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
    @Type(() => Number)
    id_estudiante: number

    @IsString({message: 'La variable tipo_servicio debe ser de tipo string'})
    tipo_servicio: string

    @IsInt({ message: 'El id del estudiante ingresado debe ser de tipo int' })
    @Min(1, { message: 'El id del estudiante no debe ser menor a 1' })
    @Type(() => Number)
    id_certificado: number

}