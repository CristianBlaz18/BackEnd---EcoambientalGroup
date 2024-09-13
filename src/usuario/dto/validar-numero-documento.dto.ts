import { IsIn, IsNumberString, IsString, MaxLength } from "class-validator";

export class ValidarNumeroDocumentoDto{

    @IsString({message: 'La variable tipo_documento debe se de tipo string'})
    
    pais_origen: string;

    @IsNumberString({}, {message: 'La variable numero_carnet ingresada debe de ser de tipo numerico string'})
    @MaxLength(100, {message: 'La variable numero_carnet ingresada debe tener como maximo 100 caracteres'})
    numero_carnet: string;
}