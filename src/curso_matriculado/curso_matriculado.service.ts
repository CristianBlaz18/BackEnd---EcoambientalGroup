import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CursoMatriculado } from './entities/curso_matriculado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CursoMatriculadoService {
  constructor(
    @InjectRepository(CursoMatriculado)
    private readonly cursomatriculadoRepository: Repository<CursoMatriculado>,
  ) {}

  async cursomoduloMatriculado(nombreInstitucion: string, idCurso: number) {
    try {
      const query = `call sp_visualizar_modulos_curso(?,?)`;
      const cursomatriculado = await this.cursomatriculadoRepository.query(
        query,
        [nombreInstitucion, idCurso],
      );
      return cursomatriculado[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener modulos del curso : ' + error.message);
    }
  }
  //promedio del curso
  async promedio(idMatricula: number) {
    try {
      const [result] = await this.cursomatriculadoRepository.query(
        'SELECT fn_promediar_nota_x_evaluaciones_entregables(?) AS promedio',
        [idMatricula],
      );

      return result.promedio;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener el promedio del curso: ' + error.message,
      );
    }
  }

  // async materialesModulo(idModulo: number) {
  //   try {
  //     const query = `call sp_listar_modulo_materiales(?,)`;
  //     const materialesModulo = await this.cursomatriculadoRepository.query(
  //       query,
  //       [idModulo],
  //     );
  //     return materialesModulo[0];
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al obtener el materiales de un modulo ' + error.message,
  //     );
  //   }
  // }
}
