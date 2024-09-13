import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaqueteService } from './paquete.service';
import { ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { PaqueteFilterDto } from './dto/paquete-filter.dto';
import { PaqueteFilterCompradas } from './dto/paquete-filter-compradas.dto';
import { FilterPaqueteDto } from './dto/filter-paquete.dto';

@ApiTags('Paquete')
@Controller('paquete')
export class PaqueteController {
  constructor(private readonly paqueteService: PaqueteService) {}

  // @Get('cursoPaquete/:idPaquete/:idEstudiante')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({summary: 'Detalle de Paquete', description:'el primer parametro a ingresar es el id del paquete y el segundo es el id del tipo de paquete que es para promociones y especializaciones que serán 0 y 1 respectivamente; se utiliza en procedimiento almacenado sp_listar_cursos_paquetesc(?,?)'})
  // cursosxpaquete(
  //   @Param('idPaquete') idPaquete: number,
  //   @Param('idEstudiante') idEstudiante: number,
  // ) {
  //   return this.paqueteService.cursosxpaquete( idPaquete, idEstudiante);
  // }
  //filtros de especializaciones compradas

  @Get('filtroPaquete/:institucion/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Filtrar Paquetes Estudiante',
    description:
      'Filtrar los paquetes por el {"institucion":String,"nombrePaquete" :string, "OrenIndex":number,Tipo_Paquete : 1 Promocion y 0 Especializacion ,"idEstudiante":number}SP:sp_listar_paquetes_filtros_estudiante(nombre_institucion, nombre_paquete, orden_index, tipo_paquete, id_estudiante)',
  })
  filtrarPaqueteEstudiante(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,
    @Query() fiterPaqueteDto: FilterPaqueteDto,
  ) {
    return this.paqueteService.filtrarPaqueteEstudiante(institucion, idEstudiante, fiterPaqueteDto);
  }

  @Get('comprados/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listado y filtros de Paquetes Comprados',
    description:
      'Esta API permite listar y filtrar los paquete comprados mediante el parametro parametro:{"institución":"string"} y query {"id_estudiante", "nombre_paquete"}, SP: sp_filtrar_paquetes_comprados(),sp_listar_cursos_paquetesc',
  })
  paquetesComprados(
    @Param('institucion') nombre_institucion: string,
    @Query() paqueteFilterCompradas: PaqueteFilterCompradas,
  ) {
    return this.paqueteService.paquetesComprados(
      nombre_institucion,
      paqueteFilterCompradas,
    );
  }

  @Get('/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Filtrar Paquetes',
    description:
      'Mediante el parametro:{"institución":"string"}, los querys son:{"input":"string","orden(1 y 2= por nombre asc y desc 3 y 4 = por fecha asc y desc 5 y 6 = por precio asc y desc)":"string", "tipo(0=especializacion 1=promocion)":"string","page":"number","sizePage":"number"}. SP: sp_listar_paquetes_filtros(?,?,?,?), sp_listar_cursos_paquete(?,?), ',
  })
  filtrar(
    @Param('institucion') institucion: string,
    @Query() paqueteFilterDto: PaqueteFilterDto,
  ) {
    return this.paqueteService.filtrarpaquetes(institucion, paqueteFilterDto);
  }

  @Get('/:institucion/:idPaq/:tipo')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalle de Paquete',
    description:
      'el primer parametro a ingresar es el nombre de la institución,el segundo es el id del paquete y el ultimo es el id del tipo de paquete que es para promociones y especializaciones que serán 0 y 1 respectivamente. SP: sp_listar_detalle_paquete(), sp_listar_objetivo_promocion(?), sp_listar_objetivo_especializacion(?), sp_listar_cursos_paquete(?,?)',
  })
  detallePaquete(
    @Param('institucion') institucion: string,
    @Param('idPaq') idPaq: number,
    @Param('tipo') tipo: number,
  ) {
    return this.paqueteService.detallePaquete(institucion, idPaq, tipo);
  }

  
}
