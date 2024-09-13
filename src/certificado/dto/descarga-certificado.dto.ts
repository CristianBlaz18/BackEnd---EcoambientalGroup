import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class DescargaCertificadoDto{
    @IsInt({message:'idCertificadoPropio debe ser de tipo Int'})
    @Min(1,{message:'idCertificado debe ser como minimo 1'})
    @Type(() => Number)
    idCertificadoPropio: number
}