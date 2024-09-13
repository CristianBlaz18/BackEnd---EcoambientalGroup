import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FiltrarServicioDTO } from './dto/filtrar-servicio.dto';

@ApiTags('Servicio')
@Controller('servicio')
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Filtrar Capacitaciones',
    description:
      'Esta API permite mostrar las capacitaciones filtradas recibiendo mediante el parametro:{"nombre institucion":"string"} Y Query :{"nombre de la capacitacion":"string", "orden de muestra": "number"}; SP: sp_filtrar_capacitacion()',
  })
  filtrarservicios(
    @Param('institucion') institucion: string,
    @Query() filtrarServicioDto: FiltrarServicioDTO,
  ) {
    try {
      return this.servicioService.filtrarservicios(
        institucion,
        filtrarServicioDto,
      );
    } catch (error) {
      return {
        error: 'No se pudo filtrar desde COntroller',
        message: error.message,
      };
    }
  }

  @Get('detalle/:institucion/:capacitacionId')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalle de Capacitación',
    description:
      'El API mostrara el detalle de la acapacitación en que ira por parametros el nombre de la institución y el id de la capacitación. SP: sp_filtrar_detalle_capacitacion(), sp_listar_cursos_externos_capacitacion(?)',
  })
  async getDetalleCapacitacion(
    @Param('institucion') institucion: string,
    @Param('capacitacionId') capacitacionId: number,
  ) {
    return this.servicioService.getDetalleCapacitacion(
      institucion,
      capacitacionId,
    );
  }

  @Get('otros/:institucion/:estadoCapacitacion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Ver Mas Capacitaciones',
    description:
      'El API devolvera mas capacitaciones la cual contiene 2 parametros uno que es por el nombre de institución y estado de capacitación que sera de 1 para que se muestren y si es 0 no mostrara nada. SP: sp_listar_mas_servicios()',
  })
  async getPlansByInstitucion(
    @Param('institucion') institucion: string,
    @Param('estadoCapacitacion') estadoCapacitacion: number,
  ) {
    try {
      return this.servicioService.getMasCapacitaciones(
        institucion,
        estadoCapacitacion,
      );
    } catch (error) {
      return {
        error: 'No se pudo obtener los otros desde el controller',
        message: error.message,
      };
    }
  }

  @Get('externos/:idCapacitacion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Ver Externos Capaitacion',
    description:
      'La API devolvera mas capacitacion externa la cual contiene 1 parametro  idCapacitacion. SP: sp_listar_cursos_externos_capacitacion()',
  })
  async getCapacitacionCurEx(@Param('idCapacitacion') idCapacitacion: number) {
    try {
      return await this.servicioService.getCapacitacionCurEx(idCapacitacion);
    } catch (error) {
      return {
        error: 'No se pudo obtener la capacitacion externa desde el controller',
        message: error.message,
      };
    }
  }
}
