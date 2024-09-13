import { IsString } from 'class-validator';

export class ValidateUsuario {
  @IsString({ message: 'El parametro usuarioNick debe ser de tipo string' })
  usuarioNick: string;
}
