import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class VisualizarDescargaCertificado{
    @IsInt({message: 'idCetificado debe ser numerico'})
    @Min(1,{message:'idCertificado debe ser como minimo 1'})
    @Type(() => Number)
    idCertificado:number;

    @IsInt({message: 'idEstudiante debe ser numerico'})
    @Min(1,{message:'idEstudiante debe ser como minimo 1'})
    @Type(() => Number)
    idEstudiante:number;


}