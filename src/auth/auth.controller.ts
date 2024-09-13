import {
  Controller,
  Body,
  Post,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GetDataDto } from './dto/get-data.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validar/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Validacion Cupones',
    description:
      'Esta API obtiene los datos del usuario despues del login, mediante los parametros:{"institucion":"string(nombre de la institucion)","token":"string"}.SP: sp_validar_login(?,?) ',
  })
  async validarCupones(@Param('idEstudiante') idEstudiante: number) {
    return this.authService.validarCuponesEstudiante(idEstudiante);
  }

  @Post('login/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Esta api permite al usuario registrarse mediante un parametro {"institucion(nombre de la institucion)":"string"} y un array {"user":"string(nombre de la institucion)", "pass":"string(contraseña)"}. SP: sp_iniciar_sesion(?,?,?,@resultado, @rol, @usuario_id, @id_rol, @nombre_usuario_concat, @imagen_usuario), SP: sp_revisar_evaluacion_caducado(institucion,idEstudiante),SP: sp_revisar_entregable_caducado(institucion,idEstudiante,sp_listar_cupones_empresas(?),sp_actualizar_estado_cupon(?),sp_listar_miscupones_vencidos(?),sp_actualizar_estado_miscupones(?))',
  })
  async login(@Param('institucion') institucion: string, @Body() loginDto: LoginDto) {
    return this.authService.login(institucion, loginDto);
  }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Validacion Login',
    description:
      'Esta API obtiene los datos del usuario despues del login, mediante los parametros:{"institucion":"string(nombre de la institucion)","token":"string"}.SP: sp_validar_login(?,?) ',
  })
  obtenerDatos(
    @Param('institucion') institucion: string,
    @Query() getDataDto: GetDataDto,
  ) {
    return this.authService.validacionLogin(institucion, getDataDto);
  }

  // @Get()
  // @ApiHeader({
  //   name: 'token',
  //   description: 'token',
  // })
  // @ApiOperation({
  //   summary: 'Prueba token en header',
  //   description:
  //     'Esta API de prueba obtiene el token que se envie mediante un header ',
  // })
  // pruebaTokenHeader(@Headers('token') token: string) {
  //   const resultado = this.authService.pruebaTokenHeader(token);
  //   return resultado;
  // }
}
