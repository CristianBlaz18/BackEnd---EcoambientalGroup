import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ModuloService } from './modulo.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MostrarModulosDto } from './dto/mostrar-modulos.dto';
import { Query } from '@nestjs/common';
import { MostrarEvalEntreDto } from './dto/evalEntre-modulo.dto';

@ApiTags('Modulo')
@Controller('modulo')
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) {}

  @Get('/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Lista Modulos y contenidos de un curso',
    description:
      'Mediante los parametros:{"nombre":"string", "idCurso":"number",}. SP: sp_visualizar_modulos_curso(?,?), sp_listar_sesiones_x_modulos(),sp_filtrar_entregables_evaluaciones()',
  })
  async modulosCursoComprado(@Param('institucion') institucion: string, @Query() mostrarModulosDto:MostrarModulosDto) {
    return this.moduloService.modulosCursoComprado(institucion,mostrarModulosDto );
  }

  @Get('entregableEvaluaciones/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar entregables y evaluaciones',
    description:
      'Mediante los parametros:{"nombre":"string", "idCurso":"number",}. SP: sp_visualizar_modulos_curso(?,?), sp_listar_sesiones_x_modulos(),sp_filtrar_entregables_evaluaciones()',
  })
  async evaEntreModulo(@Param('institucion') institucion: string, @Query() evalEntreModuloDto:MostrarEvalEntreDto) {
    return this.moduloService.evaEntreModulo(institucion,evalEntreModuloDto );
  }

  // @Get(':institucion/:idCurso/:idUsuario/:idModulo')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({summary: 'Lista Modulo', description:'Esta API listara los detalle de cada modulo con los parametros de institucion nombre, id del curso, id del usuario y el id del moduo en el procedimiento almacenado sp_listar_modulo_detalles()'})
  // detalleModulo(
  //   @Param('institucion') institucion:string,
  //   @Param('idCurso') idCurso:number,
  //   @Param('idUsuario') idUsuario:number,
  //   @Param('idModulo') idModulo:number
  //   )
  // {
  //   return this. moduloService.detalleModulo(institucion,idCurso,idUsuario,idModulo);
  // }

  //   @Get('funcion/:idEstudiante/:idModulo')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Prueba Funcion',
  //   description:
  //     'Mediante los parametros:{"nombre":"string", "idCurso":"number",}. SP: sp_listar_modulo_detalles(?,?,?,?), sp_visualizar_modulos_curso(?,?)',
  // })
  // funcionPrueba(@Param('idEstudiante') idEstudiante: number,@Param('idModulo') idModulo: number) {
  //   return this.moduloService.funcionEntrega(idEstudiante,idModulo );
  // }
}
