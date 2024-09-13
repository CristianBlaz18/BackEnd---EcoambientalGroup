import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Modulo } from './entities/modulo.entity';
import { Repository } from 'typeorm';
import { CursoService } from 'src/curso/curso.service';
import { MostrarModulosDto } from './dto/mostrar-modulos.dto';
import { MostrarEvalEntreDto } from './dto/evalEntre-modulo.dto';

@Injectable()
export class ModuloService {
  constructor(
    private readonly cursoService: CursoService,
    @InjectRepository(Modulo)
    private moduloRepository: Repository<Modulo>,
  ) {}

  // async modulosCursoComprado(institucion, {idCurso,idEstudiante}:MostrarModulosDto ) {
  //   try {
  //     const modulos = await this.cursoService.modulosCurso(
  //       institucion,
  //       idCurso,
  //     );
  //     if (modulos && Array.isArray(modulos)) {
  //       //console.log(modulos)
  //       const modulosMapeado = modulos.map((modulo: any) => ({
  //         modulo_id: modulo.modulo_id,
  //         modulo_nombre: modulo.modulo_nombre,
  //         modulo_material: modulo.modulo_material,
  //         modulo_descripcion: modulo.modulo_descripcion,
  //         modulo_fecha_inicio: modulo.modulo_fecha_inicio,
  //         contenido:[]
  //       }));

  //       for (const modulo of modulosMapeado) {
  //         const sesion = await this.detalleModulo(
  //           modulo.modulo_id,
  //           idCurso,
  //           idEstudiante,

  //         );
  //         //console.log(modulo.modulo_id);
  //         if (Array.isArray(sesion)) {
  //           modulo.contenido = sesion
  //         }
  //         const entregable = await this.entregableEvaluaciones(modulo.modulo_id);
  //         if(Array.isArray(entregable)){
  //           modulo.contenido = entregable
  //         }
  //       }
  //       return modulosMapeado;
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al obtener los modulos del curso' + error.message);
  //   }
  // }

  async evaEntreModulo(institucion, { idCurso}: MostrarEvalEntreDto) {
    try {
      const modulos = await this.cursoService.modulosCurso(institucion, idCurso);
      if (modulos && Array.isArray(modulos)) {
        const contenido = {
          Evaluaciones: [],
          Entregables: [],
        };
  
        for (const modulo of modulos) {
          const entregableEvaluaciones = await this.entregableEvaluaciones(modulo.modulo_id);
          
          if (Array.isArray(entregableEvaluaciones)) {
            for (const contenidoItem of entregableEvaluaciones) {
              if (contenidoItem.tipo_contenido === 'Ev') {
                contenido.Evaluaciones.push(contenidoItem);
              } else if (contenidoItem.tipo_contenido === 'En') {
                contenido.Entregables.push(contenidoItem);
              }
            }
          }
        }
  
        return [contenido];
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener las evaluaciones y entregables' + error.message);
    }
  }
  
  async modulosCursoComprado(
    institucion,
    { idCurso, idEstudiante }: MostrarModulosDto,
  ) {
    try {
      const modulos = await this.cursoService.modulosCurso(
        institucion,
        idCurso,
      );
      if (modulos && Array.isArray(modulos)) {
        const modulosMapeado = await Promise.all(
          modulos.map(async (modulo: any) => {
            const sesion = await this.detalleModulo(
              modulo.modulo_id,
              idCurso,
              idEstudiante,
            );
            const entregable = await this.entregableEvaluaciones(
              modulo.modulo_id,
            );

            const contenido = [];

            if (Array.isArray(sesion)) {
              contenido.push(...sesion);
            }

            if (Array.isArray(entregable)) {
              contenido.push(...entregable);
            }

            return {
              modulo_id: modulo.modulo_id,
              modulo_numeracion: modulo.modulo_numeracion,
              modulo_nombre: modulo.modulo_nombre,
              modulo_descripcion: modulo.modulo_descripcion,
              modulo_fecha_inicio: modulo.modulo_fecha_inicio,
              contenido,
            };
          }),
        );

        return modulosMapeado;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener los modulos del curso' + error.message);
    }
  }

  async detalleModulo(idModulo: number, idCurso: number, idEstudiante: number) {
    try {
      const [modulo] = await this.moduloRepository.query(
        'CALL sp_listar_sesiones_x_modulos(?,?,?)',
        [idModulo, idCurso, idEstudiante],
      );

      return modulo;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al obtener el detalle del modulo ' + error.message,
      );
    }
  }
  async entregableEvaluaciones(idModulo: number) {
    try {
      const [entregable] = await this.moduloRepository.query(
        'CALL sp_filtrar_entregables_evaluaciones(?)',
        [idModulo],
      );
      if (entregable && Array.isArray(entregable)) {
        const entregableMapeado = entregable.map((Entregable: any) => ({
          // sesion_id: Entregable.entregable_id,
          // sesion_nombre: Entregable.entregable_nombre,
          sesion_id: Entregable.entregable_evaluacion_id,
          sesion_nombre: Entregable.entregable_evaluacion_descripcion,
          tipo_contenido: Entregable.tipo_contenido,
          entregable_evaluacion_fecha_limite:Entregable.entregable_evaluacion_fecha_limite,
          modulo_fecha_inicio:Entregable.modulo_fecha_inicio
        }));
        return entregableMapeado;
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al obtener el detalle del modulo ' + error.message,
      );
    }
  }
  // async funcionEntrega(idEstudiante: number, idModulo: number){
  //   try {
  //     const modulo = await this.moduloRepository.query(
  //       'SELECT fn_validar_entrega_enteva(?,?) as respuesta',
  //       [idEstudiante, idModulo],
  //     );
  //     return modulo[0].respuesta;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al obtener el detalle del modulo ' + error.message,
  //     );
  //   }
  // }
}
