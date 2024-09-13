import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompraCertificado } from './entities/compra-certificado.entity';
import { Repository } from 'typeorm';
import { ObtenerCertificadoComprado } from './dto/obtener-certificado-comprado.dto';
import { CertificadoCompradoServicio } from './dto/certificado-comprado-servicio.dto';

@Injectable()
export class CompraCertificadoService {
  constructor(
    @InjectRepository(CompraCertificado)
    private readonly compraRepsoitory: Repository<CompraCertificado>,
  ) {}

  async obtenerCertificadoComprados(
    nombre_institucion: string,
    obtenerCetificadoComprado: ObtenerCertificadoComprado,
  ) {
    try {
      const query = `CALL sp_obtener_certificado_cpagado(?,?,?,?,?)`;
      const generarcertificadoC = await this.compraRepsoitory.query(query, [
        nombre_institucion,
        obtenerCetificadoComprado.id_servicio,
        obtenerCetificadoComprado.id_estudiante,
        obtenerCetificadoComprado.tipo_servicio,
        obtenerCetificadoComprado.id_certificado,
      ]);
      return generarcertificadoC[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener los datos de certificado comprado: ' + error.message,
      );
    }
  }

  async comprarcertificadoServicio(
    nombre_institucion: string,
    certificadoCompradoServicio: CertificadoCompradoServicio,
  ) {
    try {
      const [isInstitucion] = await this.compraRepsoitory.query(
        'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
        [nombre_institucion],
      );
      if (isInstitucion) {
        await this.compraRepsoitory.query(
          'Call sp_comprar_certificado_servicio(?,?,?,?,@ad)',
          [
            nombre_institucion,
            certificadoCompradoServicio.id_estudiante,
            certificadoCompradoServicio.id_compra,
            certificadoCompradoServicio.id_certificado,
          ],
        );
        const [result] = await this.compraRepsoitory.query(
          'SELECT @ad AS mensaje',
        );

        return {
          mensaje: result.mensaje,
        };
      } else {
        throw new BadRequestException('No existe la institucion ingresada');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al comprar certificado: ' + error);
    }
  }

  // async certificadogratuito(dataCertificadocipDto: DataCertificadoGratuitoDto){
  //   try {
  //     const query = `CALL sp_compra_certificado_cgratuito(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  //     await this.compraRepsoitory.query(query, [
  //       dataCertificadocipDto.id_estudiante,
  //       dataCertificadocipDto.id_detalleventa,
  //       dataCertificadocipDto.id_curso,
  //       dataCertificadocipDto.matricula_estado,
  //       dataCertificadocipDto.id_tipo_certificado,
  //       dataCertificadocipDto.pais_estudiante,
  //       dataCertificadocipDto.tiempo_de_acceso,
  //       dataCertificadocipDto.tipo_moneda,
  //       dataCertificadocipDto.impuesto_transaccion_sol,
  //       dataCertificadocipDto.impuesto_transaccion_dolar,
  //       dataCertificadocipDto.token_pasarela,
  //       dataCertificadocipDto.numero_transaccion,
  //       dataCertificadocipDto.id_servicio,
  //       dataCertificadocipDto.precio_actual_soles,
  //       dataCertificadocipDto.precio_actual_dolares,
  //       dataCertificadocipDto.tipo_servicio,
  //   ]);

  //   return {message:'se registro exitosamente la compra de certificado'};

  //   } catch (error) {
  //     throw new Error('Error al subir');
  //   }
  // }

  // async certificadopagado(dataCertificadoPagadoDto: DataCertificadoPagadoDto){
  //   try {
  //     const query = `CALL sp_generar_certificado_cpagado(?,?,?,?,?,?,?,?)`;
  //     await this.compraRepsoitory.query(query, [
  //       dataCertificadoPagadoDto.matricula_estado,
  //       dataCertificadoPagadoDto.id_estudiante,
  //       dataCertificadoPagadoDto.id_tipo_certificado,
  //       dataCertificadoPagadoDto.id_matricula,
  //       dataCertificadoPagadoDto.id_detalleventa,
  //       dataCertificadoPagadoDto.impuesto_transaccion_sol,
  //       dataCertificadoPagadoDto.token_pasarela,
  //       dataCertificadoPagadoDto.numero_transaccion
  //   ]);
  //     return {message: 'se registro exitasemnte la compra del certificado'}

  //   } catch (error) {
  //     throw new Error('Error al subir');
  //   }
  // }

  // async certificadopaquetepagado(dataCertificadoPaquetePagadoDto: DataCertificadoPaquetePagadoDto){
  //   try {
  //     const query = `CALL sp_generar_certificado_especializacion(?,?,?,?,?,?,?,?)`;
  //     await this.compraRepsoitory.query(query, [
  //       dataCertificadoPaquetePagadoDto.curso_completado,
  //       dataCertificadoPaquetePagadoDto.id_estudiante,
  //       dataCertificadoPaquetePagadoDto.id_paquete,
  //       dataCertificadoPaquetePagadoDto.id_detalleventa,
  //       dataCertificadoPaquetePagadoDto.id_tipo_certificado,
  //       dataCertificadoPaquetePagadoDto.impuesto_transaccion_sol,
  //       dataCertificadoPaquetePagadoDto.token_pasarela,
  //       dataCertificadoPaquetePagadoDto.numero_transaccion
  //   ]);
  //   return {message: 'se registro exitosamente la compra del certificado'}
  //   } catch (error) {
  //     throw new Error('Error al subir');
  //   }
  // }
}
