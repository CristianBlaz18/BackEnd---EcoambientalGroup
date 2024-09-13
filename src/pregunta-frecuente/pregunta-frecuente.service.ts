import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PreguntaFrecuente } from './entities/pregunta-frecuente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PreguntaFrecuenteService {
  constructor(
    @InjectRepository(PreguntaFrecuente)
    private preguntaFrecuenteRepository: Repository<PreguntaFrecuente>,
  ) {}

  async preguntasfrecuentes(institucion: string) {
    try {
      const [preguntas] = await this.preguntaFrecuenteRepository.query(
        `Call sp_listar_preguntas_frecuentes_institucion(?)`,
        [institucion],
      );
      return preguntas;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar preguntas frecuentes ' + error.message);
    }
  }
}
