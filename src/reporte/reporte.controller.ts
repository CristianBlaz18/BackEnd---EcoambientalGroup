import { Controller, Res, Get,Headers, Param } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { Response } from 'express';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Excel')
@Controller('reporte')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get('reporte/:institucion/:nombreCurso/:tipo')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Reporte de los cursos por Institucion',
    description:
      'Mediante lo parametros institucion y nombre del curso listamos el reporte ; SP: admin_sp_listar_curso_1(?,?),admin_sp_kistar_estudiantes_x_cursos_2_0(?),admin_listar_reporte_evaluacion_entregable_id(?,?),admin_listar_reporte_nota_evaluacion_entregable(?,?,?),admin_sp_filtrar_promedio(?,?),admin_sp_desea_certificado(?,?,@estado),admin_sp_validar_certificado(?,?,?);',
  })
  async generateReport(@Param('institucion') institucion: string,
  @Param('nombreCurso') nombreCurso: string,
  @Param('tipo') tipo: string,
    @Res() res: Response): Promise<void> {
    const excelBuffer = await this.reporteService.generarDatos(institucion,nombreCurso,tipo);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=report.xlsx',
      'Content-Length': excelBuffer.length,
    });

    res.send(excelBuffer);
    return excelBuffer;
  }

  @Get('Datos/:institucion/:nombreCurso/:tipo')
  async generaDatos(@Param('institucion') institucion: string,
  @Param('tipo') tipo: string,
  @Param('nombreCurso') nombreCurso: string,) {
    return await this.reporteService.generarDatos(institucion,nombreCurso,tipo);

  }

  @Get('Prueba/:idEstudiante/:idCurso')
  async getCertificado(@Param('idEstudiante') idEstudiante: number,
  @Param('idCurso') idCurso: number,) {
    return await this.reporteService.getEvaluacionesNotas(idEstudiante,idCurso);

  }

  @Get('DatosEvaluacionEntregable/:idCurso')
  async getEvaEntregable(
  @Param('idCurso') idCurso: number,) {
    return await this.reporteService.getEvaluacionesCurso(idCurso);

  }

  @Get('DatosNotas/:idEstudiante/:idServicio')
  async getNotasCurso(@Param('idEstudiante') idEstudiante: number,
  @Param('idServicio') idServicio: number,) {
    return await this.reporteService.getEvaluacionesNotas(idEstudiante,idServicio);

  }
}
