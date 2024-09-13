import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';
import { Modulo } from './entities/modulo.entity';
import { Sesion } from './entities/sesion.entity';
import { CursoFilterDto } from './dto/curso-filter.dto';
import { Resena } from './entities/resena.entity';
import { CursoFilterNewDto } from './dto/curso-filter-nuevo.dto';
import { Categoria } from './entities/categoria.entity';
import { CursoFilterEstudianteDto } from './dto/curso-filter-estudiante.dto';
import { CursosDocenteDto } from './dto/cursosDocente.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
    @InjectRepository(Modulo)
    private moduloRepository: Repository<Modulo>,
    @InjectRepository(Sesion)
    private resenaRepository: Repository<Sesion>,
    @InjectRepository(Resena)
    private sesionRepository: Repository<Resena>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async getCategoriaCurso(institucion: string) {
    try {
      const [categoriaCurso] = await this.categoriaRepository.query(
        'CALL sp_listar_cursos_categorias(?)',
        [institucion],
      );
      return categoriaCurso;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener categorias: ' + error.message);
    }
  }

  async filtrarcursos(
    institucion: string,
    cursoFilterNewDto: CursoFilterNewDto,
  ) {
    try {
      const startIndex =
        (cursoFilterNewDto.page - 1) * cursoFilterNewDto.sizePage;
      const [cursos] = await this.cursoRepository.query(
        `Call sp_listar_cursos_filtros(?,?,?,?,?,?,?)`,
        [
          institucion,
          cursoFilterNewDto.nombre,
          cursoFilterNewDto.tipo,
          cursoFilterNewDto.modalidad,
          cursoFilterNewDto.nivel,
          cursoFilterNewDto.categoria,
          cursoFilterNewDto.orden,
        ],
      );
      //Selecciona solo los cursos segundo el tamaño de la pagina y la pagina
      const cursosPaginados = cursos.slice(
        startIndex,
        startIndex + cursoFilterNewDto.sizePage,
      );
      const totalCursos = cursos.length;
      return { totalCursos, cursos: cursosPaginados };
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener cursos: ' + error.message);
    }
  }

  async modulosCurso(institucion: string, idCurso: number) {
    try {
      const [modulos] = await this.moduloRepository.query(
        `Call sp_visualizar_modulos_curso(?,?)`,
        [institucion, idCurso],
      );
      return modulos;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar temario del curso ' + error.message);
    }
  }

  async sesionesModulo(id: number) {
    try {
      const [sesiones] = await this.sesionRepository.query(
        `Call sp_filtrar_sesion_modulo(?)`,
        [id],
      );
      return sesiones;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar las sesiones del curso: ' + error.message,
      );
    }
  }

  async objetivosCurso(institucion: string, idCurso: number) {
    try {
      const [objetivos] = await this.sesionRepository.query(
        `Call sp_listar_objetivo_curso(?,?)`,
        [institucion, idCurso],
      );
      return objetivos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar los objetivos del curso: ' + error.message,
      );
    }
  }

  async detalleCurso(institucion: string, idCurso: number) {
    try {
      if (!idCurso) {
        return { message: 'No puede ingresar un valor vacio en id de  curso' };
      }
      const [curso] = await this.cursoRepository.query(
        `Call sp_filtrar_curso_detalle(?,?)`,
        [institucion, idCurso],
      );
      if (curso) {
        const cursoMapeado = curso.map((curso: any) => ({
          curso_id: curso.curso_id,
          curso_nombre: curso.curso_nombre,
          curso_imagen: curso.curso_imagen,
          curso_precio_soles_antes: curso.curso_precio_soles_antes,
          categoria_curso_nombre: curso.categoria_curso_nombre,
          curso_precio_soles: curso.curso_precio_soles,
          curso_precio_dolar_antes: curso.curso_precio_dolar_antes,
          curso_precio_dolar: curso.curso_precio_dolar,
          docente_id: curso.docente_id,
          curso_docente: curso.curso_docente,
          curso_fecha_inicio: curso.curso_fecha_inicio,
          curso_duracion: curso.curso_duracion,
          curso_descripcion_certificado: curso.curso_descripcion_certificado,
          perfil_alumno: curso.perfil_alumno,
          curso_video_introductorio: curso.curso_video_introductorio,
          curso_horas_certificado: curso.curso_horas_certificado,
          curso_plantilla_certificado: curso.curso_plantilla_certificado,
          curso_brochure: curso.curso_brochure,
          curso_portada: curso.curso_portada,
          curso_tipo: curso.curso_tipo,
          curso_modalidad: curso.curso_modalidad,
          objetivos: [],
          temarios: [],
        }));

        for (const curso of cursoMapeado) {
          const objetivos = await this.objetivosCurso(institucion, idCurso);
          if (Array.isArray(objetivos)) {
            curso.objetivos = objetivos.map((objetivo: any) => ({
              id: objetivo.objetivo_id,
              descripcion: objetivo.objetivo_descripcion,
            }));
          }
          const temarios = await this.modulosCurso(institucion, idCurso);
          if (Array.isArray(temarios)) {
            curso.temarios = temarios.map((temario: any) => ({
              id: temario.modulo_id,
              numeracion: temario.modulo_numeracion,
              nombre: temario.modulo_nombre,
              descripcion: temario.modulo_descripcion,
              sesiones: [],
            }));
          }
          for (const temario of curso.temarios) {
            const sesiones = await this.sesionesModulo(temario.id);
            if (Array.isArray(sesiones)) {
              temario.sesiones = sesiones.map((sesion: any) => ({
                nombre: sesion.sesion_nombre,
              }));
            }
          }
          return cursoMapeado[0];
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar el detalle del curso: ' + error.message,
      );
    }
  }

  // async cursosSimilares(institucion: string, cursoFilterPageDto:CursoFilterPageDto ) {
  //   try {
  //     const [cursos] = await this.cursoRepository.query(
  //       'CALL sp_listar_curso_similar(?, ?)',
  //       [institucion, cursoFilterPageDto.idCurso],
  //     );
  //     const paginatedCurso = cursos.slice(0,
  //       cursoFilterPageDto.sizeCurso,
  //     );
  //     return paginatedCurso;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al mostrar los cursos similares ' + error.message);
  //   }
  // }

  async filtrarCursosComprados(
    institucion: string,
    idEstudiante: number,
    cursoFilterDto: CursoFilterDto,
  ) {
    try {
      
      const [cursosComprados] = await this.cursoRepository.query(
        'CALL sp_filtrar_cursos_comprados(?,?,?,?)',
        [
          institucion,
          idEstudiante,
          cursoFilterDto.nombre_curso,
          cursoFilterDto.categoria_curso,
        ],
      );
      if (cursosComprados && Array.isArray(cursosComprados)) {
        for(const cursos of cursosComprados){
          // const cursoId = cursos.curso_id ?? 0; // Usa 0 si curso_id es undefined o null
          // const estudianteId = cursos.estudiante_id ?? 0; 
          await this.cursoRepository.query('Select fn_promediar_nota_x_evaluaciones_entregables(?,?)',[cursos.curso_id,cursos.estudiante_id])
          await this.cursoRepository.query('Select fn_devolver_progreso_curso(?,?)',[cursos.curso_id,cursos.estudiante_id])
        }
        
      }else{
        return[]
      }

      // Obtener promociones compradas
      const [paquetesComprados] = await this.cursoRepository.query(
        'CALL sp_filtrar_paquetes_comprados(?,?,?,?)',
        [institucion, idEstudiante, cursoFilterDto.nombre_paquete, 1],
      );

      const cursosPaquetes = [];
      for (const promocion of paquetesComprados) {
        const cursosAsociados = await this.cursosPromocion(
          promocion.paquete_id,
          idEstudiante,
        );
        cursosPaquetes.push(...cursosAsociados);
      }

      // Combina los resultados en un solo array
      // const resultado = getCursComprado.concat(cursosPromociones);

      // return resultado || [];
      // // return getCursComprado;
      const cursosCompradosInt = cursosComprados.map((curso) => {
        return {
          ...curso,
          acceso_estado: parseInt(curso.acceso_estado, 10),
        };
      });

      const cursosPromocionesInt = cursosPaquetes.map((curso) => {
        return {
          ...curso,
          acceso_estado: parseInt(curso.acceso_estado, 10),
        };
      });

      return {
        cursos: cursosCompradosInt,
        cursosPromociones: cursosPromocionesInt,
      };
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al mostrar los cursos comprados filtrados ' + error.message,
      );
    }
  }
  // async filtrarCursosCompradosPrueba(
  //   institucion: string,
  //   idEstudiante: number,
  //   cursoFilterDto: CursoFilterDto,
  // ) {
  //   try {
  //     const [cursosComprados] = await this.cursoRepository.query(
  //       'CALL sp_filtrar_cursos_comprados(?,?,?,?)',
  //       [
  //         institucion,
  //         idEstudiante,
  //         cursoFilterDto.nombre_curso,
  //         cursoFilterDto.categoria_curso,
  //       ],
  //     );

  //     const CursosCompradosMapeados = [];
  //     if (cursosComprados && Array.isArray(cursosComprados)) {
  //       const compradosMapeado = cursosComprados.map((comprados: any) => ({
  //         curso_id: comprados.curso_id,
  //         estudiante_id: comprados.estudiante_id,
  //         curso_imagen: comprados.curso_imagen,
  //         curso_nombre: comprados.curso_nombre,
  //         curso_estado: comprados.curso_estado,
  //         curso_tipo: comprados.curso_tipo,
  //         categoria_curso_nombre: comprados.categoria_curso_nombre,
  //         matricula_id: comprados.matricula_id,
  //         matricula_estado: comprados.matricula_estado,
  //         matricula_fecha_inscripcion: comprados.matricula_fecha_inscripcion,
  //         matricula_progreso: comprados.matricula_progreso,
  //         matricula_nota_promedio: comprados.matricula_nota_promedio,
  //         modulos: [],
  //       }));

  //       for (const comprado of compradosMapeado) {
  //         const modulos = await this.modulosCurso(
  //           institucion,
  //           comprado.curso_id,
  //         );

  //         comprado.modulos = modulos.map(async (modulo: any) => {
  //           const acceso = await this.funcionEntrega(
  //             idEstudiante,
  //             modulo.modulo_id,
  //           );

  //           return {
  //             modulo_id: modulo.modulo_id,
  //             modulo_nombre: modulo.modulo_nombre,
  //             modulo_material: modulo.modulo_material,
  //             modulo_descripcion: modulo.modulo_descripcion,
  //             modulo_fecha_inicio: modulo.modulo_fecha_inicio,
  //             acceso: acceso, // Agrega el campo acceso con el valor obtenido de funcionEntrega
  //           };
  //         });
  //       }

  //       CursosCompradosMapeados.push(...compradosMapeado);
  //     }
  //     // Obtener promociones compradas
  //     const [paquetesComprados] = await this.cursoRepository.query(
  //       'CALL sp_filtrar_paquetes_comprados(?,?,?,?)',
  //       [institucion, idEstudiante, cursoFilterDto.nombre_paquete, 1],
  //     );

  //     const cursosPaquetes = [];
  //     for (const promocion of paquetesComprados) {
  //       const cursosAsociados = await this.cursosPromocion(
  //         promocion.paquete_id,
  //         idEstudiante,
  //       );
  //       cursosPaquetes.push(...cursosAsociados);
  //     }

  //     // Combina los resultados en un solo array
  //     // const resultado = getCursComprado.concat(cursosPromociones);

  //     // return resultado || [];
  //     // // return getCursComprado;
  //     return {
  //       cursos: CursosCompradosMapeados,
  //       cursosPromociones: cursosPaquetes,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'error al mostrar los cursos comprados filtrados ' + error.message,
  //     );
  //   }
  // }

  async funcionEntrega(idEstudiante: number, idModulo: number) {
    try {
      const [modulo] = await this.moduloRepository.query(
        'SELECT fn_validar_entrega_enteva(?,?) as respuesta',
        [idEstudiante, idModulo],
      );

      // Asegúrate de obtener solo el primer resultado si hay varios
      const respuesta =
        modulo && modulo.length > 0 ? modulo[0].respuesta : null;

      return respuesta;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener el detalle del modulo ' + error.message,
      );
    }
  }

  async cursosPromocion(idpaquete: number, idEstudiante: number) {
    try {
      const [cursos] = await this.cursoRepository.query(
        `Call sp_listar_cursos_paquetesc(?,?,@nota,@porcentaje)`,
        [idpaquete, idEstudiante],
      );
      const [cursosSel] = await this.cursoRepository.query('SELECT  @nota AS nota,@porcentaje AS porcentaje')

      return cursos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al obtener los cursos de una espacializacion ' + error.message,
      );
    }
  }

  // async cursosComprados(idEstudiante: number) {
  //   try {
  //     const [cursos] = await this.cursoRepository.query(
  //       'CALL sp_visualizar_cursos_comprados(?)',
  //       [idEstudiante],
  //     );
  //     return cursos;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al mostrar los cursos comprados: ' + error.message);
  //   }
  // }

  async detalleClaseGrabado(idSesion: number) {
    try {
      const [result] = await this.cursoRepository.query(
        'CALL sp_listar_cgrabada_detalles(?)',
        [idSesion],
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar los detalles del curso grabado: ' + error.message,
      );
    }
  }

  async detalleClaseVivo(idSesion: number) {
    try {
      const [result] = await this.cursoRepository.query(
        'CALL sp_listar_cvivo_detalles(?)',
        [idSesion],
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar los detalles del curso en vivo: ' + error.message,
      );
    }
  }

  async cursosDocente(institucion: string, idDocente: number) {
    try {
      const [getCursos] = await this.cursoRepository.query(
        'CALL sp_listar_cursos_docente_enseña(?,?)',
        [institucion, idDocente],
      );
      return getCursos;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar cursos del docente: ' + error.message);
    }
  }

  async cursosDocenteEstudiante(
    institucion: string,
    { idDocente, idEstudiante }: CursosDocenteDto,
  ) {
    try {
      const [getCursos] = await this.cursoRepository.query(
        'CALL sp_listar_cursos_docente_enseña_estudiante(?,?,?)',
        [institucion, idDocente, idEstudiante],
      );
      return getCursos;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar cursos del docente: ' + error.message);
    }
  }

  // async cursoRecomendadoPorCategoria(
  //   idEstudiante: number,
  //   idCategoria: number,
  // ) {
  //   try {
  //     const query = `CALL sp_listar_curso_recomendado(?,?)`;
  //     const carritoCompra = await this.cursoRepository.query(query, [
  //       idEstudiante,
  //       idCategoria,
  //     ]);
  //     return carritoCompra[0];
  //   } catch (error) {
  //     throw new Error('error al obtener los cursos comprados por categoria');
  //   }
  // }

  // async reseñaCurso(ResenaCursoDto:ResenaCursoDto){
  //   try{
  //     const [getReseña] = await this.cursoRepository.query('CALL sp_visualizar_reseñas_curso(?,?,?)',[ResenaCursoDto.id_curso,ResenaCursoDto.nombre_institucion,ResenaCursoDto.id_matricula]);
  //     return getReseña;
  //   }catch(error){
  //     return { error: 'No se pudo obtener la reseña del curso', message: error.message };
  //   }

  // }

  async reseñaCurso(
    id_curso: number,
    nombre_institucion: string,
    id_matricula: number,
  ) {
    try {
      const [getReseña] = await this.resenaRepository.query(
        'CALL sp_visualizar_reseñas_curso(?,?,?)',
        [id_curso, nombre_institucion, id_matricula],
      );
      return getReseña;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        'Error al mostrar las reseñas del curso: ' + error.message,
      );
    }
  }

  //Notificacion
  // async notificacion(notificarFinCursoDto: NotificarFinCursoDto) {
  //   await this.cursoRepository.query(
  //     `CALL sp_notificar_finalizacion_curso(?,?,?,?,@mensaje)`,
  //     [
  //       notificarFinCursoDto.idCurso,
  //       notificarFinCursoDto.idMatricula,
  //       notificarFinCursoDto.idEstudiante,
  //       notificarFinCursoDto.estadoMatricula,
  //     ],
  //   );

  //   const result = await this.cursoRepository.query(
  //     'SELECT @mensaje AS mensaje',
  //   );

  //   return { mensaje: result[0].mensaje };
  // }

  //Vizualizar video introductorio
  // async videoIntroductorio(idCurso: number, institucion: string) {
  //   try {
  //     const video = await this.cursoRepository.query(
  //       `CALL sp_filtrar_videointroductorio_curso(?,?)`,
  //       [idCurso, institucion],
  //     );
  //     return video[0];
  //   } catch (error) {
  //     throw new Error(
  //       'Error al mostrar el video introductorio' + error.message,
  //     );
  //   }
  // }

  async getCursiVivoDetalle(
    institucion: string,
    idEstudiante: number,
    idSesion: number,
  ) {
    try {
      const cursoVivo = await this.cursoRepository.query(
        'CALL sp_listar_cursovivo_detalles(?,?,?)',
        [institucion, idEstudiante, idSesion],
      );
      return cursoVivo[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar detalle del curso en vivo: ' + error.message,
      );
    }
  }

  // async cursoRecomendadoPorCategoria(idEstudiante: number, idCategoriacurso: number){
  //   const carritoCompra = await this.cursoRepository.query(`CALL sp_listar_curso_recomendado(?,?)`, [idEstudiante, idCategoriacurso])
  //   return carritoCompra[0]
  // }

  // async getCursoComprado(cursoFilterDto: CursoFilterDto) {
  //   const [getCursComprado] = await this.cursoRepository.query(
  //     'CALL sp_filtrar_cursos_comprados(?, ?, ?)',
  //     [cursoFilterDto.id_estudiante,cursoFilterDto.nombre_curso,cursoFilterDto.categoria_curso]
  //   );
  //   return getCursComprado;
  // }

  // create(createCursoDto: CreateCursoDto) {
  //   return 'This action adds a new curso';
  // }
  // async getAmpliacionCurso(institucion: string, idCurso: number) {
  //   try {
  //     const [result] = await this.cursoRepository.query(
  //       'CALL sp_listar_ampliacion_curso(?,?)',
  //       [institucion, idCurso],
  //     );
  //     return result;
  //   } catch (error) {
  //     return {
  //       error: 'No se pudo obtener la renovacion de curso desde el servicio',
  //       message: error.message,
  //     };
  //   }
  // }

  async descripcionCurso(
    institucion: string,
    idEstudiante: number,
    idCurso: number,
  ) {
    try {
      const [descripcionCurso] = await this.cursoRepository.query(
        'CALL sp_visualizar_info_curso(?,?,?);',
        [institucion, idEstudiante, idCurso],
      );
      return descripcionCurso[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar informacion del curso: ' + error.message,
      );
    }
  }

  async gettipoCurso(idCurso: number) {
    try {
      const [tipoCurso] = await this.cursoRepository.query(
        'CALL sp_verificar_tipo_curso(?)',
        [idCurso],
      );

      return tipoCurso[0];
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al mostrar el tipo de Curso: ' + error.message,
      );
    }
  }

  async filtrarcursosEstudiante(
    institucion: string,
    idEstudiante: number,
    cursoFilterEstudianteNewDto: CursoFilterEstudianteDto,
  ) {
    try {
      const startIndex =
        (cursoFilterEstudianteNewDto.page - 1) *
        cursoFilterEstudianteNewDto.sizePage;
      const [cursos] = await this.cursoRepository.query(
        `Call sp_listar_cursos_filtros_estudiante(?,?,?,?,?,?,?,?)`,
        [
          institucion,
          cursoFilterEstudianteNewDto.nombre,
          cursoFilterEstudianteNewDto.tipo,
          cursoFilterEstudianteNewDto.modalidad,
          cursoFilterEstudianteNewDto.nivel,
          cursoFilterEstudianteNewDto.categoria,
          cursoFilterEstudianteNewDto.orden,
          idEstudiante,
        ],
      );
        //Selecciona solo los cursos segundo el tamaño de la pagina y la pagina
      const cursosPaginados = cursos.slice(
        startIndex,
        startIndex + cursoFilterEstudianteNewDto.sizePage,
      );
      const totalCursos = cursos.length;
      return { totalCursos, cursos: cursosPaginados };
      return cursos;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener cursos: ' + error.message);
    }
  }
  async detalleCursoEstudiante(
    institucion: string,
    idCurso: number,
    idEstudiante: number,
  ) {
    try {
      if (!idCurso) {
        return { message: 'No puede ingresar un valor vacio en id de  curso' };
      }
      const [curso] = await this.cursoRepository.query(
        `Call sp_filtrar_curso_detalle_estudiante(?,?,?)`,
        [institucion, idCurso, idEstudiante],
      );
      if (curso) {
        const cursoMapeado = curso.map((curso: any) => ({
          curso_id: curso.curso_id,
          curso_nombre: curso.curso_nombre,
          curso_imagen: curso.curso_imagen,
          curso_precio_soles_antes: curso.curso_precio_soles_antes,
          categoria_curso_nombre: curso.categoria_curso_nombre,
          curso_precio_soles: curso.curso_precio_soles,
          curso_precio_dolar_antes: curso.curso_precio_dolar_antes,
          curso_precio_dolar: curso.curso_precio_dolar,
          acceso_estado: curso.acceso_estado,
          matricula_estado: curso.matricula_estado,
          docente_id: curso.docente_id,
          curso_docente: curso.curso_docente,
          curso_fecha_inicio: curso.curso_fecha_inicio,
          curso_duracion: curso.curso_duracion,
          curso_descripcion_certificado: curso.curso_descripcion_certificado,
          perfil_alumno: curso.perfil_alumno,
          curso_video_introductorio: curso.curso_video_introductorio,
          curso_horas_certificado: curso.curso_horas_certificado,
          curso_plantilla_certificado: curso.curso_plantilla_certificado,
          curso_brochure: curso.curso_brochure,
          curso_portada: curso.curso_portada,
          curso_tipo: curso.curso_tipo,
          curso_modalidad: curso.curso_modalidad,
          objetivos: [],
          temarios: [],
        }));

        for (const curso of cursoMapeado) {
          const objetivos = await this.objetivosCurso(institucion, idCurso);
          if (Array.isArray(objetivos)) {
            curso.objetivos = objetivos.map((objetivo: any) => ({
              id: objetivo.objetivo_id,
              descripcion: objetivo.objetivo_descripcion,
            }));
          }
          const temarios = await this.modulosCurso(institucion, idCurso);
          if (Array.isArray(temarios)) {
            curso.temarios = temarios.map((temario: any) => ({
              id: temario.modulo_id,
              numeracion: temario.modulo_numeracion,
              nombre: temario.modulo_nombre,
              descripcion: temario.modulo_descripcion,
              sesiones: [],
            }));
          }
          for (const temario of curso.temarios) {
            const sesiones = await this.sesionesModulo(temario.id);
            if (Array.isArray(sesiones)) {
              temario.sesiones = sesiones.map((sesion: any) => ({
                nombre: sesion.sesion_nombre,
              }));
            }
          }
          return cursoMapeado[0];
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar el detalle del curso: ' + error.message,
      );
    }
  }
}
