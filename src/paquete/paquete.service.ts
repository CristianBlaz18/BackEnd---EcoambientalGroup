import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { Objetivo } from './entities/objetivo.entity';
import { PaqueteFilterDto } from './dto/paquete-filter.dto';
import { PaqueteFilterCompradas } from './dto/paquete-filter-compradas.dto';
import { FilterPaqueteDto } from './dto/filter-paquete.dto';

@Injectable()
export class PaqueteService {
  constructor(
    @InjectRepository(Paquete)
    private paqueteRepository: Repository<Paquete>,
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
    @InjectRepository(Objetivo)
    private objetivoRepository: Repository<Objetivo>,
  ) {}

  // async especializaciones(institucion: string) {
  //   try {
  //     const paquetes = await this.paqueteRepository.query(
  //       `Call sp_listar_especializacion(?)`,
  //       [institucion],
  //     );
  //     if (paquetes[0] && Array.isArray(paquetes[0])) {
  //       const paquetesMapeado = paquetes[0].map((paquete: any) => ({
  //         id: paquete.paquete_id,
  //         imagen: paquete.paquete_imagen,
  //         nombre: paquete.paquete_nombre,
  //         solesantes: paquete.paquete_precio_soles_anterior,
  //         soles: paquete.paquete_precio_soles,
  //         dolaresantes: paquete.paquete_precio_dolar_anterior,
  //         dolares: paquete.paquete_precio_dolar,
  //         totalcursos: paquete.paquete_total_curso_individual,
  //         cursos: [],
  //       }));

  //       for (const paquete of paquetesMapeado) {
  //         const cursos = await this.cursosxpaquete(paquete.id, 0);

  //         if (Array.isArray(cursos[0])) {
  //           paquete.cursos = cursos[0].map((curso: any) => ({
  //             id: curso.curso_id,
  //             nombre: curso.curso_nombre,
  //           }));
  //         }
  //       }
  //       return paquetesMapeado;
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al obtener especializaciones ' + error.message);
  //   }
  // }

  // async promociones(institucion: string, page: number, pageSize: number) {
  //   try {
  //     const startIndex = (page - 1) * pageSize;

  //     const paquetes = await this.paqueteRepository.query(
  //       `Call sp_listar_promocion(?)`,
  //       [institucion],
  //     );
  //     if (paquetes[0] && Array.isArray(paquetes[0])) {
  //       const paquetesMapeado = paquetes[0].map((paquete: any) => ({
  //         id: paquete.paquete_id,
  //         imagen: paquete.paquete_imagen,
  //         nombre: paquete.paquete_nombre,
  //         solesantes: paquete.paquete_precio_soles_anterior,
  //         soles: paquete.paquete_precio_soles,
  //         dolaresantes: paquete.paquete_precio_dolar_anterior,
  //         dolares: paquete.paquete_precio_dolar,
  //         totalcursos: paquete.paquete_total_curso_individual,
  //         cursos: [],
  //       }));
  //       const paginatedPaquetes = paquetesMapeado.slice(
  //         startIndex,
  //         startIndex + pageSize,
  //       );
  //       for (const paquete of paginatedPaquetes) {
  //         const cursos = await this.cursosxpaquete(paquete.id, 1);

  //         if (Array.isArray(cursos[0])) {
  //           paquete.cursos = cursos[0].map((curso: any) => ({
  //             id: curso.curso_id,
  //             nombre: curso.curso_nombre,
  //           }));
  //         }
  //       }
  //       return paginatedPaquetes;
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al obtener promociones ' + error.message);
  //   }
  // }

