import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistorialCompraService } from './historial-compra.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataHistorialCompra } from './dto/data-historial-compra.dto';

@ApiTags('Historial de compras')
@Controller('historial-compra')
export class HistorialCompraController {
  constructor(
    private readonly historialCompraService: HistorialCompraService,
  ) {}

  @Get('detalle/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Historial de compra general y detalle Historial de compra',
    description:
      'Esta Api permite traer el detalle de compra(curso, especializacion, promociones, planes y certificado) mediante el parametro : {"nombre_institucion": string, "id_estudiante": number}; SP: sp_historial_de_compra(), sp_detalle_historial_compra_curso(), sp_detalle_historial_compra_especializacion(), sp_detalle_historial_compra_promocion(), sp_detalle_historial_compra_plan(), sp_detalle_historial_compra_certificado()',
  })
  detalleHistorial(
    @Param('institucion') institucion: string,
    @Query() dataHistorialCompra: DataHistorialCompra,
  ) {
    return this.historialCompraService.detalleCompra(
      institucion,
      dataHistorialCompra,
    );
  }
}
