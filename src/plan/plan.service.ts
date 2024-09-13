import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { DataPlanRenovacionDto } from './dto/data-plan-renovacion.dto';
import { Beneficio } from './entities/plan-beneficio.entity';
import { ActivarPlanDto } from './dto/activar-plan.dto';
import { PlanIndividualDto } from './dto/plan-individual.dto';
import { MejorarPlanDto } from './dto/mejora-plan.dto';
import { Request } from 'express';

@Injectable()
export class PlanService {
  // constructor(
  //   @InjectRepository(Plan)
  //   private planRepository: Repository<Plan>,
  //   @InjectRepository(Beneficio)
  //   private beneficioPlanRepository: Repository<Beneficio>,
  // ) {}
  // exampleMethod(req: Request) {
  //   const nombrePlanCookie = req.cookies['nombrePlan'];
  //   // Hacer algo con la cookie en el servicio
  //   return nombrePlanCookie;
  // }

  // async planes(institucion: string) {
  //   try {
  //     const planes = await this.planRepository.query(
  //       'CALL sp_listar_planes_institucion(?)',
  //       [institucion],
  //     );
  //     if (planes[0] && Array.isArray(planes[0])) {
  //       const planesMapeados = planes[0].map((plan: any) => ({
  //         id: plan.plan_id,
  //         nombre: plan.plan_nombre,
  //         precioSoles: plan.plan_precio_soles,
  //         precioDolares: plan.plan_precio_dolar,
  //         plan_numero_personas_acceso: plan.plan_numero_personas_acceso,
  //         beneficios: [],
  //       }));

  //       for (const plan of planesMapeados) {
  //         const beneficios = await this.beneficiosxplan(plan.id);

  //         if (Array.isArray(beneficios[0])) {
  //           plan.beneficios = beneficios[0].map((beneficio: any) => ({
  //             id: beneficio.plan_beneficios_id,
  //             descripcion: beneficio.plan_beneficios_descripcion,
  //             limite: beneficio.plan_beneficios_limite,
  //           }));
  //         }
  //       }
  //       return planesMapeados;
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al obtener planes ' + error.message);
  //   }
  // }
  // //renovacion de suscripcion
  // async renovacionPlan(dataPlanRenovacionDto: DataPlanRenovacionDto) {
  //   try {
  //     const query = `Call sp_renovar_suscripcion(?,?,?,?,?,?)`;
  //     await this.planRepository.query(query, [
  //       dataPlanRenovacionDto.id_estudiante,
  //       dataPlanRenovacionDto.id_detalle_servicio,
  //       dataPlanRenovacionDto.id_plan_actual,
  //       dataPlanRenovacionDto.token_pasarela,
  //       dataPlanRenovacionDto.numero_transaccion,
  //     ]);
  //     return {
  //       message:
  //         'se registro exitoasamente la renovacion de suscripcion de plan',
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('error al subir ' + error.message);
  //   }
  // }

  // async getPlanesActuales(idEstudiante: number, institucion: string) {
  //   try {
  //     const [getPlanesActuales] = await this.planRepository.query(
  //       'CALL sp_listar_plan_actual(?,?)',
  //       [idEstudiante, institucion],
  //     );
  //     if (getPlanesActuales && Array.isArray(getPlanesActuales)) {
  //       const planesMapeados = getPlanesActuales.map((plan: any) => ({
  //         id: plan.plan_id,
  //         nombre: plan.plan_nombre,
  //         precioSoles: plan.plan_precio_soles,
  //         precioDolares: plan.plan_precio_dolar,
  //         detalleventa_id: plan.detalleventa_id,
  //         fecha: plan.detalleventa_fecha_fin_acceso,
  //         beneficios: [],
  //       }));
  //       for (const plan of planesMapeados) {
  //         const beneficios = await this.beneficiosxplan(plan.id);
  //         if (Array.isArray(beneficios[0])) {
  //           plan.beneficios = beneficios[0].map((beneficio: any) => ({
  //             id: beneficio.plan_beneficios_id,
  //             descripcion: beneficio.plan_beneficios_descripcion,
  //             limite: beneficio.plan_beneficios_limite,
  //           }));
  //         }
  //       }
  //       return planesMapeados;
  //     } else {
  //       return [];
  //     }
  //     //return getPlanesActuales;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al obtener los planes actuales' + error.message);
  //   }
  // }

  // async beneficiosxplan(planIds: number): Promise<Beneficio[]> {
  //   try {
  //     const beneficios = await this.beneficioPlanRepository.query(
  //       'CALL sp_listar_beneficios_x_plan(?)',
  //       [planIds],
  //     );
  //     return beneficios;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'error al obtener los beneficios de un plan ' + error.message,
  //     );
  //   }
  // }

