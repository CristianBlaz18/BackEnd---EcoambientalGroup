import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerysCalificacionDto } from './dto/querys-calificacion.dto';
import { UpdateCalificacionTutorDto } from './dto/update-calificacion-tutor.dto';
import { UpdateCalificacionDocenteDto } from './dto/update-calificacion-docente.dto';

@ApiTags('Calificacion')
@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar todas las opiniones',
    description:
      'Esta api permite mostrar la lista de las opiniones registradas de todos los cursos, de un curso o un paquete mediante un parametro:{"institucion":"string(nombre de la institucion)"} y querys:{"idContenido":"number(id de curso o paquete)","tipoContenido":"number(0=curso y 1=paquete)","page":"number(pagina actual)","pageSize":"tamaño de elementos por pagina"} .SP: sp_listar_comentarios_curpaq(?,?,?)',
  })
  calificaciones(
    @Param('institucion') institucion: string,
    @Query() querysCalificacionDto: QuerysCalificacionDto,
  ) {
    return this.calificacionService.calificaciones(
      institucion,
      querysCalificacionDto,
    );
  }

  // @Get(':institucion/:idCurso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Mostrar todas las opiniones de un curso',
  //   description:
  //     'Esta api permite mostrar la lista de las opiniones registradas de un curso mediante dos parametros:{"institucion":"string(nombre de la institucion)","idCurso":"string(id del curso)"}. SP: sp_listar_valoracion_x_curso(?, ?)',
  // })
  // calificacionesCurso(
  //   @Param('institucion') institucion: string,
  //   @Param('idCurso') idCurso: number,
  // ) {
  //   return this.calificacionService.calificacionesCurso(institucion, idCurso);
  // }

  @Patch('curso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar calificacion Curso',
    description:
      'Esta api permite registrar la calificacion de un curso mediante un array:{"nombre_institucion":"string", "id_curso":"number", "id_usuario":"number","valoracion1_curso":"number(1 al 5)"}. SP: sp_registrar_calificacion_curso(?,?,?,?,?,@progreso_curso)',
  })
  registrarCalificacion(@Body() updateCalificacionDto: UpdateCalificacionDto) {
    return this.calificacionService.registrarCalificacion(
      updateCalificacionDto,
    );
  }

  @Patch('tutor')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar calificacion Tutor',
    description:
      'Esta api permite registrar la calificacion de un tutor mediante un array:{"nombre_institucion":"string", "id_curso":"number", "id_estudiante":"number","valoracion_tutor":"number(1 al 5)"}. SP: sp_registrar_calificacion_tutor(?,?,?,?,@progreso_curso)',
  })
  registrarCalificacionTutor(
    @Body() updateCalificacionTutorDto: UpdateCalificacionTutorDto,
  ) {
    return this.calificacionService.registrarCalificacionTutor(
      updateCalificacionTutorDto,
    );
  }
  @Get('infTutor/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar motrar la info del tutor',
    description:
      'Esta api permite mostrar la informacion de los tutores con el parametro:{"idCurso":"number(id del curso)"}. SP: sp_visualizar_info_tutor(id_curso);',
  })
  getInfoTutor(@Param('idCurso') idCurso: number) {
    try {
      return this.calificacionService.getInfoTutor(idCurso);
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al visualizar la informacion del tutor' + error.message,
      );
    }
  }

  @Get('tutorValoracion/:institucion/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar motrar la valoracion del tutor',
    description:
      'Esta api permite mostrar la valoracion de los tutores con el parametro:{"institucon": string ,"idCurso":"number(id del curso)"}. SP: sp_visualizar_valoracion_tutor(institucion,idCurso);',
  })
  getValoracionTutor(
    @Param('institucion') institucion: string,
    @Param('idCurso') idCurso: number,
  ) {
    try {
      return this.calificacionService.getValoracionTutor(institucion, idCurso);
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al visualizar la valoracion del tutor' + error.message,
      );
    }
  }

  @Patch('docente')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar calificacion Docente',
    description:
      'Esta api permite registrar la calificacion de un docente mediante un array:{"nombre_institucion":"string", "id_curso":"number", "id_estudiante":"number","valoracion1_curso":"number(1 al 5)"}. SP: sp_registrar_calificacion_docente(nombre_institucion,id_curso,id_estudiante,valoracion_docente,@progreso_curso)',
  })
  registrarCalificacionDocente(
    @Body() updateCalificacionDocenteDto: UpdateCalificacionDocenteDto,
  ) {
    try {
      return this.calificacionService.registrarCalificacionDocente(
        updateCalificacionDocenteDto,
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al registrar calificacion Docente' + error.message,
      );
    }
  }

  @Get('infDocente/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar motrar la info del docente',
    description:
      'Esta api permite mostrar la informacion de los docentes con el parametro:{"idCurso":"number(id del curso)"}. SP: sp_visualizar_info_docente(id_curso);',
  })
  getInfoDocente(@Param('idCurso') idCurso: number) {
    try {
      return this.calificacionService.getInfoDocente(idCurso);
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al visualizar la informacion del tutor' + error.message,
      );
    }
  }

  @Get('docenteValoracion/:institucion/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar motrar la valoracion del docente',
    description:
      'Esta api permite mostrar la valoracion de los docentes con el parametro:{"institucon": string ,"idCurso":"number(id del curso)"}. SP: sp_visualizar_valoracion_docente(id_curso);',
  })
  getValoracionDocente(
    @Param('institucion') institucion: string,
    @Param('idCurso') idCurso: number,
  ) {
    try {
      return this.calificacionService.getValoracionDocente(
        institucion,
        idCurso,
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al visualizar la valoracion del docente' + error.message,
      );
    }
  }
}
