import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @ApiTags('Banner')
  @Get('/:tipo/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Banner por Institución',
    description:
      'El API mostrara las imagenes que iran en los sliders, cuenta con 2 parametros, el primer parametro es el tipo (inicio, promocion) y el segundo es el nombre de la institución; SP: sp_listar_banner()',
  })
  publicidad(
    @Param('tipo') tipo: string,
    @Param('institucion') institucion: string,
  ) {
    return this.bannerService.publicidad(tipo, institucion);
  }
}
