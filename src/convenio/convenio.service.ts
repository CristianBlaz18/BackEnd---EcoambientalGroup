import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convenio } from './entities/convenio.entity';

@Injectable()
export class ConvenioService {
  constructor(
    @InjectRepository(Convenio)
    private convenioRepository: Repository<Convenio>,
  ) {}
  async mostrarConvenios(institucion: string) {
    try {
      const [convenios] = await this.convenioRepository.query(
        `CALL sp_listar_convenios_institucion(?)`,
        [institucion],
      );
      return convenios;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar convenios: ' + error.message)
    }
    
  }
}
