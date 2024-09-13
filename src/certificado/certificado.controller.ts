import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CertificadoDto } from './dto/certificado.dto';
import { CertificadoPagadoDto } from './dto/certificadopagados.dto';
import { DescargaCertificadoDto } from './dto/descarga-certificado.dto';
import { SolicitarEnvioCertificado } from './dto/solicitar-envio-certificado.dto';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { ListarCertificadoAdquirirDto } from './dto/listar-certificado-adquirir.dto';
import { VisualizarDescargaCertificado } from './dto/visualizar-descarga-certificado.dto';
import { ListarEnvioCertificadoDto } from './dto/listar-envio-certificado.dto';
import { ObtenerCertificadoPagado } from './dto/obtener-certificado-pagado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@ApiTags('Certificado')
@Controller('certificado')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  // @Get('disponibles/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Lista los certificados disponibles',
  //   description:
  //     'Mediante cuatro parametros:{"institucion: string", "idContenido":"string", "id_contenido":"string"(id del curso o especializacion), "tipo_servicio":"string"(Curso o Especializacion). SP: sp_listar_certificados_disponibles(?,?,?,?)',
  // })
  // certificadoDisponible(
  //   @Param('institucion') institucion: string,
  //   @Query() certificadoDto: CertificadoDto,
  // ) {
  //   return this.certificadoService.certificadosDisponibles(
  //     institucion,
  //     certificadoDto,
  //   );
  // }

  @Get('pagados/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Lista los certificados de cursos o paquetes pagados',
    description:
      'Mediante cuatro parametros:{"institucion":"string", "idContenido":"string", "idEstudiante":"string", "tipoContenido":"string"(Curso o Especializacion),"idCertificado":"string". SP: sp_obtener_certificado_cpagado(?,?,?,?,?)',
  })
  certificadosPagados(
    @Param('institucion') institucion: string,
    @Query() certificadoPagadoDto: CertificadoPagadoDto,
  ) {
    return this.certificadoService.certificadosPagados(
      institucion,
      certificadoPagadoDto,
    );
  }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Buscar certificado',
    description:
      'Esta api permite validar un certificado ingresando el codigo del mismo y mostrando los datos del mismo mediante dos parametros:{"codigoCertificado":"string","institucion":"string(nombre de la institucion)"}. SP: sp_validar_certificado(?,?)',
  })
  detalleCertificado(
    @Param('institucion') institucion: string,
    @Query('codigoCertificado') codigoCertificado: string,
  ) {
    return this.certificadoService.getDetalleCertificado(
      codigoCertificado,
      institucion,
    );
  }

  // @Get('descarga/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Visualizar datos para descargar certificado',
  //   description:
  //     'Mediante dos parametros:{"institucion":"string(nombre de la institución)","idCertificadoPropio":"number"}. SP: sp_visualizar_descargar_certificado(?,?)',
  // })
  // descargaCertificado(
  //   @Param('institucion') institucion: string,
  //   @Query() descargaCertificadoDto: DescargaCertificadoDto,
  // ) {
  //   return this.certificadoService.datosDescarga(
  //     institucion,
  //     descargaCertificadoDto,
  //   );
  // }

  @Post('envio/:id_certificadopropio')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Solicitar envio certificado',
    description:
      'Esta api permite registrar la solicitud de envio de certificado mediante el parametro{"id_estudiante":"number"} y query: {"id_certificado": "number", "certificadopropio_codigo": "string", "departamento": "string", "provincia": "string", "distrito":"string", "direccion": "string", "referencia": "string"}. SP: sp_solicitar_envio_certificado(?,?,?,?,?,?)',
  })
  enviocertificado(
    @Param('id_certificadopropio') id_certificadopropio: number,
    @Body() solicitarEnvioCertificado: SolicitarEnvioCertificado,
  ) {
    return this.certificadoService.envioCertificado(
      id_certificadopropio,
      solicitarEnvioCertificado,
    );
  }

  @Get('adquirir/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar certificado por adquirir',
    description:
      'Esta api permite listar certificados por adquirir(por curso y especializacion) mediante el parametro{"institucion":"string"} y query: {"id_estudiante": "string", "tipo_contenido": "number"}. SP: sp_listar_servicio_certificados_por_comprar(?,?,?) y sp_listar_certificados_disponibles() ',
  })
  certificadoadquirir(
    @Param('institucion') institucion: string,
    @Query() listarCertificadoAdquirirDto: ListarCertificadoAdquirirDto,
  ) {
    return this.certificadoService.certificadoAdquirir(
      institucion,
      listarCertificadoAdquirirDto,
    );
  }

  @Get('adquirido/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar certificado adquirido',
    description:
      'Esta api permite listar certificados por adquirir(por curso y especializacion) mediante el parametro{"institucion":"string"} y query: {"id_estudiante": "string", "tipo_contenido": "number"}. SP: sp_listar_servicio_certificados_adquiridos(?,?,?) y sp_listar_certificados_disponibles() ',
  })
  certificadoadquirirido(
    @Param('institucion') institucion: string,
    @Query() listarCertificadoAdquirirDto: ListarCertificadoAdquirirDto,
  ) {
    return this.certificadoService.certificadoAdquirido(
      institucion,
      listarCertificadoAdquirirDto,
    );
  }

  @Get('visualizar/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Visualizar descargar certificado',
    description:
      'Mediante el parametro:{"institucion":"string(nombre de la institución)", y dos querys"idCertificado":"number", "idEstudiante": "number", y un "OUT mensaje"}. SP: sp_visualizar_descargar_certificado(?,?,?,@mensaje)',
  })
  visualizarDescargaCertificado(
    @Param('institucion') institucion: string,
    @Query() visualizarDescargaCertificado: VisualizarDescargaCertificado,
  ) {
    return this.certificadoService.visualizarDescargaCertificado(
      institucion,
      visualizarDescargaCertificado,
    );
  }

  @Get('listar-envio/:')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar envio de certificado',
    description:
      'Esta api permite listar la solicitud de envio de certificado en fisico mediante el query:{"id_estudiante":"number", "id_certificado":"number", "id_certificadopropio": "number"}. SP: sp_listar_envio_certificado(?,?)',
  })
  listarenviocertificado(
    @Query() listarEnvioCertificadoDto: ListarEnvioCertificadoDto,
  ) {
    return this.certificadoService.listarEnvioCertificado(
      listarEnvioCertificadoDto,
    );
  }
  /*@Post('obtener/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Obtener certificados pagados',
    description:
      'Mediante el parametro:{"institucion":"string(nombre de la institución)", y 4 querys"idServicio":"number", "idEstudiante": "number", "tipo":"string" "idcCertificado":"Number" y "@mensaje". SP: sp_obtener_certificado_cpagado(?,?,?.?,?, @mensaje)',
  })
  obtenerPagado(
    @Param('institucion') institucion:string,
    @Body() obtenerCertificadoPagado : ObtenerCertificadoPagado,
  ){
    return this.certificadoService.obtenerPagado(institucion, obtenerCertificadoPagado)
  }*/
  @Get('download/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Descargar certificado',
    description:
      'Mediante el parametro:{"institucion":"string(nombre de la institución)", y dos querys"idCertificado":"number", "idEstudiante": "number", y un "OUT mensaje"}. SP: sp_visualizar_descargar_certificado(?,?.?,@mensaje)',
  })
  async downloadPDF(
    @Res() res,
    @Param('institucion') institucion: string,
    @Query('idCertificado') idCertificado: number,
    @Query('idEstudiante') idEstudiante: number,
  ): Promise<void> {
    const buffer = await this.certificadoService.generarPDFURL(
      institucion,
      idCertificado,
      idEstudiante,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificado.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
  
  @Patch('DeseoCertificado')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Actualizar deseo Certificado',
    description:
      'Esta api permite actualizar si desea el certificado con los parametros {idEstudiante:number,idCurso:number,respuesta:number} en el SP : sp_registrar_deseo_certificado(?,?,?)',
  })
  cancelarPlan(
    @Body() certificadoUpdate: UpdateCertificadoDto
  ) {
    try {
      return this.certificadoService.actualizarDeseoCertificado(certificadoUpdate);
    } catch (error) {
      console.log(error);
      throw new Error('Error al actualizar - ' + error.message);
    }
    
  }

}
