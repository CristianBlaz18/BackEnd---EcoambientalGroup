import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataPlanRenovacionDto } from './dto/data-plan-renovacion.dto';
import { ActivarPlanDto } from './dto/activar-plan.dto';
import { PlanIndividualDto } from './dto/plan-individual.dto';
import { MejorarPlanDto } from './dto/mejora-plan.dto';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // @Get(':institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Lista de Planes',
  //   description:
  //     'El parametro para que se muestren los planes sera el nombre de la institución, devolvera los planes que tiene cada institución; se esta utilizando los procedimientos almacenados: sp_listar_plan_institucion() y sp_listar_beneficios_x_plan()',
  // })
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // async planes(@Param('institucion') institucion: string) {
  //   return await this.planService.planes(institucion);
  // }

  // @Post('renovacion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Renovacion Plan',
  //   description:
  //     'Esta API sirve para registrar o renovar un plan con los parametros: id_estudiante, id_detalle_servicio, id_plan_actual,impuesto_transaccion, token_pasarela, numero_transaccion. SP: sp_renovar_suscripcion()',
  // })
  // async renovacionsuscripciones(
  //   @Body() dataPlanRenovacionDto: DataPlanRenovacionDto,
  // ) {
  //   return await this.planService.renovacionPlan(dataPlanRenovacionDto);
  // }

  // @Post('activar')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Activar una subsripcion a un plan',
  //   description:
  //     'Mediante los parametros:{"planCodigo":"string","idEstudiente":"number"}.SP: sp_registrar_miplan(?,?,@mensaje)',
  // })
  // async registrarPlan(@Query() activarPlanDto: ActivarPlanDto) {
  //   return await this.planService.registrarPlan(activarPlanDto);
  // }

  // @Get('actual/:idEstudiante/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Listar Planes Actuales',
  //   description:
  //     'Esta API Lista los planes actuales con los parametro de idEstudiante y nombre de la institucion en los procedimiento almacenados sp_listar_plan_actual() y sp_listar_beneficios_x_plan()',
  // })
  // async getPlanesActuales(
  //   @Param('idEstudiante') idEstudiante: number,
  //   @Param('institucion') institucion: string,
  // ) {
  //   return await this.planService.getPlanesActuales(idEstudiante, institucion);
  // }
  // // @Get('set-cookie/:nombrePlan')
  // // setCookie(@Res() res: Response, @Param('nombrePlan') nombrePlan: string) {
  // //   const cookieValue = `nombrePlan=${nombrePlan}; HttpOnly; Path=/`;
  // //   res.setHeader('Set-Cookie', cookieValue);
  // //   console.log('Set-Cookie', cookieValue);
  // //   return res.send(`Cookie enviada : ${nombrePlan}`);
  // // }

  // @Patch('cancelar-plan/:idCompra/:idEstudiante')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Cancelar plan',
  //   description:
  //     'Esta api permite cancelar la subscripcion de un estudiante a un plan mediante parametros: {"idCompra":"number","idEstudiante":"number"}. SP: sp_cancelar_plan_adquirido(?,?)',
  // })
  // cancelarPlan(
  //   @Param('idCompra') idCompra: number,
  //   @Param('idEstudiante') idEstudiante: number,
  // ) {
  //   return this.planService.cancelarPlan(idCompra, idEstudiante);
  // }

  // @Get('individual/:institucion')
  // @ApiHeader({
  //   name: 'api-key',
  //   description: 'Contra de API',
  // })
  // @ApiOperation({
  //   summary: 'Plan individual',
  //   description:
  //     'Esta api permite obtener un plan individual del estudiante mediante parametros: {"nombre_institucion":"string","id_plan":"number"}. SP: sp_listar_plan_individual()',
  // })
  // planindividual(
  //   @Param('institucion') nombre_institucion: string,
  //   @Query() planIndividualDto: PlanIndividualDto,
  // ) {
  //   return this.planService.planIndividual(
  //     nombre_institucion,
  //     planIndividualDto,
  //   );
  // }

  // @Post('mejorar')
  // @ApiOperation({
  //   summary: 'Mejorar plan',
  //   description:
  //     'La API permite comprar un plan superior al que se tiene mediante parametros: {"idEstudiante":"number","idPlanActual":"number","idPlanNuevo":"number"}. SP: sp_comprar_plan_nuevo(?,?,?, @precio)',
  // })
  // mejorarPlan(@Body() mejorarPlandto: MejorarPlanDto) {
  //   return this.planService.mejorarPlan(mejorarPlandto);
  // }
}
