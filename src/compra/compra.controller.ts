import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { CompraService } from './compra.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ProductosCompradosDto } from './dto/products-user.dto';
import { PrecioDto } from './dto/precio-calcular.dto';

@ApiTags('Compra')
@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  // @Post('paquete')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Registrar una compra de un paquete',
  //   description:
  //     'Esta api permite registrar una compra curso Y devolverá dos datos que son el costo en soles o el costo en dolares:{"id_compra":number","id_estudiante":"number","id_paquete":"number","id_cupon":"number","precio_total":"number","tipo_moneda(USD,PEN)": "string"}. SP: sp_insertar_compra_paquete(?,?,?,?,?,?)',
  // })
  // async insertarCompraPaquete(
  //   @Body() createCompraPaquete: CreateCompraPaqueteDto,
  // ) {
  //   return await this.compraService.insertarCompraPaquete(createCompraPaquete);
  // }

  // // @Post('rapida')
  // // @ApiHeader({
  // //   name: 'api-key',
  // //   description: 'Contra de API',
  // // })
  // // @ApiOperation({
  // //   summary: 'Registrar una compra rapida de un servicio',
  // //   description:
  // //     'Esta api permite registrar una compra rapida de un servicio mediante un array:{"id_estudiante":"number","id_servicio":"number","tipo_servicio":"string","impuesto_transaccion_sol":"number","impuesto_transaccion_dolar":"number","token_pasarela":"string","numero_transaccion":"string","id_cupon":"number","tipo_moneda":"string","nombre":"string","imagen":"string","tiempo_acceso":"number","precio_actual_soles":"number","precio_actual_dolares":"number","estudiante_pais":"string","micupon":"number","plan_codigo":"number"}. SP: sp_compra_rapida_servicio(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
  // // })
  // // compraRapida(@Body() createCompraRapidaDto: CreateCompraRapidaDto) {
  // //   return this.compraService.compraRapida(createCompraRapidaDto);
  // // }

  // @Post('plan')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Registrar una compra de plan',
  //   description:
  //     'Esta api permite registrar una compra por un plan mediante un array: {"id_estudiante":"number", "id_plan":"number", "precio_total": "number", "numero_transaccion":"string", "tipo_moneda":"string(USD,PEN)", "impuestos_transaccion": "number", "token_pasarela": "string"}. SP: sp_insertar_compra_plan(?,?,?,?,?,?,?)',
  // })
  // compraplan(@Body() createCompraPlanDto: CreateCompraPlanDto) {
  //   return this.compraService.comprarplan(createCompraPlanDto);
  // }

  // @Post('curso')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Registrar una compra de un curso',
  //   description:
  //     'Esta api permite registrar una compra curso con los parametros:{"id_cupon":"number","id_estudiante":"number","id_curso":"number","id_compra":number","precio_total":"number","tipo_moneda(USD,PEN,EUR)": "string"}. SP:sp_insertar_compra_curso(?,?,?,?,?,?)',
  // })
  // async insertarCompraCurso(
  //   @Body() createComprarCursoDto: CreateComprarCursoDto,
  // ) {
  //   return await this.compraService.insertarCompraCurso(createComprarCursoDto);
  // }
  @Post('Precios')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Calcular Precio total',
    description: 'Esta API recibirá un array con los datos',
  })
  async precio(@Body() precioDto: PrecioDto) {
    return await this.compraService.precio(precioDto.productos);
  }

  @Post('cursoGratuito/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar una compra de un curso Gratuito',
    description:
      'Esta api permite registrar una compra curso gratuito con los parametros:{"id_cupon":"number","id_estudiante":"number","id_curso":"number","id_compra":number","precio_total":"number","tipo_moneda(USD,PEN,EUR)": "string"}. SP:sp_listar_productos_comprados(?,?),sp_revisar_entregable_caducado(?,?),sp_revisar_evaluacion_caducado(?,?),sp_registrar_compra_prueba(?,?,?,?,?,?,?,?,?,@ide_compra), sp_update_tbl_compra_prueba(?,?,?,?),sp_insertar_compra_curso(?,?,?,?,?)',
  })
  async crearCursoGratuito(
    @Param('institucion') institucion: string,
    @Body() createCompraDto: CreateCompraDto,
  ) {
    return await this.compraService.registrarCompraGratuita(
      institucion,
      createCompraDto,
    );
  }

  @Post(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar una compra',
    description:
      'Esta api permite registrar una compra registrando varios productos(curso,paquete,certificado,plan) mediante un parametro:{"institucion":"string(nomrbe de institucion)"} y un array:{"id_estudiante":"number","cod_cupon":"string","precio_total":"number","tipo_moneda(USD,PEN)": "string","impuesto_transaccion":"number","token_pasarela":"string","productos":"array"}. El array de productos es donde se registra cada producto del carrito y cada producto debe tener el siguiente formato: {"id":"number(id del producto)", "id_cupon":"number", "tipo":"string(curso,paquete,certificado,plan)","precio_soles":"number","precio_soles_antes":"number","precio_dolar":"number","precio_dolar_antes":"number"}. SP: sp_listar_productos_comprados(?,?), sp_registrar_compra_prueba(?,?,?,?,?,?,?,@ide_compra), ',
  })
  async crearCompra(
    @Param('institucion') institucion: string,
    @Body() createCompraDto: CreateCompraDto,
  ) {
    return await this.compraService.registrarCompra(
      institucion,
      createCompraDto,
    );
  }

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Listar productos comprados',
    description:
      'Esta api permite listar los productos comprados por un estudiante, mediante el parametro:{"institucion(nombre de la institucion)":"string"} y el query:{"idEstudiante":"number"}. SP: sp_listar_productos_comprados(?,?) ',
  })
  async productosComprados(
    @Param('institucion') institucion: string,
    @Query() productosCompradosDto: ProductosCompradosDto,
  ) {
    return await this.compraService.productosComprados(
      institucion,
      productosCompradosDto,
    );
  }
}
