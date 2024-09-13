import { IsIn, IsNumber, IsNumberString, IsString, MaxLength } from "class-validator";

export class ValidarNumeroDocumentoDto{

    @IsString({message: 'La variable tipo_documento debe se de tipo string'})
    @IsIn([
        'Argentina',
        'Bahamas',
        'Barbados',
        'Bolivia',
        'Brasil',
        'Canadá',
        'Chile',
        'Colombia',
        'Costa Rica',
        'Cuba',
        'Dominica',
        'Ecuador',
        'El Salvador',
        'España',
        'Estados Unidos',
        'Granada',
        'Guatemala',
        'Guyana',
        'Honduras',
        'Jamaica',
        'México',
        'Nicaragua',
        'Panamá',
        'Paraguay',
        'Perú',
        'Puerto Rico',
        'República Dominicana',
        'Surinam',
        'Trinida y Tobago',
        'Uruguay',
        'Venezuela',
      ])
    pais_origen: string;

    @IsNumberString({}, {message: 'La variable numero_carnet ingresada debe de ser de tipo numerico string'})
    @MaxLength(100, {message: 'La variable numero_carnet ingresada debe tener como maximo 100 caracteres'})
    numero_carnet: string;
}