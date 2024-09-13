import { DataHistorialCompra } from './dto/data-historial-compra.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HistorialCompra } from './entities/historial-compra.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistorialCompraService {
  constructor(
    @InjectRepository(HistorialCompra)
    private historialcompraRepository: Repository<HistorialCompra>,
  ) {}

  // async verhistorialcompra(institucion: string, dataHistorialCompra: DataHistorialCompra) {
  //   try {
  //     const [isInstitucion] = await this.historialcompraRepository.query(
  //       'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
  //       [institucion],
  //     );

  //     if (isInstitucion) {
  //       const historiales = await this.historialcompraRepository.query(
  //         'Call sp_historial_de_compra(?,?,?)',
  //         [institucion, dataHistorialCompra],
  //       );
  //       if (historiales[0] && Array.isArray(historiales[0])) {
  //         const historialMapeados = historiales[0].map((historial: any) => ({
  //           id: historial.compra_id,
  //           compra_precio_total: historial.compra_precio_total,
  //           compra_tipo_moneda: historial.compra_tipo_moneda,
  //           compra_fecha_pago: historial.compra_fecha_pago,
  //           compra_precio_final_soles: historial.compra_precio_final_soles,
  //           compra_precio_final_dolares: historial.compra_precio_final_dolares,
  //           cupon_id: historial.cupon_id,
  //           cupon_monto_porcentaje: historial.cupon_monto_porcentaje,
  //         }));

  //         return historialMapeados;
  //       } else {
  //         return [];
  //       }
  //     } else {
  //       throw new BadRequestException('No existe la institucion ingresada');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al mostrar historial de compras ' + error.message);
  //   }
  // }

  async detalleCompra(
    institucion: string,
    dataHistorialCompra: DataHistorialCompra,
  ) {
    try {
      const [isInstitucion] = await this.historialcompraRepository.query(
        'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
        [institucion],
      );

      if (isInstitucion) {
        const historiales = await this.historialcompraRepository.query(
          'Call sp_historial_de_compra(?,?,?)',
          [
            institucion,
            dataHistorialCompra.id_estudiante,
            dataHistorialCompra.id_compra,
          ],
        );
        if (historiales[0] && Array.isArray(historiales[0])) {
          const historialMapeados = historiales[0].map((historial: any) => ({
            id_compra: historial.compra_id,
            compra_precio_total: historial.compra_precio_total,
            compra_tipo_moneda: historial.compra_tipo_moneda,
            compra_fecha_pago: historial.compra_fecha_pago,
            compra_precio_final_soles: historial.compra_precio_final_soles,
            compra_precio_final_dolares: historial.compra_precio_final_dolares,
            cupon_id: historial.cupon_id,
            cupon_monto_porcentaje: historial.cupon_monto_porcentaje,
            historial_curso: [],
            historial_especializacion: [],
            historial_promocion: [],
            historial_plan: [],
            historial_certificado: [],
            historial_reprogramacion:[]
          }));

          for (const historial of historialMapeados) {
            const historialcurso = await this.recibocompraCurso(
              historial.id_compra,
            );
            if (Array.isArray(historialcurso[0])) {
              historial.historial_curso = historialcurso[0].map(
                (historialcurso: any) => ({
                  id_compra: historialcurso.compra_id,
                  detalleventa_costo_soles:
                    historialcurso.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                    historialcurso.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                    historialcurso.cupon_monto_descuento_soles,
                  cupon_monto_descuento_dolares:
                    historialcurso.cupon_monto_descuento_dolares,
                  miscupones_id: historialcurso.miscupones_id,
                  cupon_monto_porcentaje: historialcurso.cupon_monto_porcentaje,
                  curso_nombre: historialcurso.curso_nombre,
                  tipo_servicio: historialcurso.tipo_servicio,
                }),
              );
            }
            const historialpaquetes = await this.recibocompraEspecializacion(
              historial.id_compra,
            );
            if (Array.isArray(historialpaquetes[0])) {
              historial.historial_especializacion = historialpaquetes[0].map(
                (historialpaquetes: any) => ({
                  id_compra: historialpaquetes.compra_id,
                  detalleventa_costo_soles:
                    historialpaquetes.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                    historialpaquetes.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                    historialpaquetes.cupon_monto_descuento_soles,
                  paquete_nombre: historialpaquetes.paquete_nombre,
                  cupon_monto_descuento_dolares:
                    historialpaquetes.cupon_monto_descuento_dolares,
                  miscupones_id: historialpaquetes.miscupones_id,
                  cupon_monto_porcentaje:
                    historialpaquetes.cupon_monto_porcentaje,
                  tipo_servicio: historialpaquetes.tipo_servicio,
                }),
              );
            }
            const historialpromociones = await this.recibocompraPromocion(
              historial.id_compra,
            );
            if (Array.isArray(historialpromociones[0])) {
              historial.historial_promocion = historialpromociones[0].map(
                (historialpromociones: any) => ({
                  id_compra: historialpromociones.compra_id,
                  detalleventa_costo_soles:
                    historialpromociones.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                    historialpromociones.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                    historialpromociones.cupon_monto_descuento_soles,
                  paquete_nombre: historialpromociones.paquete_nombre,
                  cupon_monto_descuento_dolares:
                    historialpromociones.cupon_monto_descuento_dolares,
                  miscupones_id: historialpromociones.miscupones_id,
                  cupon_monto_porcentaje:
                    historialpromociones.cupon_monto_porcentaje,
                  tipo_servicio: historialpromociones.tipo_servicio,
                }),
              );
            }

            const historialplanes = await this.recibocompraPlan(
              historial.id_compra,
            );
            if (Array.isArray(historialplanes[0])) {
              historial.historial_plan = historialplanes[0].map(
                (historialplanes: any) => ({
                  id_compra: historialplanes.compra_id,
                  detalleventa_costo_soles:
                    historialplanes.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                    historialplanes.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                    historialplanes.cupon_monto_descuento_soles,
                  plan_nombre: historialplanes.plan_nombre,
                  cupon_monto_descuento_dolares:
                    historialplanes.cupon_monto_descuento_dolares,
                  miscupones_id: historialplanes.miscupones_id,
                  cupon_monto_porcentaje:
                    historialplanes.cupon_monto_porcentaje,
                  tipo_servicio: historialplanes.tipo_servicio,
                }),
              );
            }
            const historialcertificados = await this.recibocompraCertificado(
              historial.id_compra,
            );
            if (Array.isArray(historialcertificados[0])) {
              historial.historial_certificado = historialcertificados[0].map(
                (historialcertificados: any) => ({
                  id_compra: historialcertificados.compra_id,
                  detalleventa_costo_soles:
                    historialcertificados.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                    historialcertificados.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                    historialcertificados.cupon_monto_descuento_soles,
                  nombre_servicio: historialcertificados.nombre_servicio,
                  tipocert_nombre: historialcertificados.tipocert_nombre,
                  cupon_monto_descuento_dolares:
                    historialcertificados.upon_monto_descuento_dolares,
                  miscupones_id: historialcertificados.miscupones_id,
                  cupon_monto_porcentaje:
                    historialcertificados.cupon_monto_porcentaje,
                  tipo_servicio: historialcertificados.tipo_servicio,
                }),
              );
            }

            const historialReporgramacion = await this.reciboReprogramacion(
              historial.id_compra,
            )
            if (Array.isArray(historialcertificados[0])) {
              historial.historial_reprogramacion = historialReporgramacion[0].map(
                (reprogramacion: any) => ({
                  id_compra: reprogramacion.compra_id,
                  detalleventa_costo_soles:
                  reprogramacion.detalleventa_costo_soles,
                  detalleventa_costo_dolares:
                  reprogramacion.detalleventa_costo_dolares,
                  cupon_monto_descuento_soles:
                  reprogramacion.cupon_monto_descuento_soles,
                  cupon_monto_descuento_dolares: reprogramacion.cupon_monto_descuento_dolares,
                  miscupones_id: reprogramacion.miscupones_id,
                  cupon_monto_porcentaje:
                  reprogramacion.cupon_monto_porcentaje,
                  nombre_servicio: reprogramacion.nombre_servicio,
                  tipo_servicio:
                  reprogramacion.tipo_servicio
                }),
              );
            }
          }
          return historialMapeados;
        } else {
          return [];
        }
      } else {
        throw new BadRequestException('No existe la institucion ingresada');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar historial de compras ' + error.message);
    }
  }

  async recibocompraCurso(idHistorial: number) {
    try {
      const query = 'call sp_detalle_historial_compra_curso(?)';
      const recibocompracurso = await this.historialcompraRepository.query(
        query,
        [idHistorial],
      );
      return recibocompracurso;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de compra curso en el recibo: ' +
          error.message,
      );
    }
  }
  async reciboReprogramacion(idHistorial: number) {
    try {
      const query = 'call sp_detalle_historial_compra_reprogramacion(?)';
      const reciboCompraReprogramacion = await this.historialcompraRepository.query(
        query,
        [idHistorial],
      );
      return reciboCompraReprogramacion;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de compra curso en el recibo: ' +
          error.message,
      );
    }
  }

  async recibocompraEspecializacion(idHistorial: number) {
    try {
      const query = `call sp_detalle_historial_compra_especializacion(?)`;
      const recibocompraespecializacion =
        await this.historialcompraRepository.query(query, [idHistorial]);
      return recibocompraespecializacion;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener el detalle de compra especializacion en el recibo: ' +
          error.message,
      );
    }
  }

  async recibocompraPromocion(idHistorial: number) {
    try {
      const query = `call sp_detalle_historial_compra_promocion(?)`;
      const recibocomprapromocion = await this.historialcompraRepository.query(
        query,
        [idHistorial],
      );
      return recibocomprapromocion;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de compra promocion en el recibo: ' +
          error.message,
      );
    }
  }

  async recibocompraPlan(idHistorial: number) {
    try {
      const query = `call sp_detalle_historial_compra_plan(?)`;
      const recibocomprapromocion = await this.historialcompraRepository.query(
        query,
        [idHistorial],
      );

      return recibocomprapromocion;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de compra promocion en el recibo: ' +
          error.message,
      );
    }
  }

  async recibocompraCertificado(idHistorial: number) {
    try {
      const query = `call sp_detalle_historial_compra_certificado(?)`;
      const recibocomprapromocion = await this.historialcompraRepository.query(
        query,
        [idHistorial],
      );
      return recibocomprapromocion;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de compra promocion en el recibo: ' +
          error.message,
      );
    }
  }
}
