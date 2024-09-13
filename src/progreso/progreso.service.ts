import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Progreso } from './entities/progreso.entity';
import { Repository } from 'typeorm';
import { ProgresoDto } from './dto/progreso.dto';

@Injectable()
export class ProgresoService {
  constructor(
    @InjectRepository(Progreso)
    private progresoRepository: Repository<Progreso>,
  ) {}
  async progreso(progresoDto: ProgresoDto) {
    try {
      await this.progresoRepository.query(
        'CALL sp_filtrar_cursoc_detalle(?, ?, @f_fin, @nota, @progreso,@d_certificado)',
        [progresoDto.idCurso, progresoDto.idEstudiante],
      );

      const [result] = await this.progresoRepository.query(
        'SELECT  @f_fin AS fecha_fin, @nota AS nota_promedio, @progreso AS progreso, @d_certificado as certificado',
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener el progreso de un curso ' + error.message,
      );
    }
  }
  // async progresoCurso(idEstudiante: number, idCurso: number) {
  //   try {
  //     const [progreso] = await this.progresoRepository.query(
  //       'SELECT ft_devolver_pogreso_curso(?,?)',
  //       [idEstudiante, idCurso],
  //     );
  //     return progreso;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al obtener el progreso ' + error.message);
  //   }
  // }

  // async terminoCurso(idCurso: number) {
  //   try {
  //     const [notificacion] = await this.progresoRepository.query(
  //       'CALL sp_visualizar_duracion_curso(?)',
  //       [idCurso],
  //     );
  //     if (
  //       notificacion &&
  //       notificacion[0] &&
  //       notificacion[0].matricula_fecha_fin_acceso
  //     ) {
  //       const diferenciaMeses = Math.abs(
  //         differenceInWeeks(
  //           new Date(),
  //           new Date(notificacion[0].matricula_fecha_fin_acceso),
  //         ),
  //       );
  //       return diferenciaMeses;
  //     } else {
  //       throw new Error(
  //         'No se pudo obtener la fecha de finalización del curso.',
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al obtener la terminacion del curso ' + error.message,
  //     );
  //   }
  // }
}
