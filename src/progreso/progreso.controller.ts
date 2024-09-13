import { Controller, Get, Query } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProgresoDto } from './dto/progreso.dto';

@ApiTags('Progreso')
@Controller('progreso')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Get()
  @ApiOperation({
    summary: 'Progreso de un curso',
    description:
      'Mediante los querys:{"idCurso":"number","idEstudiante":"number"}. SP: sp_filtrar_cursoc_detalle(?, ?, @f_fin, @nota, @progreso)',
  })
  progreso(@Query() progresoDto: ProgresoDto) {
    return this.progresoService.progreso(progresoDto);
  }
  // @Get('notificacion/:idCurso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Notificar faltante en semanas para la finalizacion de un curso',
  //   description:
  //     'Mediante parametro:"idCurso":"number". SP: sp_visualizar_duracion_curso(?)',
  // })
  // notificacion(
  //   @Param('idCurso') idCurso: number
  // ){
  //   return this.progresoService.terminoCurso(idCurso);
  // }

  // @Get('/:idEstudiante/:idCurso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Obtener progreso de un curso',
  //   description:
  //     'Mediante parametros:"idEstudiante":"number","idCurso":"number". SP: SELECT ft_devolver_pogreso_curso(?,?)',
  // })
  // progresoCurso(
  //   @Param('idEstudiante') idEstudiante: number,
  //   @Param('idCurso') idCurso: number,
  // ) {
  //   return this.progresoService.progresoCurso(idEstudiante, idCurso);
  // }
}
