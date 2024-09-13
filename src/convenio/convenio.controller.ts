import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { ConvenioService } from './convenio.service';

@ApiTags('Convenio')
@Controller('convenio')
export class ConvenioController {
  constructor(private readonly convenioService: ConvenioService) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar convenios',
    description: 'Esta api permite mostrar los conveniones mediante un parametro:{"institucion":"string(nombre de institucion)"}. SP: sp_listar_convenios_institucion(institucion)',
  })
  async mostrarConvenios(@Param('institucion') institucion: string) {
    return this.convenioService.mostrarConvenios(institucion);
  }
}
