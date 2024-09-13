import { BadRequestException, Injectable } from '@nestjs/common';
import { EvaluacionesEstudianteDto } from './dto/evaluaciones-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { Repository } from 'typeorm';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { RegistrarRespuestaDto } from './dto/registrar-respuesta.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
  ) {}

  async getEvaluacionEstudiante(
    institucion: string,
    evaluacionEstudianteDto: EvaluacionesEstudianteDto,
  ) {
    try {
      const evaluaciones = await this.evaluacionRepository.query(
        'CALL sp_listar_evaluacion_detalles(?,?,?)',
        [
          evaluacionEstudianteDto.idEstudiante,
          evaluacionEstudianteDto.idEvaluacion,
          evaluacionEstudianteDto.IdCurso,
        ],
      );
      if (evaluaciones[0] && Array.isArray(evaluaciones[0])) {
        const evaluacionesMapeado = evaluaciones[0].map((evaluacion: any) => ({
          evaluacion_id: evaluacion.evaluacion_id,
          evaluacion_descripcion: evaluacion.evaluacion_descripcion,
          evaluacion_instruccion: evaluacion.evaluacion_instruccion,
          intentos_restantes: evaluacion.intentos_restantes,
          evaluacion_intentos: evaluacion.evaluacion_intentos,
          evaluacion_nota: evaluacion.evaluacion_nota,
          evaluacion_duracion: evaluacion.evaluacion_duracion,
          evaluacion_fecha_inicio: evaluacion.evaluacion_fecha_inicio,
          fin_acceso: evaluacion.fin_acceso,
          evaluacion_fecha_fin: evaluacion.evaluacion_fecha_fin,
          notas: [],
        }));
        for (const evaluaciones of evaluacionesMapeado) {
          const notas = await this.evaluacionNotas(
            institucion,
            evaluacionEstudianteDto.idEstudiante,
            evaluacionEstudianteDto.idEvaluacion,
          );

          if (Array.isArray(notas)) {
            evaluaciones.notas = notas.map((nota: any) => ({
              entrega_evaluacion_id: nota.entrega_evaluacion_id,
              evaluacion_num_intento: nota.evaluacion_num_intento,
              envio_estado: nota.envio_estado,
              envio_nota: nota.envio_nota,
              preguntas_correctas: nota.preguntas_correctas,
              numero_preguntas: nota.numero_preguntas,
            }));
          }
        }
        return evaluacionesMapeado[0];
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al visualizar evaluaciones del estudiante: ' + error.message,
      );
    }
  }
  async evaluacionNotas(
    nombre_institucion: string,
    idEstudiante: number,
    id_evaluacion: number,
  ) {
    try {
      const query = 'Call sp_visualizar_notas_evaluacion(?,?,?)';
      const evaluacionesNotas = await this.evaluacionRepository.query(query, [
        nombre_institucion,
        idEstudiante,
        id_evaluacion,
      ]);
      return evaluacionesNotas[0];
    } catch (error) {
      throw new Error('error al obtener las evaluaciones de notas');
    }
  }

  // async evaluacionesIntentos(
  //   institucion: string,
  //   idEvaluacion: number,
  //   idEstudiante: number,
  // ) {
  //   try {
  //     const intentos = await this.evaluacionRepository.query(
  //       'CALL sp_listar_numeros_intentos_evaluacion(?,?)',
  //       [idEvaluacion, idEstudiante],
  //     );

  //     if (intentos[0] && Array.isArray(intentos[0])) {
  //       const intentosMapeados = intentos[0].map((intento: any) => ({
  //         intentos: intento.numeros_intentos,
  //         estado: intento.resultado,
  //         restantes: intento.intentos_restantes,
  //       }));

  //       for (const intento of intentosMapeados) {
  //         const intentostotales = intento.intentos + intento.restantes;
  //         if (intento.intentos < intentostotales){
  //           const estados = await this.listarEstadoEvaluacion(idEstudiante,idEvaluacion)
  //           if(estados && Array.isArray(estados)){
  //             const Evaluacion = estados.map((estado:any)=>({
  //               entrega_evaluacion_id: estado.entrega_evaluacion_id,
  //               envio_estado:estado.envio_estado,
  //               nombre_modulo:estado.nombre,
  //               nombre_evaluacion:estado.descripcion,
  //               envio_fecha_entrega: estado.envio_fecha_entrega,
  //               envio_hora_inicio: estado.envio_hora_inicio,
  //               envio_hora_fin: estado.envio_hora_fin,
  //               pregunta:[]
  //             }));
  //             for(const estados of Evaluacion){
  //               if(estados.envio_estado == "Finalizado" || estados.envio_estado == null || estados.envio_estado == ""){
  //                 estados.pregunta = await this.obtenerPreguntasConAlternativas(idEvaluacion)
  //               }else{
  //                 if(estados.envio_estado == "En proceso"){
  //                   estados.pregunta =   await this.getPreguntasUltimo(
  //                     idEvaluacion,
  //                     idEstudiante,
  //                     institucion,
  //                   );
  //                 }
  //               }
  //             }
  //             return {restantes:intento.restantes,evaluacion:Evaluacion[0]}
  //           }

  //         }else{
  //           return {error:"Ya no tienes Intentos",
  //         restantes:intento.restantes}
  //         }

  //       }
  //     } else {
  //       return { mensaje: 'No es array' };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al obtener preguntas ' + error.message);
  //   }
  // }

  async evaluacionesIntentos(
    institucion: string,
    idEvaluacion: number,
    idEstudiante: number,
    idEntregaEvaluacion: number,
  ) {
    try {
      const intentos = await this.evaluacionRepository.query(
        'CALL sp_listar_numeros_intentos_evaluacion(?,?)',
        [idEvaluacion, idEstudiante],
      );

      if (intentos[0] && Array.isArray(intentos[0])) {
        const intentosMapeados = intentos[0].map((intento: any) => ({
          intentos: intento.numeros_intentos,
          estado: intento.resultado,
          restantes: intento.intentos_restantes,
        }));

        for (const intento of intentosMapeados) {
          const intentostotales = intento.intentos + intento.restantes;
          if (intento.intentos <= intentostotales) {
            const estados = await this.listarEstadoEvaluacion(
              idEstudiante,
              idEvaluacion,
              idEntregaEvaluacion,
            );
            if (estados[0] && Array.isArray(estados[0])) {
              const Evaluacion = estados[0].map((estado: any) => ({
                entrega_evaluacion_id: estado.entrega_evaluacion_id,
                envio_estado: estado.envio_estado,
                nombre_modulo: estado.modulo_nombre,
                nombre_evaluacion: estado.evaluacion_descripcion,
                envio_hora_inicio: estado.envio_hora_inicio,
                envio_hora_fin: estado.envio_hora_fin,
                pregunta: [],
              }));
              for (const estados of Evaluacion) {
                const preguntas = await this.listarEstadoPregunta(
                  idEstudiante,
                  idEntregaEvaluacion,
                );

                if (Array.isArray(preguntas)) {
                  estados.pregunta = preguntas;
                }
              }
              return Evaluacion;
            }
          } else {
            return {
              error: 'Ya no tienes Intentos',
              restantes: intento.restantes,
            };
          }
        }
      } else {
        return { mensaje: 'No es array' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener preguntas ' + error.message);
    }
  }

  async listarEstadoPregunta(
    idEstudiante: number,
    idEntregableEvaluacion: number,
  ) {
    try {
      const [estadoPregunta] = await this.evaluacionRepository.query(
        'CALL sp_listar_estado_pregunta(?,?)',
        [idEstudiante, idEntregableEvaluacion],
      );
      if (estadoPregunta && Array.isArray(estadoPregunta)) {
        const Preguntas = estadoPregunta.map((estado: any) => ({
          pregunta_id: estado.pregunta_id,
          detalle_evaluacion_id: estado.detalle_evaluacion_id,
          pregunta_imagen: estado.pregunta_imagen,
          pregunta_estado: estado.pregunta_estado,
          pregunta_descripcion: estado.pregunta_descripcion,
          alternativas: [],
        }));
        for (const estados of Preguntas) {
          const [alternativas] = await this.listarEstadoAlternativa(
            idEstudiante,
            idEntregableEvaluacion,
            estados.pregunta_id,
          );
          if (Array.isArray(alternativas)) {
            estados.alternativas = alternativas;
          }
        }
        return Preguntas;
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener preguntas ' + error.message);
    }
  }
  async listarEstadoAlternativa(
    idEstudiante: number,
    idEntregableEvaluacion: number,
    idPregunta: number,
  ) {
    try {
      const estadoAlternativa = await this.evaluacionRepository.query(
        'CALL sp_listar_estado_alternativa(?,?,?)',
        [idEstudiante, idEntregableEvaluacion, idPregunta],
      );
      return estadoAlternativa;
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener preguntas ' + error.message);
    }
  }

  async listarEstadoEvaluacion(
    idEstudiante: number,
    idEvaluacion: number,
    idEntregaEvaluacion: number,
  ) {
    try {
      const estado = await this.evaluacionRepository.query(
        'CALL sp_listar_estado_evaluacion(?,?,?)',
        [idEstudiante, idEvaluacion, idEntregaEvaluacion],
      );
      return estado;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener las preguntas de la evaluacion ' + error.message,
      );
    }
  }

  async obtenerPreguntasConAlternativas(idEvaluacion: number): Promise<any[]> {
    try {
      const preguntas = await this.getpreguntas(idEvaluacion);

      if (preguntas[0] && Array.isArray(preguntas[0])) {
        const preguntasMapeadas = preguntas[0].map((pregunta: any) => ({
          pregunta_id: pregunta.pregunta_id,
          pregunta_descripcion: pregunta.pregunta_descripcion,
          pregunta_imagen: pregunta.pregunta_imagen,
          pregunta_puntuacion: pregunta.pregunta_puntuacion,
          alternativas: [],
        }));

        for (const pregunta of preguntasMapeadas) {
          const alternativas = await this.getAlternativas(pregunta.pregunta_id);

          if (Array.isArray(alternativas[0])) {
            pregunta.alternativas = alternativas[0].map((alternativa: any) => ({
              alternativa_id: alternativa.alternativa_id,
              alternativa_descripcion: alternativa.alternativa_descripcion,
              estado_alternativa: alternativa.estado_alternativa ?? 0,
            }));
          }
        }

        return preguntasMapeadas;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener las preguntas de la evaluacion ' + error.message,
      );
    }
  }

  async getpreguntas(idEvaluacion: number) {
    try {
      const preguntas = await this.evaluacionRepository.query(
        'CALL sp_listar_preguntas_evaluacion(?)',
        [idEvaluacion],
      );
      return preguntas;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener las preguntas de la evaluacion ' + error.message,
      );
    }
  }

  async getAlternativas(idPregunta: number) {
    try {
      const alternativas = await this.evaluacionRepository.query(
        'Call sp_listar_alternativas_evaluacion(?)',
        [idPregunta],
      );
      return alternativas;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener las alternativas de la pregunta ' + error.message,
      );
    }
  }

  async getPreguntasUltimo(
    idEvaluacion: number,
    idEstudiante: number,
    institucion: string,
  ) {
    try {
      const preguntasUltimo = await this.evaluacionRepository.query(
        'CALL sp_listar_preguntas_evaluacion_estudiante(?,?,?)',
        [idEvaluacion, idEstudiante, institucion],
      );
      return preguntasUltimo[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error al traer las ultimas preguntas ' + error.message);
    }
  }

  async evaluaciones(idModulo: number) {
    try {
      const query = `call sp_listar_evaluacion(?)`;
      const evaluacion = await this.evaluacionRepository.query(query, [
        idModulo,
      ]);
      return evaluacion[0];
    } catch (error) {
      throw new Error(
        'Error al obtener el listado la evaluacion ' + error.message,
      );
    }
  }

  // async preguntaEvaluacion(idEvaluacion: number) {
  //   try {
  //     const query = `call sp_listar_preguntas_evaluacion(?)`;
  //     const preguntaevaluacion = await this.evaluacionRepository.query(query, [
  //       idEvaluacion,
  //     ]);
  //     return preguntaevaluacion[0];
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al obtener el listado de preguntas y evaluaciones: '+error.message,
  //     );
  //   }
  // }

  // async alternativas(idPregunta: number) {
  //   try {
  //     const query = `call sp_listar_alternativas_evaluacion(?)`;
  //     const alternativas = await this.evaluacionRepository.query(query, [
  //       idPregunta,
  //     ]);
  //     return alternativas[0];
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al visualizar la retroalimentacion de una evaluacion: ' +
  //         error.message,
  //     );
  //   }
  // }

  // async retroalimentacion(
  //   idInstitucion: string,
  //   idEstudiante: number,
  //   idEvaluacion: number,
  // ) {
  //   try {
  //     const result = await this.evaluacionRepository.query(
  //       `CALL sp_visualizar_retroalimentacion_asesor(?,?,?)`,
  //       [idInstitucion, idEstudiante, idEvaluacion],
  //     );
  //     return result[0];
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al visualizar la retroalimentacion de una evaluacion: ' +
  //         error.message,
  //     );
  //   }
  // }

  async registrarEvaluacion(CreateEvaluacionDto: CreateEvaluacionDto) {
    // try {
    // Asegúrate de proporcionar el quinto argumento necesario
    await this.evaluacionRepository.query(
      'CALL sp_registrar_evaluacion(?,?,@id_envio_evaluacion)',
      [CreateEvaluacionDto.id_evaluacion, CreateEvaluacionDto.id_estudiante],
    );

    // Llamada a la consulta SELECT por separado
    const salida = await this.evaluacionRepository.query(
      'SELECT @id_envio_evaluacion as id_envio_evaluacion',
    );
    if (salida && Array.isArray(salida)) {
      const salidasMapeadas = salida.map((salida: any) => ({
        id_envio_evaluacion: salida.id_envio_evaluacion,
      }));
      for (const salida of salidasMapeadas) {
        if (salida.id_envio_evaluacion == null) {
          throw new BadRequestException(
            ' No se encontro el Id de envio de la evaluacion',
          );
        } else {
          return salidasMapeadas;
        }
      }
    } else {
      return [];
    }

    // } catch (error) {
    //   console.error('Error al registrar evaluación:', error);
    //   throw new Error('Error al registrar evaluación ' + error.message);
    // }
  }

  async registrarRespuesta(registrarRespuestaDto: RegistrarRespuestaDto) {
    try {
      const registrarRespuesta = await this.evaluacionRepository.query(
        'CALL sp_registrar_respuesta_evaluacion(?,?,?,?)',
        [
          registrarRespuestaDto.id_detalle_evaluacion,
          registrarRespuestaDto.id_evaluacion,
          registrarRespuestaDto.id_pregunta,
          registrarRespuestaDto.id_alternativa,
        ],
      );
      return { mensaje: 'Registrado Correctamente' };
    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar Respuesta ' + error.message);
    }
  }
  
  async cambiarEstadoEvaluacion(
    id_entrega_evaluacion: number,
    updateEstado: UpdateEstadoDto,
  ) {
    try {
      const estado = await this.evaluacionRepository.query(
        'CALL sp_cambiar_estado_evaluacion(?,?)',
        [id_entrega_evaluacion, updateEstado.estado_evaluacion],
      );
      return { mensaje: ' Se actualizo el estado' };
    } catch (error) {}
  }
}
