import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ForoService } from './foro.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePreguntaDto } from './dto/create_pregunta.dto';
import { RegistrarLikeDto } from './dto/registrar-like-foro.dto';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';

@ApiTags('Foro')
@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  //Foro de un curso matriculado
  @Post('like')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar like',
    description:
      'Esta API permite cambiar el estado del like con los parametros: idPregunta, tipoPor [1: pregunta ; 0: respuesta], idUsuario. SP: sp_registrar_like_foro();',
  })
  async registrarLike(@Body() registrarlikedto: RegistrarLikeDto) {
    return await this.foroService.registrarLike(registrarlikedto);
  }

  @Get('preguntasrespuestas/:institucion/:idCurso/:idUsuario')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Foro de un curso matriculado',
    description:
      'Esta API permite mostrar las preguntas y respuestas de un foro matriculado con los parametros de entrada: institucion, idCurso. SP: sp_listar_foro_curso(), sp_listar_foro_respuestas(), sp_listar_likes_foro(?,?,?);',
  })
  async getPreguntasYRespuestas(
    @Param('institucion') institucion: string,
    @Param('idCurso') idCurso: number,
    @Param('idUsuario') idUsuario: number,
  ) {
    return this.foroService.foro(institucion, idCurso, idUsuario);
  }

  @Post()
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar pregunta foro',
    description:
      'Esta api registrara una pregunta al foro mediante un array que tendra los siguientes datos:{"id_curso":"number","idUsuario":"number","UsuarioPregunta":"string"}. SP: sp_registrar_foro_preguntas(),  sp_listar_foro_respuestas(?), sp_listar_likes_foro(?,?,?)',
  })
  async posPregunta(@Body() createPreguntaDto: CreatePreguntaDto) {
    return await this.foroService.enviara_pregunta(createPreguntaDto);
  }

  @Post('respuesta')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar respuesta',
    description:
      'Esta API registrar una respuesta con los parametros: idPreguntaForo, idUsuario, usuarioRespuesta. SP: sp_registrar_foro_respuestas(), sp_listar_likes_foro(?,?,?);',
  })
  async registrarRespuesta(@Body() CreateRespuestaDto: CreateRespuestaDto) {
    return await this.foroService.registrarForoRespuesta(CreateRespuestaDto);
  }

  @Patch('cambiarEstado')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar respuesta',
    description:
      'En esta Api se actualizara el estado de la respuesta o preugnta con los parametros idUsuario, idPreguntaREspuesta y tipo; el tio es 1 si es pregunta y 0 se es respuesta ; SP: sp_eliminar_foro_por(?,?,?,@estado)',
  })
  async actualizarforo(
    @Query('idUsuario') idUsuario: number,
    @Query('idPreguntaRespuesta') idPreguntaRespuesta: number,
    @Query('tipo') tipo: number,
  ) {
    return await this.foroService.actualizarforo(
      idUsuario,
      idPreguntaRespuesta,
      tipo,
    );
  }
}