  async filtrarpaquetes(
    institucion: string,
    paqueteFilterDto: PaqueteFilterDto,
  ) {
    try {
      //Seleccionar el indice de inicio de la pagina
      const startIndex =
        (paqueteFilterDto.page - 1) * paqueteFilterDto.sizePage;

      //console.log(input, orden);
      const paquetes = await this.paqueteRepository.query(
        'Call sp_listar_paquetes_filtros(?,?,?,?)',
        [
          institucion,
          paqueteFilterDto.input,
          paqueteFilterDto.orden,
          paqueteFilterDto.tipo,
        ],
      );
      if (paquetes[0] && Array.isArray(paquetes[0])) {
        const paquetesMapeado = paquetes[0].map((paquete: any) => ({
          id: paquete.paquete_id,
          imagen: paquete.paquete_imagen,
          nombre: paquete.paquete_nombre,
          solesantes: paquete.paquete_precio_soles_anterior,
          soles: paquete.paquete_precio_soles,
          dolaresantes: paquete.paquete_precio_dolar_anterior,
          dolares: paquete.paquete_precio_dolar,
          totalcursos: paquete.paquete_total_curso_individual,
          cursos: [],
        }));
        //Selecciona la cantidad de paquetes por pagina
        const paginatedPaquetes = paquetesMapeado.slice(
          startIndex,
          startIndex + paqueteFilterDto.sizePage,
        );
        for (const paquete of paquetesMapeado) {
          const cursos = await this.paquetesnormales(
            paquete.id,
            paqueteFilterDto.tipo,
          );

          if (Array.isArray(cursos)) {
            paquete.cursos = cursos.map((curso: any) => ({
              id: curso.curso_id,
              nombre: curso.curso_nombre,
            }));
          }
        }
        const contadorPaquetes = paquetesMapeado.length;
        return { contadorPaquetes, paquetes: paginatedPaquetes };
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al filtrar paquetes ' + error.message);
    }
  }

  async detallePaquete(institucion: string, idPaq: number, tipo: number) {
    try {
      const getpaquete = await this.paqueteRepository.query(
        'SELECT COUNT(*) AS count, paquete_tipo FROM tbl_paquete WHERE paquete_id = ?',
        [idPaq],
      );

      if (getpaquete[0].count > 0) {
        if (getpaquete[0].paquete_tipo === tipo) {
          const paquete = await this.paqueteRepository.query(
            `Call sp_listar_detalle_paquete(?,?,?)`,
            [institucion, idPaq, tipo],
          );
          if (!paquete) {
            return null;
          }
          const paqueteMapeado = paquete[0].map((paquete: any) => ({
            id: paquete.paquete_id,
            nombre: paquete.paquete_nombre,
            imagen: paquete.paquete_imagen,
            solesantes: paquete.paquete_precio_soles_anterior,
            soles: paquete.paquete_precio_soles,
            dolaresantes: paquete.paquete_precio_dolar_anterior,
            dolares: paquete.paquete_precio_dolar,
            duracion: paquete.paquetes_horas_certificacion,
            perfil: paquete.paquete_perfil_alumno,
            objetivos: [],
            cursos: [],
          }));

          for (const paquete of paqueteMapeado) {
            if (tipo === 1) {
              const objetivos = await this.objetivosxpromocion(idPaq);
              if (Array.isArray(objetivos[0])) {
                paquete.objetivos = objetivos[0].map((objetivo: any) => ({
                  id: objetivo.objetivo_id,
                  descripcion: objetivo.objetivo_descripcion.replace(/\r/g, ''),
                }));
              }
            }

            if (tipo === 0) {
              const objetivos = await this.objetivosxespecializacion(idPaq);
              if (Array.isArray(objetivos[0])) {
                paquete.objetivos = objetivos[0].map((objetivo: any) => ({
                  id: objetivo.objetivo_id,
                  descripcion: objetivo.objetivo_descripcion.replace(/\r/g, ''),
                }));
              }
            }

            const cursos = await this.paquetesnormales(idPaq, tipo);
            if (Array.isArray(cursos)) {
              paquete.cursos = cursos.map((curso: any) => ({
                id: curso.curso_id,
                nombre: curso.curso_nombre,
                descripcion: curso.curso_descripcion,
                id_docente: curso.docente_id,
                docente: curso.docente_nombre,
                imagen: curso.docente_imagen,
              }));
            }
          }
          return paqueteMapeado;
        } else {
          return { message: 'El paquete no coincide con el tipo.' };
        }
      } else {
        return { message: 'El paquete no esta registrado.' };
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al mostrar el detalle del paquete ' + error.message,
      );
    }
  }

  async paquetesnormales(idPaq: number, tipo: number) {
    try {
      const [cursos] = await this.cursoRepository.query(
        'Call sp_listar_cursos_paquete(?,?)',
        [idPaq, tipo],
      );
      return cursos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al mostrar los cursos del paquete ' + error.message,
      );
    }
  }
  async cursosxpaquetes(idPaq: number, tipo: number) {
    try {
      const cursos = await this.cursoRepository.query(
        'Call sp_listar_cursos_paquetesc(?,?)',
        [idPaq, tipo],
      );
      return cursos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al mostrar los cursos del paquete ' + error.message,
      );
    }
  }

  async objetivosxpromocion(idPaq: number) {
    try {
      const objetivos = await this.objetivoRepository.query(
        'Call sp_listar_objetivo_promocion(?)',
        [idPaq],
      );
      return objetivos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al obtener los objetivos por promocion ' + error.message,
      );
    }
  }

  async objetivosxespecializacion(idPaq: number) {
    try {
      const objetivos = await this.objetivoRepository.query(
        'Call sp_listar_objetivo_especializacion(?)',
        [idPaq],
      );
      return objetivos;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al obtener los objetivos por espacializacion ' + error.message,
      );
    }
  }

  async paquetesComprados(
    nombre_institucion: string,
    paqueteFilterCompradas: PaqueteFilterCompradas,
  ) {
    try {
      const getestudiante = await this.paqueteRepository.query(
        'SELECT COUNT(*) AS count FROM tbl_estudiante WHERE estudiante_id = ?',
        [paqueteFilterCompradas.id_estudiante],
      );

      if (getestudiante[0].count > 0) {
        const especializaciones = await this.paqueteRepository.query(
          'CALL sp_filtrar_paquetes_comprados(?,?,?,?)',
          [
            nombre_institucion,
            paqueteFilterCompradas.id_estudiante,
            paqueteFilterCompradas.nombre_paquete,
            paqueteFilterCompradas.tipo_paquete,
          ],
        );

        if (especializaciones[0] && Array.isArray(especializaciones[0])) {
          const mappedEspecializaciones = await Promise.all(
            especializaciones[0].map(async (paquete: any) => {
              const cursosAndProgreso = await this.cursosEspecializacion(
                paquete.paquete_id,
                paqueteFilterCompradas.id_estudiante,
              );

              return {
                id: paquete.paquete_id,
                imagen: paquete.paquete_imagen,
                nombre: paquete.paquete_nombre,
                tipo: paquete.paquete_tipo,
                detallefechainicioacceso:
                  paquete.detalleventa_fecha_inicio_acceso,
                detalleventaservicio_id: paquete.detalleventa_servicio_id,
                detalleventaid: paquete.detalleventa_id,
                detalleventatiposervicio: paquete.detalleventa_tipo_servicio,
                cursos_especializacion: cursosAndProgreso.cursos.map(
                  (curso: any) => ({
                    id: curso.curso_id,
                    imagen: curso.curso_imagen,
                    nombre: curso.curso_nombre,
                    categoriaCursoNombre: curso.categoria_curso_nombre,
                    estado: curso.matricula_estado,
                    matiriculaFechaInscripcion:
                      curso.matricula_fecha_inscripcion,
                    matriculaProgreso: curso.matricula_progreso,
                    matricula_nota_promedio: curso.matricula_nota_promedio,
                  }),
                ),
                progreso: cursosAndProgreso.progreso,
              };
            }),
          );

          return mappedEspecializaciones;
        } else {
          return [];
        }
      } else {
        return { message: 'El id_estudiante no existe' };
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener las especializaciones compradas ' + error.message,
      );
    }
  }

  async cursosEspecializacion(idpaquete: number, idEstudiante: number) {
    try {
      const result = await this.paqueteRepository.query(
        'CALL sp_listar_cursos_paquetesc(?,?,@nota,@porcentaje)',
        [idpaquete, idEstudiante],
      );

      const cursos = result[0]; // Asumo que los cursos se encuentran en el primer elemento del resultado

      const progreso = await this.paqueteRepository.query(
        'SELECT @nota AS nota, @porcentaje AS porcentaje',
      );

      return { cursos, progreso };
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener los cursos de una especialización ' + error.message,
      );
    }
  }
  async filtrarPaqueteEstudiante(
    institucion: string,
    idEstudiante: number,
    filterPaqueteDto: FilterPaqueteDto,
  ) {
    try {
      //Seleccionar el indice de inicio de la pagina
      const startIndex =
        (filterPaqueteDto.page - 1) * filterPaqueteDto.sizePage;

      const [filtrar] = await this.paqueteRepository.query(
        'CALL sp_listar_paquetes_filtros_estudiante(?,?,?,?,?)',
        [
          institucion,
          filterPaqueteDto.input,
          filterPaqueteDto.orden,
          filterPaqueteDto.tipo,
          idEstudiante,
        ],
      );
      const paginatedPaquetes = filtrar.slice(
        startIndex,
        startIndex + filterPaqueteDto.sizePage,
      );
      const contadorPaquetes = filtrar.length;
      // console.log(filterPaqueteDto.tipo)
      return {contadorPaquetes,paquetes: paginatedPaquetes};
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener los cursos de una especialización ' + error.message,
      );
    }
  }

  // async especializacionCompradas(nombre_institucion: string, cursoFilterEspecializacionDto: CursoFilterEspecializacionDto){
  //   try {
  //     const especializacioncompradas = await this.cursoRepository.query(
  //       'Call sp_filtrar_especializacion_compradas(?)', [nombre_institucion,
  //         cursoFilterEspecializacionDto.id_estudiante,
  //         cursoFilterEspecializacionDto.nombre_paquete
  //       ]
  //     );
  //     return especializacioncompradas[0];
  //   } catch (error) {
  //     throw new Error('No se pudo obtener la especializacion compradas ' + error.message)
  //   }
  // }
  //filtros de promociones compradas
  // async promocionesCompradas(nombre_institucion: string, cursoFilterEspecializacionDto: CursoFilterEspecializacionDto){
  //   try {
  //     const promocionescompradas = await this.cursoRepository.query(
  //       'Call sp_filtra_promociones_comprados(?)', [nombre_institucion]
  //     );
  //     return promocionescompradas[0];
  //   } catch (error) {
  //     throw new Error('No se pudo obtener la promociones compradas ' + error.message)
  //   }
  // }
}
