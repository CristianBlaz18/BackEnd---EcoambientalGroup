import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}
  async publicidad(tipo: string, institucion: string) {
    try {
      //Ejecutar el procedimiento para listar el banner
      const [banners] = await this.bannerRepository.query(
        `Call sp_listar_banner(?,?)`,
        [tipo, institucion],
      );
      return banners;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar publicidad');
    }
  }
}
