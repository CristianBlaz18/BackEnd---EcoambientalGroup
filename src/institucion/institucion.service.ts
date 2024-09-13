import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Institucion } from './entities/institucion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionService {
  constructor(
    @InjectRepository(Institucion)
    private institucionRepository: Repository<Institucion>,
  ) {}

  async inicio() {
    try {
      const [empresas] = await this.institucionRepository.query(
        'Call sp_listar_area_academica()',
      );
      return empresas;
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al llamar a todas las instituciones ' + error.message,
      );
    }
  }
  async getInfoEmpresa(institucion: string): Promise<Institucion[]> {
    try {
      const [infEmpresa] = await this.institucionRepository.query(
        'CALL sp_visualizar_info_empresa(?)',
        [institucion],
      );
      return infEmpresa;
    } catch (error) {
      console.log(error);
      throw new Error('error al mostrar una institucion ' + error.message);
    }
  }
}
