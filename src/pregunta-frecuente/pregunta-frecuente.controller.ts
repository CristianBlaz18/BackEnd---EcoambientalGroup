import { Controller, Get, Param } from '@nestjs/common';
import { PreguntaFrecuenteService } from './pregunta-frecuente.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pregunta Frecuente')
@Controller('pregunta-frecuente')
export class PreguntaFrecuenteController {
  constructor(
    private readonly preguntaFrecuenteService: PreguntaFrecuenteService,
  ) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Preguntas Frecuentes',
    description:
      'El parametro por el que se consultará a esta API es el nombre de la institución, devolvera las preguntas frecuentes de acuerdo a cada institución. SP: sp_listar_preguntas_frecuentes_institucion()',
  })
  preguntas(@Param('institucion') institucion: string) {
    return this.preguntaFrecuenteService.preguntasfrecuentes(institucion);
  }
}
