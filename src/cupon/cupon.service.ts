import { Cupon } from './entities/cupon.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivarCuponDto } from './dto/activar-cupon.dto';

@Injectable()
export class CuponService {
  constructor(
    @InjectRepository(Cupon) private cuponRepository: Repository<Cupon>,
  ) {}

  async listarCupones(idEstudiante: number, institucion: string) {
    try {
      const [cupon] = await this.cuponRepository.query(
        `Call sp_listar_mis_cupones(?,?)`,
        [idEstudiante, institucion],
      );
      return cupon;
    } catch (error) {
      console.log(error);
      throw new Error('Error al listar los cupones: ' + error.message);
    }
  }

  async cuponesAplicables(idEstudiante: number) {
    try {
      const aplicablescupon = await this.cuponRepository.query(
        'Call sp_listar_cupones_activos(?)',
        [idEstudiante],
      );
      return aplicablescupon[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'error al listar los cupones aplicables(activos): ' + error.message,
      );
    }
  }

  async registrarCupon(activarCuponDto: ActivarCuponDto) {
    await this.cuponRepository.query(
      'Call sp_registrar_miscupones(?,?,?,@mensaje)',
      [
        activarCuponDto.codigoCupon,
        activarCuponDto.idEstudiante,
        activarCuponDto.institucion,
      ],
    );
    try {
      const [resultado] = await this.cuponRepository.query(
        'SELECT @mensaje AS mensaje',
      );
      // return resultado.mensaje;
      // switch (resultado.mensaje) {
      //   case 1:
      //     return { mensaje: "Cupon Registrado" };
      //   case 2:
      //     throw new BadRequestException('Error, el cupón ya está asignado a este estudiante');
      //   case 3:
      //     throw new BadRequestException('Error, el cupón ha expirado');
      //   case 4:
      //     throw new BadRequestException('Error, el cupón no existe');
      //   default:
      //     throw new BadRequestException('Error desconocido');
      // }

      if (resultado.mensaje == 1) {
        return { mensaje: 'Cupon Registrado' };
      } else {
        if (resultado.mensaje == 2) {
          throw new BadRequestException(
            'Error, el cupón ya está asignado a este estudiante',
          );
        } else {
          if (resultado.mensaje == 3) {
            throw new BadRequestException('Error, el cupón ha expirado');
          } else {
            if (resultado.mensaje == 4) {
              throw new BadRequestException('Error, el cupón no existe');
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
