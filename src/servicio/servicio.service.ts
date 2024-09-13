import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { Repository } from 'typeorm';
import { ServicioDetalle } from './entities/serviciodetalle.entity';
import { FiltrarServicioDTO } from './dto/filtrar-servicio.dto';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
    @InjectRepository(ServicioDetalle)
    private serviciodetalleRepository: Repository<ServicioDetalle>,
  ) {}

  async filtrarservicios(
    institucion: string,
    filtrarServicioDto: FiltrarServicioDTO,
  ) {
    try {
      const [servicios] = await this.servicioRepository.query(
        'Call sp_filtrar_capacitacion(?,?,?)',
        [institucion, filtrarServicioDto.nombre, filtrarServicioDto.orden],
      );
      return servicios;
    } catch (error) {
      console.log(error);
      throw new Error('Error al filtrar servicios ' + error.message);
    }
  }

  async getDetalleCapacitacion(institucion: string, idCapacitacion: number) {
    try {
      const capacitacion = await this.serviciodetalleRepository.query(
        'CALL sp_filtrar_detalle_capacitacion(?,?)',
        [institucion, idCapacitacion],
      );
      if (capacitacion[0] && Array.isArray(capacitacion[0])) {
        const mappedCapacitacion = capacitacion[0].map(
          (capacitacionDet: any) => ({
            capacitacion_nombre: capacitacionDet.capacitacion_nombre,
            capacitacion_imagen: capacitacionDet.capacitacion_imagen,
            capacitacion_descripcion: capacitacionDet.capacitacion_descripcion,
            cursos_externos: [],
          }),
        );

        for (const capacitacion of mappedCapacitacion) {
          const servicios = await this.getCapacitacionCurEx(idCapacitacion);

          if (Array.isArray(servicios[0])) {
            capacitacion.cursos_externos = servicios[0].map((externo: any) => ({
              cursos_externos_id: externo.cursos_externo_id,
              curso_externo_nombre: externo.curso_externo_nombre,
            }));
          }
        }
        return mappedCapacitacion[0];
      } else {
        return { message: 'No hay datos' };
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener los detalles de la capacitacion ' + error.message,
      );
    }
  }
  
  async getCapacitacionCurEx(idCapacitacion: number) {
    try {
      const cursos = await this.servicioRepository.query(
        'CALL sp_listar_cursos_externos_capacitacion(?)',
        [idCapacitacion],
      );
      return cursos;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener los temas de la capacitacion');
    }
  }

  async getMasCapacitaciones(
    institucion: string,
    estadoCapacitacion: number,
  ): Promise<Servicio[]> {
    try {
      const [servicioCap] = await this.servicioRepository.query(
        'CALL sp_listar_mas_servicios(?,?)',
        [institucion, estadoCapacitacion],
      );
      return servicioCap;
    } catch (error) {
      console.log(error);
      throw new Error('error al obtener mas capacitaciones ' + error.message);
    }
  }
}
