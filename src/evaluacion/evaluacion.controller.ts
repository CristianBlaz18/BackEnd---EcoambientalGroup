import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EvaluacionesEstudianteDto } from './dto/evaluaciones-estudiante.dto';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { RegistrarRespuestaDto } from './dto/registrar-respuesta.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@ApiTags('Evaluacion')
@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Get(
    'validacion/:institucion/:idEvaluacion/:idEstudiante/:idEntregableEvaluacion',
  )
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar Preguntas Validado',
    description:
      'Lista las preuntas de los estudiantes con los parametros de entrada institucion, idEvaluacion, idEstudiante donde te listara las preguntas si tienen intentos y te listara las preguntas donde se quedo en caso de que se quede sin conexion se utiliza en los SP:sp_listar_estado_pregunta(),sp_listar_estado_evaluacion(),sp_listar_estado_alternativa(), sp_listar_numeros_intentos_evaluacion(?,?)',
  })
  async listarPreguntasRespuestas(
    @Param('institucion') institucion: string,
    @Param('idEvaluacion') idEvaluacion: number,
    @Param('idEstudiante') idEstudiante: number,
    @Param('idEntregableEvaluacion') idEntregableEvaluacion: number,
  ) {
    return await this.evaluacionService.evaluacionesIntentos(
      institucion,
      idEvaluacion,
      idEstudiante,
      idEntregableEvaluacion,
    );
  }

  @Get('evaluacionDetalle/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar Evaluacion Detalle ',
    description:
      'Esta API permite listar la evaluacion de cada estudiante con los parametros:{idEstudiante,IdEvaluacion}; SP: sp_listar_evaluacion_detalles(), sp_visualizar_notas_evaluacion()',
  })
  async getEvaluacionesEstudiante(
    @Param('institucion') institucion: string,
    @Query() evaluacionEstudianteDto: EvaluacionesEstudianteDto,
  ) {
    return await this.evaluacionService.getEvaluacionEstudiante(
      institucion,
      evaluacionEstudianteDto,
    );
  }

  @Get(':idModulo')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'listado de evaluacion',
    description:
      'Esta API permite listar la evaluacion que tiene un estudiante mediante el parametro:{"id_estudinte":"number"}; sp_listar_evaluacion(?)',
  })
  evaluacion(@Param('idModulo') idModulo: number) {
    return this.evaluacionService.evaluaciones(idModulo);
  }

  // @Get('pregunta/:idevaluacion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({summary: 'listado preguntas de evaluaciones', description: 'Esta API permite listar las preguntas de la evaluacion mediante el parametro:{"id_evaluacion":"number"}; sp_listar_preguntas_evaluacion(?)'})
  // preguntaevaluacion(@Param('idevaluacion') idEvaluacion: number){
  //   return this.evaluacionService.preguntaEvaluacion(idEvaluacion);
  // }

  // @Get('alternativa/:idpregunta')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({summary: 'listado de alternativas', description: 'Esta API permite listar las alternativas de la evaluacion mediante el parametro:{"id_pregunta":"number"}; sp_listar_alternativas_evaluacion(?)'})
  // alternativas(@Param('idpregunta') idPregunta: number){
  //   return this.evaluacionService.preguntaEvaluacion(idPregunta);
  // }

  // @Get('retroalimentacion/:institucion/:estudiante/:evaluacion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Retroalimentacion de un asesor en una evaluacion ',
  //   description:
  //     'Esta API permite Visualizar la retroalimentacion de un asesor en una evaluacion mediante el parametro:{"idInstitucion":"idEstudiante":idEvaluacion}; SP: sp_visualizar_retroalimentacion_asesor(?,?,?)',
  // })
  // async retroalimentacion(
  //   @Param('institucion') idInstitucion: string,
  //   @Param('estudiante') idEstudiante: number,
  //   @Param('evaluacion') idEvaluacion: number,
  // ) {
  //   return await this.evaluacionService.retroalimentacion(
  //     idInstitucion,
  //     idEstudiante,
  //     idEvaluacion,
  //   );
  // }

  // @Get('notas/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Evaluaciones notas',
  //   description:
  //     'Esta API permite Visualizar las notas de las evaluaciones del estudiante mediante el parametro:{"id_Institucion": "string", "id_estudiante":"number", "id_evaluacion": "number"}; SP: sp_visualizar_notas_evaluacion(?,?,?)',
  // })
  // evaluacionesnotas(
  //   @Param('institucion') nombre_institucion: string,
  //   @Query()dataEvualuacionNota: DataEvualuacionNota
  //   ){
  //   return this.evaluacionService.evaluacionNotas(nombre_institucion, dataEvualuacionNota)
  // }

  @Post('registrarEvaluacion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar Evaluacion',
    description:
      'Esta API permitira registrar la evaluacion del estudiante con el body:{ "id_evaluacion": "number", "id_estudiante":"number"}; SP: sp_registrar_evaluacion(?,?,@id_envio_evaluacion)',
  })
  registrarEvaluacion(@Body() CreateEvaluacionDto: CreateEvaluacionDto) {
    try {
      return this.evaluacionService.registrarEvaluacion(CreateEvaluacionDto);
    } catch (error) {
      console.error('Error al registrar evaluación:', error);
      throw new Error('Error al registrar evaluación ' + error.message);
    }
  }

  @Post('registrarRespuestas')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar Respuestas Evaluacion',
    description:
      'Esta API permitira registrar la respuesta de la evaluacion con el body:{ "id_entrega_evaluacion":number,"id_evaluacion": "number", "id_pregunta":"number", "id_evaluacion":number,"id_alternativa":number}; SP: sp_registrar_respuesta_evaluacionqm(?,?,?,?,?)',
  })
  registrarRespuesta(@Body() registrarRespuestasDto: RegistrarRespuestaDto) {
    return this.evaluacionService.registrarRespuesta(registrarRespuestasDto);
  }

  @Patch('actualizarEstado/:idEntregaEvaluacion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Actualizar Estado Evaluacion',
    description:
      'Esta API permitira actualizar el estado de una evaluacion con el parametro id_entrega_evaluacion y con el body:{ "estado_evaluacion":string}; SP: sp_cambiar_estado_evaluacion(?,?)',
  })
  cambiarEstadoEvaluacion(
    @Param('idEntregaEvaluacion') idEntregaEvaluacion: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ) {
    return this.evaluacionService.cambiarEstadoEvaluacion(
      idEntregaEvaluacion,
      updateEstadoDto,
    );
  }
}
