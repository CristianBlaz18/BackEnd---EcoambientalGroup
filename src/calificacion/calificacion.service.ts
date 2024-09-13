import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Calificacion } from './entities/calificacion.entity';
import { Repository } from 'typeorm';
import { QuerysCalificacionDto } from './dto/querys-calificacion.dto';
import { UpdateCalificacionTutorDto } from './dto/update-calificacion-tutor.dto';
import { UpdateCalificacionDocenteDto } from './dto/update-calificacion-docente.dto';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private calificacionRepository: Repository<Calificacion>,
  ) {}

  async calificaciones(
    institucion: string,
    querysCalificacionDto: QuerysCalificacionDto,
  ) {
    try {
      //Definimos con esto el inicio de la pagina
      const startIndex =
        (querysCalificacionDto.page - 1) * querysCalificacionDto.sizePage;

      //Se ejecuta el procedimiento almacenado
      const [calificaciones] = await this.calificacionRepository.query(
        `Call sp_listar_comentarios_curpaq(?,?,?)`,
        [
          institucion,
          querysCalificacionDto.idContenido,
          querysCalificacionDto.tipoContenido,
        ],
      );

      //Aqui se puede dar la cantidad de elementos listados dentro de una pagina
      const calificacionesPaginados = calificaciones.slice(
        startIndex,
        startIndex + querysCalificacionDto.sizePage,
      );

      //Calculamos el total de elementos que hay en el array
      const totalCalificaciones = calificaciones.length;
      return { totalCalificaciones, calificaciones: calificacionesPaginados };
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener las calificaciones: ' + error.message);
    }
  }

  // async calificacionesCurso(institucion: string, idCurso: number) {
  //   try {
  //     const [calificaciones] = await this.calificacionRepository.query(
  //       `CALL sp_listar_valoracion_x_curso(?, ?)`,
  //       [idCurso, institucion],
  //     );
  //     return calificaciones;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Ocurrio un error al obtener las calificaciones en un curso ' +
  //         error.message,
  //     );
  //   }
  // }

  async registrarCalificacion(updateCalificacionDto: UpdateCalificacionDto) {
    try {
      //Ejecutamos el procedimiento para registra la calificacion del curso
      const query =
        'CALL sp_registrar_calificacion_curso(?,?,?,?,?,@progreso_curso)';
      const parameters = [
        updateCalificacionDto.nombre_institucion,
        updateCalificacionDto.id_curso,
        updateCalificacionDto.id_usuario,
        updateCalificacionDto.valoracion_curso,
        updateCalificacionDto.comentario,
      ];

      const [result] = await this.calificacionRepository.query(
        query,
        parameters,
      );
      //Ejecutamos esta consulta sql para traer el output que nos da el anterior procedimiento
      const [progreso] = await this.calificacionRepository.query(
        'SELECT @progreso_curso AS progreso_curso',
      );

      return { status: result[0], progreso };
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error registrar la calificacion y comentario.' + error.message,
      );
    }
  }
  async registrarCalificacionTutor(
    updateCalificacionTutorDto: UpdateCalificacionTutorDto,
  ) {
    //Ejecutamos el procedimiento para registra la calificacion del tutor
    const query =
      'CALL sp_registrar_calificacion_tutor(?,?,?,?,@progreso_curso)';
    const parameters = [
      updateCalificacionTutorDto.nombre_institucion,
      updateCalificacionTutorDto.id_curso,
      updateCalificacionTutorDto.id_estudiante,
      updateCalificacionTutorDto.valoracion_tutor,
    ];
    try {
      const [result] = await this.calificacionRepository.query(
        query,
        parameters,
      );
        //Ejecutamos esta consulta sql para traer el output que nos da el anterior procedimiento
      const [progreso] = await this.calificacionRepository.query(
        'SELECT @progreso_curso AS progreso_curso',
      );

      return { status: result[0], progreso };
    } catch (error) {
      console.error(error);

      // Obtén el mensaje de error SQL si está disponible
      const sqlErrorMessage = error.sqlMessage || 'Error en la consulta SQL';

      // Lanza la excepción con el mensaje de error
      throw new BadRequestException(sqlErrorMessage);
    }
  }

  async registrarCalificacionDocente(
    updateCalificacionDocenteDto: UpdateCalificacionDocenteDto,
  ) {
    //Ejecutamos el procedimiento para registrar la calificacion del docente
    const query =
      'CALL sp_registrar_calificacion_docente(?,?,?,?,@progreso_curso)';
    const parameters = [
      updateCalificacionDocenteDto.nombre_institucion,
      updateCalificacionDocenteDto.id_curso,
      updateCalificacionDocenteDto.id_estudiante,
      updateCalificacionDocenteDto.valoracion_docente,
    ];

    try {
      const [result] = await this.calificacionRepository.query(
        query,
        parameters,
      );
      //Ejecutamos esta consulta SQL para traer el output del anterior procedimiento almacenado
      const [progreso] = await this.calificacionRepository.query(
        'SELECT @progreso_curso AS progreso_curso',
      );

      if (result && result.length > 0 && result[0].status === 'success') {
        return { status: result[0].status, progreso };
      } else {
        const sqlErrorMessage = ''; // Asegúrate de obtener el mensaje de error adecuadamente
        throw new BadRequestException(sqlErrorMessage);
      }
    } catch (error) {
      console.error(error);

      // Obtén el mensaje de error SQL si está disponible
      const sqlErrorMessage = error.sqlMessage || 'Error en la consulta SQL';

      // Lanza la excepción con el mensaje de error
      throw new BadRequestException(sqlErrorMessage);
    }
  }

  async getInfoTutor(idCurso: number) {
    try {
      //Ejecutamos el procedimiento almacenado con los parametros de entrada requeridos
      const [infoTutor] = await this.calificacionRepository.query(
        'call sp_visualizar_info_tutor(?)',
        [idCurso],
      );
      return infoTutor;
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al mostrar la informacion del tutor' + error.message,
      );
    }
  }


  async getValoracionTutor(institucion: string, idCurso: number) {
    try {
      //Ejecutamos el procedimiento alamcenado para visualizar la valoracion
      const [valoTutor] = await this.calificacionRepository.query(
        'call sp_visualizar_valoracion_tutor(?,?)',
        [institucion, idCurso],
      );
      return valoTutor;
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al mostrar la valoracion del tutor' + error.message,
      );
    }
  }
  async getInfoDocente(idCurso: number) {
    try {
      //Ejecutar el procedimiento almacenado qe se encarga de visualizar la info del docente
      const [infoDocente] = await this.calificacionRepository.query(
        'call sp_visualizar_info_docente(?)',
        [idCurso],
      );
      return infoDocente;
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al mostrar la informacion del docente' + error.message,
      );
    }
  }
  async getValoracionDocente(institucion: string, idCurso: number) {
    try {
      //Ejecutar el procedimiento almacenado
      const [valoDocente] = await this.calificacionRepository.query(
        'call sp_visualizar_valoracion_docente(?,?)',
        [institucion, idCurso],
      );
      return valoDocente;
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al mostrar la valoracion del docente' + error.message,
      );
    }
  }
}
