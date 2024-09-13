import { Injectable } from '@nestjs/common';
import { CreateForoDto } from './dto/create-foro.dto';
import { Foro } from './entities/foro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePreguntaDto } from './dto/create_pregunta.dto';
import { RegistrarLikeDto } from './dto/registrar-like-foro.dto';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';

@Injectable()
export class ForoService {
  constructor(
    @InjectRepository(Foro)
    private foroRepository: Repository<Foro>,
  ) {}

  async foro(institucion: string, idCurso: number, idUsuario: number) {
    try {
      const preguntas = await this.foroRepository.query(
        'CALL sp_listar_foro_curso(?,?)',
        [institucion, idCurso],
      );

      if (preguntas[0] && Array.isArray(preguntas[0])) {
        const preguntaforo = await Promise.all(
          preguntas[0].map(async (pregunta: any) => {
            const respuestas = await this.respuestasForo(
              pregunta.pregunta_foro_id,
            );
            const preguntaEstado = await this.listarEstadoLike(
              idUsuario,
              pregunta.pregunta_foro_id,
              1,
            );
            const respuestasEstado = await Promise.all(
              respuestas[0].map(async (respuesta: any) => {
                return {
                  id_respuesta: respuesta.foro_respuesta_id,
                  ForoId: respuesta.foro_id,
                  AutorId: respuesta.usuario_id,
                  RespuestaRegistro: respuesta.foro_respuesta_fecha_registro,
                  Nombre: respuesta.foro_respuesta_autor,
                  Imagen: respuesta.usuario_imagen,
                  Respuesta: respuesta.foro_respuesta_descripcion,
                  CantidadLikes: respuesta.foro_respuesta_like,
                  EstadoRespuesta:
                    (
                      await this.listarEstadoLike(
                        idUsuario,
                        respuesta.foro_respuesta_id,
                        0,
                      )
                    )[0]?.usuariolike_like || 0,
                };
              }),
            );

            return {
              pregunta_foro_id: pregunta.pregunta_foro_id,
              ForoId: pregunta.foro_id,
              AutorId: pregunta.usuario_id,
              PreguntaRegistro: pregunta.pregunta_foro_fecha_registro,
              Autor: pregunta.pregunta_foro_autor,
              Imagen: pregunta.usuario_imagen,
              Pregunta: pregunta.pregunta_foro_descripcion,
              CantidadRespuestas: respuestas[0].length,
              EstadoPregunta: preguntaEstado[0]?.usuariolike_like || 0,
              CantidadLikes: pregunta.pregunta_foro_like,
              Respuestas: respuestasEstado,
            };
          }),
        );

        return preguntaforo;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(
        'Error al mostrar el foro de un curso matriculado' + error.message,
      );
    }
  }

  //Respuestas del foro
  async respuestasForo(idForoPregunta: number) {
    try {
      const respuesta = await this.foroRepository.query(
        'CALL sp_listar_foro_respuestas(?)',
        [idForoPregunta],
      );
      return respuesta;
    } catch (error) {
      throw new Error('Error al mostrar resuestas' + error.message);
    }
  }

  async registrarLike(registrarLikeDto: RegistrarLikeDto) {
    try {
      await this.foroRepository.query(
        'CALL sp_registrar_like_foro(?, ?, ?, @new_like, @like_add)',
        [
          registrarLikeDto.idPregunta,
          registrarLikeDto.tipoPor,
          registrarLikeDto.idUsuario,
        ],
      );

      const [newLikeResult] = await this.foroRepository.query(
        'SELECT @new_like as new_like, @like_add as like_add',
      );

      return {
        mensaje: 'Se cambió el estado',
        like: {
          Estado: newLikeResult.new_like,
          Cantidad: newLikeResult.like_add,
        },
      };
    } catch (error) {
      console.error('Error al registrar like en el foro', error);
      throw new Error('Error al registrar like en el foro');
    }
  }

  async enviara_pregunta(createPreguntaDto: CreatePreguntaDto) {
    try {
      const enviarPregunta = await this.foroRepository.query(
        'CALL sp_registrar_foro_preguntas(?,?,?)',
        [
          createPreguntaDto.idCurso,
          createPreguntaDto.idUsuario,
          createPreguntaDto.UsuarioPregunta,
        ],
      );

      if (enviarPregunta[0] && Array.isArray(enviarPregunta[0])) {
        const [preguntaConRespuestas] = await Promise.all(
          enviarPregunta[0].map(async (enviar: any) => {
            const respuestas = await this.respuestasForo(
              enviar.pregunta_foro_id,
            );
            const preguntaEstado = await this.listarEstadoLike(
              createPreguntaDto.idUsuario,
              enviar.pregunta_foro_id,
              1,
            );

            return {
              pregunta_foro_id: enviar.pregunta_foro_id,
              ForoId: enviar.foro_id,
              AutorId: enviar.usuario_id,
              PreguntaRegistro: enviar.pregunta_foro_fecha_registro,
              Autor: enviar.pregunta_foro_autor,
              Imagen: enviar.usuario_imagen,
              Pregunta: enviar.pregunta_foro_descripcion,
              CantidadRespuestas: respuestas[0].length,
              EstadoPregunta: preguntaEstado[0]?.usuariolike_like || 0,
              CantidadLikes: enviar.pregunta_foro_like,
              Respuestas: [],
            };
          }),
        );

        return {
          mensaje: 'Registrado Correctamente',
          Pregunta: [preguntaConRespuestas],
        };
      } else {
        return [];
      }
    } catch (error) {
      throw new Error('Error al registrar pregunta' + error.message);
    }
  }

  async registrarForoRespuesta(createRespuestaDto: CreateRespuestaDto) {
    try {
      const registrarRespuestas = await this.foroRepository.query(
        'CALL sp_registrar_foro_respuestas(?,?,?)',
        [
          createRespuestaDto.idPreguntaForo,
          createRespuestaDto.idUsuario,
          createRespuestaDto.UsuarioRespuesta,
        ],
      );

      const nuevaRespuesta = registrarRespuestas[0][0]; // Supongo que la respuesta se encuentra en el primer elemento del primer conjunto de resultados

      const respuestaEstado = await this.listarEstadoLike(
        createRespuestaDto.idUsuario,
        nuevaRespuesta.foro_respuesta_id,
        0,
      );

      const registrarRespuesta = {
        id_respuesta: nuevaRespuesta.foro_respuesta_id,
        ForoId: nuevaRespuesta.foro_id,
        AutorId: nuevaRespuesta.usuario_id,
        RespuestaRegistro: nuevaRespuesta.foro_respuesta_fecha_registro,
        Nombre: nuevaRespuesta.foro_respuesta_autor,
        Imagen: nuevaRespuesta.usuario_imagen,
        Respuesta: nuevaRespuesta.foro_respuesta_descripcion,
        CantidadLikes: nuevaRespuesta.foro_respuesta_like,
        EstadoRespuesta: respuestaEstado[0]
          ? respuestaEstado[0].usuariolike_like
          : 0,
      };

      return {
        mensaje: 'Respuesta registrada Correctamente',
        Respuesta: [registrarRespuesta],
      };
    } catch (error) {
      throw new Error(
        'Error al registrar respuesta en el foro: ' + error.message,
      );
    }
  }

  async listarEstadoLike(
    idUsuario: number,
    idPregunta_Respuesta: number,
    tipo: number,
  ) {
    try {
      const [listarEstado] = await this.foroRepository.query(
        'CALL sp_listar_likes_foro(?,?,?)',
        [idUsuario, idPregunta_Respuesta, tipo],
      );
      return listarEstado;
    } catch (error) {
      throw new Error('Error al listar Estado like' + error.message);
    }
  }

  async actualizarforo(
    idUsuario: number,
    idPreguntaRespuesta: number,
    tipo: number,
  ) {
    try {
      const result = await this.foroRepository.query(
        'CALL sp_eliminar_foro_por(?,?,?,@estado)',
        [idUsuario, idPreguntaRespuesta, tipo],
      );
      const actualizarForo = Array.isArray(result) ? result[0] : result;

      const [traerestado] = await this.foroRepository.query(
        'SELECT @estado as estado',
      );

      return traerestado;
    } catch (error) {
      // Agregar información adicional al error
      console.error('Error al actualizar estado:', error);

      throw new Error('Error al actualizar estado');
    }
  }
}
