import { IsNumber, IsString } from "class-validator";

export class ResenaCursoDto {
    @IsNumber({},{message:'El id_curso debe ser una variable numerica.'})
    id_curso: number;
    @IsString({message:'La institucion debe ser String'})
    nombre_institucion: string;
    @IsNumber({},{message:'El id_cmatricula debe ser una variable numerica.'})
    id_matricula: number;
  }