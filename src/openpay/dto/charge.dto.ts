import { IsString, IsNumber, ValidateNested, IsDate, IsIn, IsNumberString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { In } from 'typeorm';

class CustomerDto {
  @IsString({ message: 'El name debe ser una cadena de texto' })
  name: string;

  @IsString({ message: 'El last_name debe ser una cadena de texto' })
  last_name: string;

  @IsNumberString({ message: 'El phone_number debe ser una cadena de texto' })
  phone_number: string;

  @IsString({ message: 'El email debe ser una dirección de correo electrónico válida' })
  email: string;
}

export class ChargeDto {

  @IsNumber({}, { message: 'El amount debe ser un número' })
  amount: number;

  @IsString({ message: 'El currency debe ser una cadena de texto' })
  @IsIn(['USD', 'PEN'], {
    message:  
      'El orden debe ser USD o PEN'
  })
  currency: string;

  @IsString({ message: 'El description debe ser una cadena de texto' })
  description: string;

  @IsString({ message: 'El redirect_url debe ser tipo string'})
  redirect_url:string;

  @IsString({ message: 'El order_id debe ser una cadena de texto' })
  order_id: string;

  @IsString({ message: 'El expiration_date debe ser una cadena de texto' })
  expiration_date: string;

  @IsString({ message: 'La variable send_email debe ser tipo boolean true or false'})
  @IsIn(['true','false'])
  send_email

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;
}


