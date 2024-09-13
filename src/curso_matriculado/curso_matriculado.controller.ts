import { Controller, Get, Param, Query } from '@nestjs/common';
import { CursoMatriculadoService } from './curso_matriculado.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Curso matriculado')
@Controller('curso-matriculado')
export class CursoMatriculadoController {
  constructor(
    private readonly cursoMatriculadoService: CursoMatriculadoService,
  ) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Curso Matriculado',
    description:
      'Esta API permite traer los modulos del modulo con el parametro:{"institucion":"string(nombre del a institucion)"} y querys:{"idMatricula":"number","idCurso":"number"}. SP sp_visualizar_modulos_curso(?,?,?)',
  })
  cursoModuloMatriculado(
    @Param('institucion') nombreInstitucion: string,
    @Query('idcurso') idCurso: number,
  ) {
    return this.cursoMatriculadoService.cursomoduloMatriculado(
      nombreInstitucion,
      idCurso,
    );
  }

  // @Get('materiales/:idmodulo')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Materiales Modulo',
  //   description:
  //     'Esta API permite traer los materiales de cada modulo con el parametro:{"idModulo":"number"}.SP: sp_listar_modulo_materiales(?)',
  // })
  // materialesUnmodulo(@Param('idmodulo') idModulo: number) {
  //   return this.cursoMatriculadoService.materialesModulo(idModulo);
  // }

  @Get('promedio/:idMatricula')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Promedio de un curso matriculado',
    description:
      'Esta API permite obtener el promedio de un curso con el parametro:{"idMatricula":"number. SP SELECT fn_promediar_nota_x_evaluaciones_entregables(?)',
  })
  promedio(@Param('idMatricula') idMatricula: number) {
    return this.cursoMatriculadoService.promedio(idMatricula);
  }
}
