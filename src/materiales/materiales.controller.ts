import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataMaterialesDto } from './dto/data-materiales.dto';

@ApiTags('Materiales')
@Controller('materiales')
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

  // @Get(':institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Materiales por Modulo',
  //   description:
  //     'Se listara los materiales que tendra cada modulo (idModulo) con los paramaetroe institucion, idEstudiante,idCurso en el procedimiento sp_listar_modulo_materiales(?,?,?)',
  // })

  // materialespormodulo(
  //   @Param('institucion') institucion: string,
  //   @Query() dataMaterialesDto: DataMaterialesDto,
  // ) {
  //   return this.materialesService.materialesporModulo(
  //     institucion,
  //     dataMaterialesDto,
  //   );
  // }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Materiales por Modulo',
    description:
      'Se listara los materiales que tendra cada modulo (idModulo) con los paramaetroe institucion, idEstudiante,idCurso en el procedimiento sp_listar_modulo_materiales(?,?,?,?),sp_visualizar_modulos_curso(?,?)',
  })

  materialespormodulo(
    @Param('institucion') institucion: string,
    @Query() dataMaterialesDto: DataMaterialesDto,
  ) {
    return this.materialesService.materialesporModulo(
      institucion,
      dataMaterialesDto,
    );
  }
}
