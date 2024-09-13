import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Politica } from './entities/politica.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PoliticaService {
  constructor(
    @InjectRepository(Politica)
    private readonly politicaRepository: Repository<Politica>,
  ) {}

  async politicas(nombreInstitucion: string, nombrePolitica: string) {
    try {
      const query = `call sp_listar_politicas(?,?)`;
      const politica = await this.politicaRepository.query(query, [
        nombreInstitucion,
        nombrePolitica,
      ]);
      return politica[0];
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener datos de politicas ' + error.message);
    }
  }
}
