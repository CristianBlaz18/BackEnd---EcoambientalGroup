import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivarCuponDto } from './dto/activar-cupon.dto';

@ApiTags('Cupon')
@Controller('cupon')
export class CuponController {
  constructor(private readonly cuponService: CuponService) {}

  @Get('aplicable/:idestudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar cupones aplicables de un estudiante',
    description:
      'Esta api permite mostrar los cupones aplicables(activos) de un estudiante mediante un parametro:{"idEstudiante":"number"}. SP: sp_listar_cupones_activos(?)',
  })
  async aplicablescupones(@Param('idestudiante') idestudiante: number) {
    return await this.cuponService.cuponesAplicables(idestudiante);
  }

  @Get(':idestudiante/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Mostrar cupones de un estudiante',
    description:
      'Esta api permite mostrar los cupones de un estudiante mediante un parametro:{"idEstudiante":"number" ; "institucion":string}. SP: sp_listar_mis_cupones(?)',
  })
  async listarcupones(
    @Param('idestudiante') idestudiante: number,
    @Param('institucion') institucion: string,
  ) {
    return await this.cuponService.listarCupones(idestudiante, institucion);
  }

  @Post()
  @ApiHeader({ name: 'api-key', description: 'Contra de API' })
  @ApiOperation({
    summary: 'Registrar codigo de cupon',
    description:
      'Mediante mediante querys:{"codigoCupon":"string","idEstudiante":"number","institucion":"string"}. SP: sp_registrar_miscupones(?,?,?,@mensaje)',
  })
  registrarCupon(@Query() activarCuponDto: ActivarCuponDto) {
    try {
      return this.cuponService.registrarCupon(activarCuponDto);
    } catch (error) {
      console.log(error);
      throw new Error('Error al listar registrar cupon: ' + error.message);
    }
  }
}
