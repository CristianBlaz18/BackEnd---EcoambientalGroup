import { Type } from "class-transformer"
import { IsIn, IsInt, IsString, Min } from "class-validator"

export class ObtenerCertificadoPagado{
    @IsInt({message: 'El idServicio debe ser numerico'})
    @Min(1,{message:'El idServicio debe ser como minimo 1'})
    @Type(() => Number)
    idServicio: number

    @IsInt({message: 'El idEstudiante debe ser numerico'})
    @Min(1,{message:'El idEstudiante debe ser como minimo 1'})
    @Type(() => Number)
    idEstudiante: number

    @IsString({message: 'El tipo debe ser string'})
    @IsIn(['Curso', 'Especializacion'],{message: 'El tipo debe ser Curso o Especializacion'})
    tipo: string

    @IsInt({message: 'El idCertificado debe ser numerico'})
    @Min(1, {message: 'El idCertificado debe ser como minimo un 1'})
    @Type(() => Number)
    idCertificado:number

}