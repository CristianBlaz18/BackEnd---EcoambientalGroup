import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CompraCertificadoService } from './compra-certificado.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObtenerCertificadoComprado } from './dto/obtener-certificado-comprado.dto';
import { CertificadoCompradoServicio } from './dto/certificado-comprado-servicio.dto';

@ApiTags('Compra Certificado')
@Controller('compra-certificado')
export class CompraCertificadoController {
  constructor(
    private readonly compraCertificadoService: CompraCertificadoService,
  ) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Obtener certificados comprados',
    description:
      'Esta api permite obtener certificados comprados mediante el paramentro:{ "nombre_institucion":"string"} y query: {"id_servicio:number", "id_estudiante":"number", "tipo_servicio":"string", "id_certificado":"number"}. SP: sp_obtener_certificado_cpagado(?,?,?,?,?)',
  })
  obtenercertificadocomprados(
    @Param('institucion') institucion: string,
    @Query() obtenerCertificadoComprado: ObtenerCertificadoComprado,
  ) {
    return this.compraCertificadoService.obtenerCertificadoComprados(
      institucion,
      obtenerCertificadoComprado,
    );
  }

  @Post(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Comprar certificado servicio',
    description:
      'Esta api permite comprar certificados servicio mediante el paramentro:{ "nombre_institucion":"string"} y query: {"id_estudiante:number", "id_compra":"number", "id_certificado":"number"}. SP: sp_comprar_certificado_servicio(?,?,?,?,@ad)',
  })
  comprarcertificadoservicio(
    @Param('institucion') nombre_institucion: string,
    @Body() certifcadoCompradoServicio: CertificadoCompradoServicio,
  ) {
    return this.compraCertificadoService.comprarcertificadoServicio(
      nombre_institucion,
      certifcadoCompradoServicio,
    );
  }

  // @Post('gratuito')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Comprar certificado de un curso gratuito',
  //   description:
  //     'Esta api permite registrar una compra por un certificado de un curso gratuito mediante el array:{"id_estudiante":"number","id_detalleventa":"string","id_curso":"number", "matricula_estado":"number(en proceso=0,culminado=1)", "id_tipo_certificado":"number","pais_estudiante":"string(Argentina, Bolivia, Brasil, Chile, Colombia, Ecuador, Guyana, Perú, Surinam, Uruguay, Venezuela, Bahamas, Barbados, Canadá, Costa Rica, Cuba, Dominica, Granda, Jamaica, Estados Unidos, México, Panamá, República Dominicana, Trinida y Tobago)", "tiempo_de_acceso":"number","tipo_moneda";"string(USD, PEN, EUR)","impuesto_transaccion_sol":"number","impuesto_transaccion_dolar":"number","token_pasarela":"string","numero_transaccion":"string","id_servicio":"number","precio_actual_soles":"number","precio_actual_dolares":"number","tipo_servicio":"string(Curso, Especializacion, Promocion, Plan, Certificado, Ampliacion)"}. SP: sp_compra_certificado_cgratuito(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
  // })
  // cursocertificado(
  //   @Body() dataCertificadoGratuitoDto: DataCertificadoGratuitoDto,
  // ): Promise<{ message: string }> | { error: string; message: any } {
  //   try {
  //     return this.compraCertificadoService.certificadogratuito(
  //       dataCertificadoGratuitoDto,
  //     );
  //   } catch (error) {
  //     return {
  //       error: 'No se pudo oregistrar Certificado desde el controller',
  //       message: error.message,
  //     };
  //   }
  // }

  // @Post('pagado')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Comprar certificado de un curso pagado',
  //   description:
  //     'Esta api permite registrar una compra por un certificado de un curso pagado mediante el array:{ "matricula_estado":"number(en proceso=0,culminado=1)", "id_estudiante":"number","id_tipo_certificado":"number","id_matricula":"number","id_detalleventa":"string","impuesto_transaccion_sol":"number", "token_pasarela":"string","numero_transaccion":"string"}. SP: sp_generar_certificado_cpagado(?,?,?,?,?,?,?,?)',
  // })
  // cursocertificadogratuito(
  //   @Body() dataCertificadoPagadoDto: DataCertificadoPagadoDto,
  // ) {
  //   return this.compraCertificadoService.certificadopagado(
  //     dataCertificadoPagadoDto,
  //   );
  // }

  // @Post('paquete-pagado')
  // @ApiOperation({
  //   summary: 'Comprar certificado de una especializacion pagada',
  //   description:
  //     'Esta api permite registrar una compra por un certificado de una especializacion pagada mediante un array{"cursos_completados":"number(cantidad de cursos)", "id_estudiante":"number", "id_paquete":"number", "id_detalleventa":"number", "tipo_certificado_id":"number", "impuesto_transaccion_sol":"number", "token_pasarela":"string", "numero_transaccion":"string"}. SP: sp_generar_certificado_especializacion(?,?,?,?,?,?,?,?)',
  // })
  // comprarcertificadopqwuetepagado(
  //   @Body() dataCertificadoPaquetePagadoDto: DataCertificadoPaquetePagadoDto,
  // ) {
  //   return this.compraCertificadoService.certificadopaquetepagado(
  //     dataCertificadoPaquetePagadoDto,
  //   );
  // }
}
