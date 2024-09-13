import { Controller, Get, Param } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Institucion')
@Controller('institucion')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Get()
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listado de Instituciones',
    description:
      'al consultar esta API te devolvera el listado de todas las instituciones de ECORP; se utiliza el procedimiento almacenado sp_listar_area_academica()',
  })
  inicio() {
    return this.institucionService.inicio();
  }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalles de Institución',
    description:
      'Al consultar esta API mediante el parametro nombre institución en el procedimiento almacenado sp_visualizar_info_empresa()',
  })
  getInfEmpresa(@Param('institucion') institucion: string) {
    return this.institucionService.getInfoEmpresa(institucion);
  }
}
