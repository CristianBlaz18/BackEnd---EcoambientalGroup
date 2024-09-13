import { id } from 'date-fns/locale';
import { Injectable } from '@nestjs/common';
import { CreateResenaDto } from './dto/create-resena.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resena } from './entities/resena.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(Resena)
    private resenaRepository: Repository<Resena>,
  ) {}

  // async resenaCurso(resenaCursoDto:ResenaCursoDto) {
  //   try {

  //     const [getResena] = await this.resenaRepository.query('CALL sp_visualizar_reseñas_curso(?,?,?)', [
  //       resenaCursoDto.id_curso,
  //       resenaCursoDto.nombre_institucion,
  //       resenaCursoDto.id_matricula,
  //     ]);
  //     return getResena;
  //   } catch (error) {

  //     throw new NotFoundException('No se pudieron obtener las reseñas del curso');
  //   }
  // }
  async resumenCurso(idCurso:number,institucion:string){
    try {
      const [resumen] = await this.resenaRepository.query('CALL sp_resumen_curso_reseñas(?)',[idCurso]);
      if (resumen && Array.isArray(resumen)) {
        const resumenMapeado = resumen.map((resu) => ({
          curso_valoracion: resu.curso_valoracion,
          docente_valoracion: resu.docente_valoracion,
          tutor_valoracion: resu.tutor_valoracion,
          Comentarios:[]
        }));
        for(const resumen of resumenMapeado){       
          const reseñas = await this.resenaCurso(idCurso,institucion);
          if (reseñas && Array.isArray(reseñas)) {
            resumen.Comentarios = reseñas;
          }else{
            return[]
          }
          
        }
        return resumenMapeado
      }else{
        return []
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'No se pudieron obtener el resumen de la reseña',
      );
    }
  }

  async resenaCurso(idCurso: number, institucion: string) {
    try {
      const [getResena] = await this.resenaRepository.query(
        'CALL sp_visualizar_reseñas_curso(?,?)',
        [idCurso, institucion],
      );
      return getResena;
    } catch (error) {
      console.log(error);
      throw new Error(
        'No se pudieron obtener las reseñas del curso desde el servicio',
      );
    }
  }

  async enviarResena(crearResenaDto: CreateResenaDto) {
    try {
      const [enviarResena] = await this.resenaRepository.query(
        'CALL sp_registrar_calificacion_curso(?, ?, ?, ?, ?)',
        [
          crearResenaDto.nombre_institucion,
          crearResenaDto.id_curso,
          crearResenaDto.id_estudiante,
          crearResenaDto.calificacion_curso,
          crearResenaDto.comentario_curso,
        ],
      );
      return enviarResena;
    } catch (error) {
      if (error.code === 'ER_SIGNAL_EXCEPTION' && error.sqlMessage) {
        // Si es un error específico de SQL, puedes devolver el mensaje
        return { error: error.sqlMessage };
      } else {
        // Manejar otros errores o lanzarlos nuevamente si no son específicos de SQL
        throw error;
      }
    }
  }
}