  // async registrarPlan({ planCodigo, idEstudiante }: ActivarPlanDto) {
  //   try {
  //     await this.planRepository.query('Call sp_registrar_miplan(?,?,@M,@N)', [
  //       planCodigo,
  //       idEstudiante,
  //     ]);
  //     const [result] = await this.planRepository.query(
  //       'SELECT @M AS mensaje, @N AS nombre',
  //     );
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al listar registrar plan');
  //   }
  // }

  // async cancelarPlan(idCompra: number, idEstudiante: number) {
  //   try {
  //     const compraQuery =
  //       'SELECT compra_estado FROM tbl_compra WHERE compra_id = ?';
  //     const estudianteQuery =
  //       'SELECT usuario_id FROM tbl_usuario WHERE usuario_id = ?';

  //     const [compraResult] = await this.planRepository.query(compraQuery, [
  //       idCompra,
  //     ]);
  //     const estudianteResult = await this.planRepository.query(
  //       estudianteQuery,
  //       [idEstudiante],
  //     );

  //     if (!compraResult) {
  //       throw new NotFoundException('La compra no existe.');
  //     }

  //     if (!estudianteResult) {
  //       throw new NotFoundException('El estudiante no existe.');
  //     }

  //     // Validación del estado actual de la compra
  //     const estadoCompra = compraResult.compra_estado;

  //     if (estadoCompra === 0) {
  //       return { message: 'La compra ya está cancelada.' };
  //     }

  //     const cancelacion = await this.planRepository.query(
  //       'CALL sp_cancelar_plan_adquirido(?,?)',
  //       [idCompra, idEstudiante],
  //     );
  //     if (cancelacion.affectedRows > 0) {
  //       return { message: 'La compra ha sido cancelada exitosamente.' };
  //     } else {
  //       throw new Error('No se pudo cancelar la compra.');
  //     }
  //   } catch (error) {
  //     console.error('Error al cancelar el plan:', error);
  //     throw new Error('Error al cancelar la compra ' + error.message);
  //   }
  // }

  // async planIndividual(
  //   nombre_institucion: string,
  //   planIndividualDto: PlanIndividualDto,
  // ) {
  //   try {
  //     const [isInstitucion] = await this.planRepository.query(
  //       'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
  //       [nombre_institucion],
  //     );

  //     if (isInstitucion) {
  //       const planindividual = await this.planRepository.query(
  //         'call sp_listar_plan_individual(?,?)',
  //         [nombre_institucion, planIndividualDto.id_plan],
  //       );

  //       return planindividual[0];
  //     } else {
  //       throw new BadRequestException('No existe la institucion ingresada');
  //     }
  //   } catch (error) {
  //     throw new Error('Error al obtener el plan individual ' + error.message);
  //   }
  // }

  // async mejorarPlan({
  //   idEstudiante,
  //   idPlan,
  //   idPlanNuevo,
  //   impuesto_transaccion,
  //   token_pasarela,
  //   numero_transaccion,
  // }: MejorarPlanDto) {
  //   try {
  //     const [consulta] = await this.planRepository.query(
  //       `SELECT tbl_detalleventa.detalleventa_servicio_id FROM tbl_compra JOIN tbl_detalleventa ON tbl_compra.compra_id = tbl_detalleventa.compra_id WHERE tbl_compra.estudiante_id = ? AND tbl_compra.compra_estado = 1 AND tbl_detalleventa.detalleventa_tipo_servicio ='plan'`,
  //       [idEstudiante],
  //     );
  //     const idPlanActivo = consulta.detalleventa_servicio_id;
  //     if (idPlanActivo != idPlan) {
  //       throw new Error('El idPlan ingresado debe ser igual al planActivo');
  //     }
  //     if (idPlanNuevo > idPlan) {
  //       await this.planRepository.query(
  //         'Call sp_comprar_plan_nuevo(?,?,?,?,?,?, @precio)',
  //         [
  //           idEstudiante,
  //           idPlan,
  //           idPlanNuevo,
  //           impuesto_transaccion,
  //           token_pasarela,
  //           numero_transaccion,
  //         ],
  //       );
  //       return { message: 'Mejora de plan exitoso.' };
  //     } else {
  //       throw new Error(
  //         'El idPlanNuevo no debe ser menor o igual al idPlanActual ',
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error al mejorar el plan:', error);
  //     throw new Error('Error al mejorar el plan ' + error.message);
  //   }
  // }
}
