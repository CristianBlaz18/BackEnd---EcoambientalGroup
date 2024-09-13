import { IsNumber, IsNumberString } from "class-validator";

export class RegistrarRespuestaDto {
    @IsNumber({},{ message: 'La variable id_entrega_evaluacion ingresada debe ser de tipo number'})
    id_detalle_evaluacion: number;
    @IsNumber({},{ message: 'La variable id_evaluacion ingresada debe ser de tipo number'})
    id_evaluacion: number;
    @IsNumber({},{ message: 'La variable id_pregunta ingresada debe ser de tipo number'})
    id_pregunta: number;
    @IsNumber({},{ message: 'La variable id_alternativa ingresada debe ser de tipo number'})
    id_alternativa: number;
    ;
    
}