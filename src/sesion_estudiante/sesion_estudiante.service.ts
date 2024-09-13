import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SesionEstudiante } from './entities/sesion_estudiante.entity';
import { Repository } from 'typeorm';
import { SesionEstudianteDto } from './dto/sesion-estudiante.dto';

@Injectable()
export class SesionEstudianteService {
  constructor(
    @InjectRepository(SesionEstudiante)
    private readonly sesionEstudianteRepository: Repository<SesionEstudiante>,
  ) {}

  async sesionEstudiante(
    nombre_institucion: string,
    sesionEstudianteDto: SesionEstudianteDto,
  ) {
    const [isInstitucion] = await this.sesionEstudianteRepository.query(
      'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
      [nombre_institucion],
    );
    try {
      if (isInstitucion) {
        await this.sesionEstudianteRepository.query(
          'call sp_insertar_sesion_estudiante(?,?)',
          [sesionEstudianteDto.id_estudiante, sesionEstudianteDto.id_sesion],
        );
      } else {
        throw new BadRequestException('No existe la institucion ingresada');
      }
      return { message: 'Registro Exitoso' };
    } catch (error) {
      throw new BadRequestException('No existe la institucion ingresada');
    }
  }
}
