import { Controller, Get, Param } from '@nestjs/common';
import { PoliticaService } from './politica.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Politica')
@Controller('politica')
export class PoliticaController {
  constructor(private readonly politicaService: PoliticaService) {}

  @Get(':institucion/:politica')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'mostrar politicas y terminos',
    description:
      'Esta API permite obtener los datos de la politicas y terminos mediante el parametro:{"nombre institucion":"string", "nombre de politicas":"string(tipo de pilitica"}. SP: call sp_listar_politicas(?,?)',
  })
  politica(
    @Param('institucion') nombreInstitucion: string,
    @Param('politica') nombrePolitica: string,
  ) {
    return this.politicaService.politicas(nombreInstitucion, nombrePolitica);
  }
}
