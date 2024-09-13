import { Type } from "class-transformer";
import { IsInt, Min, IsIn } from 'class-validator';

export class PlanIndividualDto{

    @Type(()=> Number)
    @IsInt({message:'La variable de id_plan debe ser de tipo entero'})
    @Min(1, {message: 'La variable id_plan no debe ser menor a 1'})
    @IsIn([1,2,3,4],{message:'La variable de id_plan debe ser 1,2,3 o 4'})
    id_plan: number;
}