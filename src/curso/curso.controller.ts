import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CursoFilterDto } from './dto/curso-filter.dto';
import { CursoFilterNewDto } from './dto/curso-filter-nuevo.dto';
import { CursoFilterEstudianteDto } from './dto/curso-filter-estudiante.dto';
import { CursosDocenteDto } from './dto/cursosDocente.dto';

@ApiTags('Curso')
@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Get('tipoCurso/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Verificar tipo de curso',
    description:
      'Mediante los parametros{"idCurso":"number"}. SP: sp_verificar_tipo_curso(?);',
  })
  tipoCurso(@Param('idCurso') idCurso: number) {
    try {
      return this.cursoService.gettipoCurso(idCurso);
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar detalle del curso en vivo: ' + error.message,
      );
    }
  }

  @Get('categoria/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar Categirias de los Cursos',
    description:
      'Esta API permite obtener las categoria que tiene un curso con el nombre de la institucion en el procedimiento almacenado sp_listar_cursos_categorias(?)',
  })
  async getCategoriaCurso(@Param('institucion') institucion: string) {
    try {
      if (!institucion) {
        throw new NotFoundException('Datos de búsqueda de curso incompletos');
      }
      return await this.cursoService.getCategoriaCurso(institucion);
    } catch (error) {
      return {
        error: 'No se pudo obtener los datos de ampliacion',
        message: error.message,
      };
    }
  }

  @Get('modulos/:institucion/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar modulos de un curso',
    description:
      'Mediante los parametros{"institucion":"string","idCurso":"number"}. SP: sp_visualizar_modulos_curso(?,?)',
  })
  modulosCurso(
    @Param('institucion') institucion: string,
    @Param('idCurso') idCurso: number,
  ) {
    return this.cursoService.modulosCurso(institucion, idCurso);
  }

  //Detalle curso grabado
  @Get('detalleClaseGrabada/:idSesion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar detalle de la clase grabada',
    description:
      'Mediante los parametros{"idSesion":"number"}. SP: sp_listar_cgrabada_detalles(?);',
  })
  detalleClaseGrabada(@Param('idSesion') idSesion: number) {
    return this.cursoService.detalleClaseGrabado(idSesion);
  }

  //Detalle clase en vivo
  @Get('detalleClaseVivo/:idSesion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar detalle de la clase en vivo',
    description:
      'Mediante los parametros{"idSesion":"number"}. SP: sp_listar_cvivo_detalles(?);',
  })
  detalleClaseVivo(@Param('idSesion') idSesion: number) {
    return this.cursoService.detalleClaseVivo(idSesion);
  }

  //Notificacion
  @Get('descripcion/:institucion/:idEstudiante/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Descripcion de un curso',
    description:
      'Esta API permite mostrar la descripcion de un curso mediante los parametros:{"institucion":"string","idEStudiante":"number","idCurso":"number"},{"institucion":"string","idCurso":"number"},{"institucion":"string","id":"number(idCurso)"},{"id":"number(idModulo)"}. SP: sp_visualizar_info_curso(?, ?, ?)',
  })
  descripcionCurso(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,
    @Param('idCurso') idCurso: number,
  ) {
    return this.cursoService.descripcionCurso(
      institucion,
      idEstudiante,
      idCurso,
    );
  }

  // @Get('notificar')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'notificacion',
  //   description:
  //     'Esta API permite mostrar la notificacion de finalizacion de cursos mediante un array:{"idCurso":"number", "idMatricula":"number", "idEstudiante":"number", "estadoMatricula":"number(en proceso=0, culminado=1)"}; CALL sp_notificar_finalizacion_curso(?,?,?,?, @mensaje) ojo se ingresa en un body ingresando datos de los parametros',
  // })
  // notificarFinalizacionCurso(
  //   @Body() notificarFinCursoDto: NotificarFinCursoDto,
  // ) {
  //   return this.cursoService.notificacion(notificarFinCursoDto);
  // }

  // @Get('similares/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'cursos similares',
  //   description:
  //     'Esta API permite mostrar los cursos similares mediante la institución que es enviado como parametro:{"institucion":"string(nombre de la institucion)"} y un query:{"idCur":"number(id del curso)"}. SP: sp_listar_curso_similar(?, ?)',
  // })
  // async cursosSimilares(
  //   @Param('institucion') institucion: string,
  //   @Query() paqueteFilterPageDt: CursoFilterPageDto,)
  // {
  //   return await this.cursoService.cursosSimilares(institucion, paqueteFilterPageDt);
  // }

  // @Get('estudiante/:idEstudiante')
  // cursosComprados(@Param('idEstudiante') idEstudiante: number) {
  //   return this.cursoService.cursosComprados(idEstudiante);
  // }

  @Get('estudiante/:institucion/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar Cursos Comprados por Estudiante',
    description:
      'Esta API permite mostrar los cursos que tiene un estudiante mediante el parametros:{"institucion":"string(nombre de la institucion)","idEstudiante":"number"}, y como query{"nombre_curso":"string","categoria_curso":"string"}. SP: sp_filtrar_cursos_comprados(?,?,?,?), sp_filtrar_paquetes_comprados(?,?,?,?), sp_listar_cursos_paquetesc(?,?,@nota,@porcentaje)',
  })
  filtrarcursosComprados(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,

    @Query() cursoFilterDto: CursoFilterDto,
  ) {
    return this.cursoService.filtrarCursosComprados(
      institucion,
      idEstudiante,
      cursoFilterDto,
    );
  }

  @Get('docente/:institucion/:idDocente')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'cursos de un docente',
    description:
      'Esta API permite mostrar los cursos de un docente mediante los parametros:{"institucion":"string(nombre de la institucion)", "idDocente":"number"}. SP: sp_listar_cursos_docente_enseña(?, ?)',
  })
  cursosDocente(
    @Param('institucion') institucion: string,
    @Param('idDocente') idDocente: number,
  ) {
    return this.cursoService.cursosDocente(institucion, idDocente);
  }

  @Get('docenteEstudiante/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'cursos de un docente para un estudiante',
    description:
      'Esta API permite mostrar los cursos de un docente cuando un estudiante se logueamediante los parametros:{"institucion":"string(nombre de la institucion)", "idDocente":"number", "idEstudiante":"number"}. SP: sp_listar_cursos_docente_enseña_estudiante(?,?,?)',
  })
  cursosDocenteEstudiante(
    @Param('institucion') institucion: string,
    @Query() cursosDocenteDto:CursosDocenteDto,
  ) {
    return this.cursoService.cursosDocenteEstudiante(institucion,cursosDocenteDto);
  }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Cursos por institución',
    description:
      'Esta API permite mostrar los cursos que contiene una institución, se le pasa como parametro:{"institucion":"string(nomrbe de la institucion)"} y querys{"input":"string(nombre parcial o completo de un curso)","modalidad":"string(asincrono,vivo,mixto)","tipo":"string(pagado,gratuito)","nivel":"string(facil,intermedio,dificil)","categoria":"string(nombre de la categoria)","orden(1 y 2= por nombre asc y desc 3 y 4 = por fecha asc y desc 5 y 6 = por precio asc y desc)"}. SP: sp_listar_cursos_filtros(?,?,?,?,?,?)',
  })
  filtrarcursos(
    @Param('institucion') institucion: string,
    @Query() filtrarNuevoDto: CursoFilterNewDto,
  ) {
    try {
      return this.cursoService.filtrarcursos(institucion, filtrarNuevoDto);
    } catch (error) {
      return {
        error: 'No se pudo obtener la reseña del curso desde Service',
        message: error.message,
      };
    }
  }
  @Get('CursoEstudiante/:institucion/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Cursos por institución y estudiante',
    description:
      'Esta API permite mostrar los cursos que contiene una institución, se le pasa como parametro:{"institucion":"string(nomrbe de la institucion)"} y querys{"input":"string(nombre parcial o completo de un curso)","modalidad":"string(asincrono,vivo,mixto)","tipo":"string(pagado,gratuito)","nivel":"string(facil,intermedio,dificil)","categoria":"string(nombre de la categoria)","orden(1 y 2= por nombre asc y desc 3 y 4 = por fecha asc y desc 5 y 6 = por precio asc y desc)", "idEstudiante"}. SP: sp_listar_cursos_filtros_estudiante(?,?,?,?,?,?,?)',
  })
  filtrarcursosEstudiante(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,
    @Query() CursoFilterEstudianteDto: CursoFilterEstudianteDto,
  ) {
    try {
      return this.cursoService.filtrarcursosEstudiante(institucion,idEstudiante, CursoFilterEstudianteDto);
    } catch (error) {
      return {
        error: 'No se pudo obtener la reseña del curso desde Service',
        message: error.message,
      };
    }
  }
  
  @Get(':institucion/:idCurso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalles de cursos por institución',
    description:
      'Esta API permite mostrar los detalles de los cursos que contiene una institución mediante los parametros:{"institucion":"string(nombre de la institucion)","idCurso":"number"}. SP: sp_filtrar_curso_detalle(?,?), sp_listar_objetivo_curso(?,?),sp_visualizar_modulos_curso(?,?),sp_filtrar_sesion_modulo(?)',
  })
  detallecurso(
    @Param('institucion') institucion: string,
    @Param('idCurso') idC: number,
  ) {
    //console.log('detalle curso')
    return this.cursoService.detalleCurso(institucion, idC);
  }

  @Get(':institucion/:idCurso/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalles de cursos por institución y estudiante',
    description:
      'Esta API permite mostrar los detalles de los cursos que contiene una institución mediante los parametros:{"institucion":"string(nombre de la institucion)","idCurso":"number","idEstudiante":"number"}. SP: sp_filtrar_curso_detalle_estudiante(?,?,?), sp_listar_objetivo_curso(?,?),sp_visualizar_modulos_curso(?,?),sp_filtrar_sesion_modulo(?)',
  })
  detalleCursoEstudiante(
    @Param('institucion') institucion: string,
    @Param('idCurso') idCurso: number,
    @Param('idEstudiante') idEstudiante: number,
  ) {
    //console.log('detalle curso')
    return this.cursoService.detalleCursoEstudiante(institucion, idCurso,idEstudiante);
  }
  

  // @Get('recomendado/:id')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Cursos recomendados por categoria',
  //   description:
  //     'Esta API permite mostrar la lista de los cursos recomendados por categorias mediante el parametro:{"idestudiante":"number"} y un query:{"idCategoria":"number"}. SP: sp_listar_curso_recomendado(?,?)',
  // })
  // cursorecomendadoPorCategoria(
  //   @Param('id') idEstudiante: number,
  //   @Query('idCategoria') idCategoria: number,
  // ) {
  //   return this.cursoService.cursoRecomendadoPorCategoria(
  //     idEstudiante,
  //     idCategoria,
  //   );
  // }

  //Visualizar video Introductorio
  // @Get('VideoIntroductorio/:institucion/:idCurso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Visualizar video introductorio',
  //   description:
  //     'Esta api permite Visualizar un video introductorio a los cursos matriculados. SP: sp_filtrar_videointroductorio_curso(?,?);',
  // })
  // async videoIntroductorio(
  //   @Param('institucion') institucion: string,
  //   @Param('idCurso') idCurso: number,
  // ) {
  //   return this.cursoService.videoIntroductorio(idCurso, institucion);
  // }

  // @Post()
  // create(@Body() createCursoDto: CreateCursoDto) {
  //   return this.cursoService.create(createCursoDto);
  @Get('reseña/:id_curso/:nombre_institucion/:id_matricula')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Reseña de curso',
    description:
      'Esta API permite obtener los datos de reseña de curso mediante los parametros:{"idCurso":"number","nombreInstitucion":"string","idMatricula":"number"}. SP:sp_visualizar_reseñas_curso(?,?,?)',
  })
  async getReseñaCurso(
    @Param('id_curso') id_curso: number,
    @Param('nombre_institucion') nombre_institucion: string,
    @Param('id_matricula') id_matricula: number,
  ) {
    try {
      if (!id_curso || !nombre_institucion || !id_matricula) {
        throw new NotFoundException('Datos de búsqueda de curso incompletos');
      }
      return this.cursoService.reseñaCurso(
        id_curso,
        nombre_institucion,
        id_matricula,
      );
    } catch (error) {
      return {
        error: 'No se pudo obtener la reseña del curso',
        message: error.message,
      };
    }
  }

  // @Get('renovacion/:nombre_institucion/:id_curso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Listar Renovacion de Curso',
  //   description:
  //     'Esta API permite obtener los datos de renovacion de un curso con los parametros nombre_insitucion y id_curso en el procedimiento almacenado sp_listar_ampliacion_curso()',
  // })
  // async getAmpliacionCurso(
  //   @Param('nombre_institucion') nombre_institucion: string,
  //   @Param('id_curso') id_curso: number,
  // ) {
  //   try {
  //     if (!id_curso || !nombre_institucion) {
  //       throw new NotFoundException('Datos de búsqueda de curso incompletos');
  //     }
  //     return this.cursoService.getAmpliacionCurso(nombre_institucion, id_curso);
  //   } catch (error) {
  //     return {
  //       error: 'No se pudo obtener los datos de ampliacion',
  //       message: error.message,
  //     };
  //   }
  // }

  @Get('detalleVivo/:institucion/:idEstudiante/:idSesion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar los detalles de las clases en Vivo',
    description:
      'Esta API permite traer los detalles de las clases en vivo con los parametros de nombre de institucion, idEstudiante e idSeion en el procecdimieto SP: sp_listar_cursovivo_detalles(?,?,?)',
  })
  async getCursiVivoDetalle(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,
    @Param('idSesion') idSesion: number,
  ) {
    try {
      if (!institucion || !idEstudiante || !idSesion) {
        throw new NotFoundException('Datos de búsqueda de curso incompletos');
      }
      return this.cursoService.getCursiVivoDetalle(
        institucion,
        idEstudiante,
        idSesion,
      );
    } catch (error) {
      return {
        error: 'No se pudo obtener los detalle de las clases en vivo',
        message: error.message,
      };
    }
  }
  // @Get('especializacion/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'filtrar especializacion compradas',
  //   description: 'Esta API permite obtener los datos de las especializaciones compradas mediante el parametro:{"nombre_institucion":"string"} Y Query :{"id_curso":"number"}; SP: sp_filtrar_especializacion()',
  // })

  // especializacioncomprado(
  //   @Param('institucion') nombre_institucion:string,
  //   @Query('id_curso') cursoFilterEspecializacionDto: CursoFilterEspecializacionDto,
  // ) {
  //   try {
  //     return this.cursoService.especializacionCompradas( nombre_institucion, cursoFilterEspecializacionDto)
  //   } catch (error) {
  //     throw new Error('No se pudo obtener los datos de especializacion comprada')
  //   }
  // }

  // @Get('promociones/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Filtrar promociones compradas',
  //   description: 'Esta API permite obtener los datos de las promociones compradas mediante el parametro:{"nombre_institucion":"string"} Y Query :{"id_curso":"number"}; SP: sp_filtrar_promociones()',
  // })
  // promocionescomprados(
  //   @Param('institucion') nombre_institucion:string,
  //   @Query('id_curso') cursoFilterEspecializacionDto: CursoFilterEspecializacionDto,
  // ) {
  //   try {
  //     return this.cursoService.promocionesCompradas( nombre_institucion, cursoFilterEspecializacionDto)
  //   } catch (error) {
  //     throw new Error('No se pudo obtener los datos de especializacion comprada')
  //   }
  // }
}
