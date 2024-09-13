import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateClaveUsuario } from './dto/update-clave-usuario.dto';
import { ValidateUsuario } from './dto/validate-usuario.dto';
import { ProfileUsuario } from './dto/profile-usuario.dto';
import { TokenDto } from './dto/token.dto';
import { ValidarNumeroDocumentoDto } from './dto/validar-numero-documento.dto';
import { ValidarCorreoDto } from './dto/validar-correo.dto';
import { PaisEstudianteDto } from './dto/validar-pais.dto';
import { UpdateCorreoUsuario } from './dto/update-correo-usuario.dto';
import { CreateDocenteDto } from './dto/create-docente.dto';

@ApiTags('Usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Crear Usuario',
    description:
      'Esta api creara un nuevo usuario mediante un array y un parametro, el parametro sera del nombre de la institucion y el array que tendra los siguientes datos: {"correo": "string","clave": "string","nombres": "string","apellidos": "string","pais_origen": "string","carnet_identidad": "DNI","nombre_usuario": "string","fecha_nacimiento": "string","telefono": "string","pais": "string","genero": "Masculino","grado_estudio": "string","grado_ocupacion": "string","carrera": "string","publicidad": true}. SP: sp_crear_usuario(), sp_validar_numero_documento(?,?,?,@resultado)',
  })
  async crearUsuario(
    @Param('institucion') institucion: string,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    try {
      return this.usuarioService.crearUsuario(institucion, createUsuarioDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Manejar el error de entrada duplicada, por ejemplo, lanzar un error específico o devolver un mensaje más amigable.
        throw new Error('Error al crear usuario. Datos duplicados.');
      }
      console.log(error);
      throw new Error('Error al crear usuario ' + error.message);
    }
  }

  @Get('validar/:institucion')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Validar nickname de usuario',
    description:
      'Esta Api validara si el nickname del usuario ya existe con los parametros:{"institucion":"string(nombre de la institucion)", "usuarioNick":"string", "token"(id_usuario):"string"}; si existe el nickname devolvera(no puede actualizar) 1 y 0 si no existe o es el mismo nombre(puede actualizar)  SP: sp_validar_existencia_usuario()',
  })
  async validarUsuario(
    @Param('institucion') institucion: string,
    @Headers() tokenDto: TokenDto,
    @Query() validateUsuario: ValidateUsuario,
  ) {
    return this.usuarioService.validarUsuarios(
      institucion,
      tokenDto,
      validateUsuario,
    );
  }

  @Patch('email')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Actualizar correo',
    description:
      'Mediante el parametro:{"idUsuario":"number(id del usuario)} y el array:{"pass":"string(contraseña)","correo":"string(nuevo correo)",. SP: sp_actualizar_correo(?,?,?) ',
  })
  actualizarCorreoUsuario(
    @Headers('token') token: string,
    @Body() updateCorreoUsuario: UpdateCorreoUsuario,
  ) {
    return this.usuarioService.actualizarCorreoUsuario(
      token,
      updateCorreoUsuario,
    );
  }

  @Patch('/:institucion')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Actualizar Datos de Usuario',
    description:
      'Esta API permitira al usuario modificar los datos del usuario, recibira como parametro:{"institucion":"string(nombre de la institucion)", "token(id_usuario)":"string"} y body: {"nombre_usuario": "string","fecha_nacimiento": "string","telefono": "string","pais": "string","grado_estudio": "string","ocupacion": "string","imagen": "string"}. SP: sp_actualizar_datos_perfil()',
  })
  actualizar(
    @Param('institucion') institucion: string,
    @Headers('token') token: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.actualizardatos(
      institucion,
      token,
      updateUsuarioDto,
    );
  }

  @Patch('password/:institucion')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Actualizar Password',
    description:
      'Mediante el parametro:{"institucion":"string(nombre de institucion)} y el array:{"pass":"string(contraseña actual)","newPass":"string(contraseña nueva)","token":"string"}. SP: sp_actualizar_contraseña(?,?,?) ',
  })
  actualizarclave(
    @Param('institucion') institucion: string,
    @Headers('token') token,
    @Body() updateClaveUsuario: UpdateClaveUsuario,
  ) {
    return this.usuarioService.actualizarClave(
      institucion,
      token,
      updateClaveUsuario,
    );
  }

  @Delete('')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Eliminar Usuario',
    description:
      'Esta API elminará a un usuario mediante el body{"token":"string"} que será el id del usuario en el procedimiento sp_dar_baja_cuenta()',
  })
  eliminar(@Headers('token') token: string) {
    return this.usuarioService.eliminarcuenta(token);
  }

  @Get('perfil/:institucion')
  @ApiHeader({
    name: 'token',
    description: 'token',
  })
  @ApiOperation({
    summary: 'Perfil del Estudiante',
    description:
      'Este API mostrara los detalles del perfil del estudiante que tiene por parametro{"institución":"string"} y con un body{"token":"string"}. SP: sp_filtrar_perfil_usuario()',
  })
  perfilusuario(
    @Param('institucion') institucion: string,
    @Headers('token') token: string,
    @Query() profileUsuario: ProfileUsuario,
  ) {
    return this.usuarioService.perfilusuario(
      institucion,
      token,
      profileUsuario,
    );
  }

  @Get('validar-documento/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Validar numero de documento',
    description:
      'Esta Api validara el numero de documento del usuario mediante los parametros:{"institucion":"string(nombre de la institucion)", "tipo_documento":"string", "numero_documento":"string"}; si existe devolvera 1 y 0 si no existe; SP: sp_validar_numero_documento()',
  })
  validarnumerodocumento(
    @Param('institucion') institucion: string,
    @Query() validarNumeroDocumentoDto: ValidarNumeroDocumentoDto,
  ) {
    return this.usuarioService.validarNumeroDocumento(
      institucion,
      validarNumeroDocumentoDto,
    );
  }

  @Get('validar-correo/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Validar correo',
    description:
      'Esta Api validara el correo del usuario mediante los parametros:{"institucion":"string(nombre de la institucion)", "correo":"string"}; si existe devolvera 1 y 0 si no existe; SP: sp_validar_correo()',
  })
  validarcorreo(
    @Param('institucion') institucion: string,
    @Query() validarcorreoDto: ValidarCorreoDto,
  ) {
    return this.usuarioService.validarCorreo(institucion, validarcorreoDto);
  }

  @Get('pais/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Visualizar pais de un estudiante',
    description:
      'Mediante el parametro:{"idEstudiante":"number"}. SP: sp_pais_estudiante(?, @pais_estudiante)',
  })
  paisEstudiante(@Query() paisEstudianteDto: PaisEstudianteDto) {
    return this.usuarioService.paisEstudiante(paisEstudianteDto);
  }

  @Patch('codigo/:idUsuario/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Enviar correo y actualizar',
    description:
      'Mediante el idUsuario se genera un codigo se envia el codigo y se actualiza el codigo de verificacion. SP: sp_actualizar_codigo_verificacion(?,?)',
  })
  actualizarCodigo(@Param('idUsuario') idUsuario: number,
  @Param('institucion') institucion: string) {
    try {
      return this.usuarioService.actualizarCodigo(institucion,idUsuario);
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar pais del estudiante ' + error.message);
    }
  }
  
  @Patch('estadoCodigo/:idUsuario/:codigo')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Actualizar estado de verificacion',
    description:
      'Mediante el idUsuario se actualiza el estado si esta verificado o no. SP: sp_actualizar_estado_verificacion(?)',
  })
  actualizarEstadoCodigo(
    @Param('idUsuario') idUsuario: number,
    @Param('codigo') codigo: string,
  ) {
    try {
      return this.usuarioService.actualizarEstadoCodigo(idUsuario, codigo);
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar pais del estudiante ' + error.message);
    }
  }
  @Patch('recuperar/:correo/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Actualizar Password',
    description:
      'Mediante el parametro:{"correo":"string(nombre de institucion)} . SP: sp_actualizar_clave(?,?) ',
  })
  recuperarClave(
    @Param('correo') correo: string,
    @Param('institucion') institucion: string
  ) {
    return this.usuarioService.restablecerContrasena(
      correo,institucion
    );
  }
  @Post(':institucion/:tipoUsuario')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Crear Docente y tutor',
    description:
      'Esta api creara un nuevo usuario mediante un array y un parametro, el parametro sera del nombre de la institucion y el array que tendra los siguientes datos: {"correo": "string","clave": "string","primer_nombre": "string","segundo_nombre": "string","apellido_paterno": "string","apellido_materno": "string","tipo_carnet": "string","carnet_identidad": "DNI","nombre_usuario": "string","fecha_nacimiento": "string","telefono": "string","pais": "string","genero": "Masculino","grado_estudio": "string","grado_ocupacion": "string","carrera": "string","publicidad": true}. SP: sp_crear_usuario(), sp_validar_numero_documento(?,?,?,@resultado)',
  })
  async crearDocenteTutor(
    @Param('institucion') institucion: string,
    @Param('tipoUsuario') tipoUsuario: string,
    @Body() createDocenteDto: CreateDocenteDto,
  ) {
    try {
      return this.usuarioService.crearDocenteTutor(institucion,tipoUsuario, createDocenteDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Manejar el error de entrada duplicada, por ejemplo, lanzar un error específico o devolver un mensaje más amigable.
        throw new Error('Error al crear usuario. Datos duplicados.');
      }
      console.log(error);
      throw new Error('Error al crear usuario ' + error.message);
    }
  }

  @Post('validarCorreo/:idEstudiante/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Validar Correo',
    description:
      'Esta API permite validar el correo del estudiante con los parametros idEstudiante, institucion en el procedimiento almacenado sp_validar_verificacion_correo(?,?)',
  })
  async validarCorreo(
    @Param('idEstudiante') idEstudiante: number,
    @Param('institucion') institucion: string
  ) {
    try {
      return this.usuarioService.validarCorreoEstudiante(idEstudiante,institucion);
    } catch (error) {
      
      console.log(error);
      throw new Error('Error al validar correo' + error.message);
    }
  }
}
