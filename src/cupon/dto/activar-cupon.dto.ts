import { Type } from "class-transformer";
import { IsNumber, IsString, MaxLength, Min } from "class-validator";

export class ActivarCuponDto{
    @IsString({message:'El codigo de cupon debe ser de tipo string'})
    @MaxLength(50,{message:'El codigo de cupon no debe contener mas de 50 caracteres'})
    codigoCupon:string;

    @IsNumber({},{message:'El idEstudiante debe ser de tipo numero'})
    @Min(1,{message:'El idEstudiante debe ser como minimo 1'})
    @Type(() => Number)
    idEstudiante:number;

    @IsString({message:'La institucion debe ser de tipo string'})
    @MaxLength(100,{message:'La institucion de cupon no debe contener mas de 50 caracteres'})
    institucion:string;
}