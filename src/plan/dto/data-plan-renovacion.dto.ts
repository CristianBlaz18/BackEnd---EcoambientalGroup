import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DataPlanRenovacionDto {

    @IsInt({ message: 'La variable id_estudiante debe ser de tipo Entero' })
    @Min(1,{message:'La variable id_estudiante debe ser como mínimo 1'})
    id_estudiante: number;

    @IsInt({ message: 'La variable id_detalle_servicio debe ser de tipo Entero' })
    @Min(1,{message:'La variable id_detalle debe ser como mínimo 1'})
    id_detalle_servicio: number;

    @IsInt({ message: 'La variable id_plan_actual debe ser de tipo Entero' })
    @Min(1,{message:'La variable id_plan_actual debe ser como mínimo 1'})
    id_plan_actual: number;

    @IsNumber({},{ message: 'La variable impuesto_transaccion debe ser de tipo numerico' })
    impuesto_transaccion: number;

    @IsString({ message: 'La variable token_pasarela debe ser de tipo String' })
    token_pasarela: string;
  
    @IsString({ message: 'La variable numero_transaccion debe ser de tipo String' })
    numero_transaccion: string;

}