import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
const Openpay1 = require('openpay');
import { InjectRepository } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { Repository } from 'typeorm';
import { CreateComprarCursoDto } from './dto/create-insertar-compra-curso.dto';
import { CreateCompraDto } from './dto/create-compra.dto';
import { CompraCertificadoService } from 'src/compra-certificado/compra-certificado.service';
import { ProductosCompradosDto } from './dto/products-user.dto';
import { ProductoDto } from './dto/precio-calcular.dto';

@Injectable()
export class CompraService {
  // private readonly openPayUrl = 'https://sandbox-api.openpay.pe/v1/';
  private readonly merchantId = 'm18s8egxw1wkqn6avebt';
  private readonly apiKey = 'sk_09bcad15001549e4b20b117d6e820e67';
  private openpay: any;
  // private completedStatuses: any[] = [];
  constructor(
    private compraCertificadoService: CompraCertificadoService,
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
  ) {
    this.openpay = new Openpay1(this.merchantId, this.apiKey, false);
  }

  async registrarCompraGratuita(
    institucion: string,
    createCompraDto: CreateCompraDto,
  ) {
    try {
      const [productosComprados] = await this.compraRepository.query(
        'Call sp_listar_productos_comprados(?,?)',
        [institucion, createCompraDto.id_estudiante],
      );
      const servicios = productosComprados.map((producto) => ({
        detalleventa_servicio_id: producto.detalleventa_servicio_id,
        detalleventa_tipo_servicio: producto.detalleventa_tipo_servicio,
      }));
      const productos = createCompraDto.productos;

      if (productos.length == 0) {
        throw new Error('No se han proporcionado productos para la compra.');
      }
      // Recorrer la lista de productos del carrito y comparar con los productos comprados
      for (const product of productos) {
        for (const servicio of servicios) {
          // console.log(
          //   'Id Producto comprado: ' +
          //     servicio.detalleventa_servicio_id +
          //     ' de tipo ' +
          //     servicio.detalleventa_tipo_servicio,
          // );
          // console.log(
          //   'Id Producto en carrito: ' +
          //     product.id +
          //     ' de tipo ' +
          //     product.tipo,
          // );
          if (
            servicio.detalleventa_servicio_id === product.id &&
            servicio.detalleventa_tipo_servicio === product.tipo
          ) {
            console.log('Entrando a validacion');
            throw new Error(
              'Esta intentando comprar un producto que ya ha comprado anteriormente. ' +
                servicio.detalleventa_tipo_servicio +
                ' con id ' +
                servicio.detalleventa_servicio_id,
            );
          }
        }
      }
      const miCadena = null;
      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      const impuesto = 0;
      const responsableCompra = 'Gratuito';
      const tipoPago = 'Gratuito';
      const token =
        createCompraDto.id_estudiante + 'gratuito' + numeroAleatorio;
      await this.compraRepository.query(
        'CALL sp_revisar_entregable_caducado(?,?)',
        [institucion, createCompraDto.id_estudiante],
      );
      await this.compraRepository.query(
        'CALL sp_revisar_evaluacion_caducado(?,?)',
        [institucion, createCompraDto.id_estudiante],
      );
      await this.compraRepository.query(
        'Call sp_registrar_compra_prueba(?,?,?,?,?,?,?,?,?,@ide_compra)',
        [
          createCompraDto.id_estudiante,
          createCompraDto.id_cupon,
          createCompraDto.precio_total,
          createCompraDto.tipo_moneda,
          impuesto,
          token,
          tipoPago,
          responsableCompra,
          miCadena,
        ],
      );

      const [result] = await this.compraRepository.query(
        'SELECT @ide_compra AS idCompra',
      );
      const idCompra = result.idCompra;
      // Obtener la fecha actual
      const fechaActual = new Date();
      
      // Formatear la fecha actual para que coincida con el formato esperado por tu procedimiento almacenado
      const formattedFecha = fechaActual.toISOString().slice(0, 19).replace("T", " ");
      await this.compraRepository.query(
        'CALL sp_update_tbl_compra_prueba(?,?,?,?,?)',
        [idCompra, impuesto, token, 0,formattedFecha],
      );

      for (const product of productos) {
        if (product.tipo === 'Curso') {
          // console.log('Insertando compra de curso');
          const cursoDto: CreateComprarCursoDto = {
            id_cupon: product.id_cupon,
            id_estudiante: createCompraDto.id_estudiante,
            id_curso: product.id,
            id_compra: idCompra,
            tipo_moneda: createCompraDto.tipo_moneda,
          };
          // console.log(cursoDto);
          await this.insertarCompraCurso(cursoDto);
        } else {
          throw new BadRequestException('Error no es un curso');
        }
      }
      return { message: 'Se registro la compra exitosamente', idCompra };
    } catch (error) {
      // Verifica si el error es el específico que estás manejando
      if (
        error.message.includes(
          'Esta intentando comprar un producto que ya ha comprado anteriormente. Curso con id 3',
        )
      ) {
        // Retorna un error 400 Bad Request con un mensaje personalizado
        throw new HttpException(
          'Ya has comprado este curso anteriormente',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Si es un error diferente, simplemente lanza la excepción
      throw error;
    }
  }

  async registrarCompra(institucion: string, createCompraDto: CreateCompraDto) {
    try {
      const [productosComprados] = await this.compraRepository.query(
        'Call sp_listar_productos_comprados(?,?)',
        [institucion, createCompraDto.id_estudiante],
      );
      const servicios = productosComprados.map((producto) => ({
        detalleventa_servicio_id: producto.detalleventa_servicio_id,
        detalleventa_tipo_servicio: producto.detalleventa_tipo_servicio,
      }));
      const productos = createCompraDto.productos;

      if (productos.length == 0) {
        throw new Error('No se han proporcionado productos para la compra.');
      }
      // Recorrer la lista de servicios comprados y comparar con los productos del carrito
      for (const product of productos) {
        for (const servicio of servicios) {
          // console.log(
          //   'Id Producto comprado: ' +
          //     servicio.detalleventa_servicio_id +
          //     ' de tipo ' +
          //     servicio.detalleventa_tipo_servicio,
          // );
          // console.log(
          //   'Id Producto en carrito: ' +
          //     product.id +
          //     ' de tipo ' +
          //     product.tipo,
          // );
          if (
            servicio.detalleventa_servicio_id === product.id &&
            servicio.detalleventa_tipo_servicio === product.tipo
          ) {
            // console.log('Entrando a validacion');
            throw new Error(
              'Esta intentando comprar un producto que ya ha comprado anteriormente. ' +
                servicio.detalleventa_tipo_servicio +
                ' con id ' +
                servicio.detalleventa_servicio_id,
            );
          }
        }
      }
      const miCadena = JSON.stringify(createCompraDto.productos);
      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      const impuesto = 0;
      const token =
        createCompraDto.id_estudiante + ' - ' + 'gratuito' + numeroAleatorio;
      const productosArray1 = JSON.parse(miCadena);
      const agregarInstitucion = (producto, institucion) => ({
        ...producto,
        institucion: institucion,
      });

      const productosConInstitucion = productosArray1.map((producto) =>
        agregarInstitucion(producto, institucion),
      );
      const responsableCompra = 'Pasarela';
      const tipoPago = 'Pasarela';
      const cadenanew = JSON.stringify(productosConInstitucion);
      // console.log(productosConInstitucion);
      await this.compraRepository.query(
        'Call sp_registrar_compra_prueba(?,?,?,?,?,?,?,?,?,@ide_compra)',
        [
          createCompraDto.id_estudiante,
          createCompraDto.id_cupon,
          createCompraDto.precio_total,
          createCompraDto.tipo_moneda,
          impuesto,
          token,
          tipoPago,
          responsableCompra,
          cadenanew,
        ],
      );
      const [result] = await this.compraRepository.query(
        'SELECT @ide_compra AS idCompra',
      );
      const idCompra = result.idCompra;
      let productosArray;
      if (result && result.idCompra) {
        const idCompra = result.idCompra;
        const [arrayconvertantes] = await this.compraRepository.query(
          'SELECT compra_productos from tbl_compra where compra_id = ?',
          [idCompra],
        );
        productosArray = JSON.parse(arrayconvertantes.compra_productos);
      } else {
        throw new Error(
          'No se pudo obtener el ID de compra después de registrar la compra.',
        );
      }

      // const getPrecio = (product) =>
      //   createCompraDto.tipo_moneda === 'PEN'
      //     ? product.precio_soles
      //     : createCompraDto.tipo_moneda === 'USD'
      //     ? product.precio_dolar
      //     : null;

      // for (const product of productos) {
      //   switch (product.tipo) {
      //     case 'Curso':
      //       console.log('Insertando compra de curso');
      //       const cursoDto: CreateComprarCursoDto = {
      //         id_cupon: product.id_cupon,
      //         id_estudiante: createCompraDto.id_estudiante,
      //         id_curso: product.id,
      //         id_compra: idCompra,
      //         precio_total: getPrecio(product),
      //         tipo_moneda: createCompraDto.tipo_moneda,
      //       };
      //       console.log(cursoDto);
      //       await this.insertarCompraCurso(cursoDto);
      //       break;

      //     case 'Especializacion':
      //     case 'Promocion':
      //       console.log('Insertando compra de paquete');
      //       const paqueteDto: CreateCompraPaqueteDto = {
      //         id_compra: idCompra,
      //         id_estudiante: createCompraDto.id_estudiante,
      //         id_paquete: product.id,
      //         id_cupon: product.id_cupon,
      //         precio_total: getPrecio(product),
      //         tipo_moneda: createCompraDto.tipo_moneda,
      //       };
      //       console.log(paqueteDto);
      //       await this.insertarCompraPaquete(paqueteDto);
      //       break;

      //     case 'Certificado':
      //       console.log('Insertando compra de certificado');
      //       const certificadoDto: CertificadoCompradoServicio = {
      //         id_estudiante: createCompraDto.id_estudiante,
      //         id_compra: idCompra,
      //         id_certificado: product.id,
      //       };
      //       console.log(certificadoDto);
      //       await this.compraCertificadoService.comprarcertificadoServicio(
      //         institucion,
      //         certificadoDto,
      //       );
      //       break;
      //     // case 'plan':
      //     //   console.log('Insertando compra de certificado');
      //     //   const planDto: CreateCompraPlanDto = {
      //     //     id_estudiante: createCompraDto.id_estudiante,
      //     //     id_plan: product.id,
      //     //     id_compra: idCompra,
      //     //     precio_total: getPrecio(product),
      //     //     tipo_moneda: createCompraDto.tipo_moneda,
      //     //   };
      //     //   console.log(planDto);
      //     //   await this.comprarplan(planDto);
      //     //   break;
      //     default:
      //       console.log('Tipo de producto no identificado.');
      //       break;
      //   }

      // }

      return {
        message: 'Se registro la compra exitosamente',
        idCompra,
        productosArray,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear compra: ' + error.message);
    }
  }

  // async insertarCompraPaquete(createCompraPaqueteDto: CreateCompraPaqueteDto) {
  //   try {
  //     const query = 'CALL sp_insertar_compra_paquete(?,?,?,?,?)';
  //     const parametros = [
  //       createCompraPaqueteDto.id_compra,
  //       createCompraPaqueteDto.id_estudiante,
  //       createCompraPaqueteDto.id_paquete,
  //       createCompraPaqueteDto.id_cupon,
  //       createCompraPaqueteDto.tipo_moneda,
  //     ];
  //     await this.compraRepository.query(query, parametros);

  //     return { message: 'Se registro la compra del plan exitosamente' };
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error al registrar compra de Paquete: ' + error.message);
  //   }
  // }

  // async comprarplan(createCompraPlanDto: CreateCompraPlanDto) {
  //   try {
  //     const query = 'Call sp_insertar_compra_plan(?,?,?,?,?)';
  //     const parametros = [
  //       createCompraPlanDto.id_estudiante,
  //       createCompraPlanDto.id_plan,
  //       createCompraPlanDto.id_compra,
  //       createCompraPlanDto.precio_total,
  //       createCompraPlanDto.tipo_moneda,
  //     ];
  //     await this.compraRepository.query(query, parametros);
  //     return { message: 'Se registro la compra del plan exitosamente' };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al registrar compra de plan: ' + error.message);
  //   }
  // }

  async insertarCompraCurso(createComprarCursoDto: CreateComprarCursoDto) {
    try {
      const query = 'Call sp_insertar_compra_curso(?,?,?,?,?);';
      const parametros = [
        createComprarCursoDto.id_cupon,
        createComprarCursoDto.id_estudiante,
        createComprarCursoDto.id_curso,
        createComprarCursoDto.id_compra,
        createComprarCursoDto.tipo_moneda,
      ];
      //console.log('InsertarCompraCurso' + createComprarCursoDto.precio_total);
      await this.compraRepository.query(query, parametros);

      return { message: 'Se registro la compra del curso exitosamente' };
    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar compra de curso: ' + error.message);
    }
  }

  // async compraRapida(createCompraRapidaDto: CreateCompraRapidaDto) {
  //   try {
  //     const query =
  //       'CALL sp_compra_rapida_servicio(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
  //     const parameters = [
  //       createCompraRapidaDto.id_estudiante,
  //       createCompraRapidaDto.id_servicio,
  //       createCompraRapidaDto.tipo_servicio,
  //       createCompraRapidaDto.impuesto_transaccion_sol,
  //       createCompraRapidaDto.impuesto_transaccion_dolar,
  //       createCompraRapidaDto.token_pasarela,
  //       createCompraRapidaDto.numero_transaccion,
  //       createCompraRapidaDto.id_cupon,
  //       createCompraRapidaDto.tipo_moneda,
  //       createCompraRapidaDto.nombre,
  //       createCompraRapidaDto.imagen,
  //       createCompraRapidaDto.tiempo_acceso,
  //       createCompraRapidaDto.precio_actual_soles,
  //       createCompraRapidaDto.precio_actual_dolares,
  //       createCompraRapidaDto.estudiante_pais,
  //       createCompraRapidaDto.micupon,
  //       createCompraRapidaDto.plan_codigo,
  //     ];
  //     const result = await this.compraRepository.query(query, parameters);

  //     return {
  //       message: 'Compra rápida registrada correctamente',
  //       data: result,
  //     };
  //   } catch (error) {
  //     throw new Error('Error al subir crear compra ' + error.message);
  //   }
  // }
  async productosComprados(
    institucion: string,
    { id_estudiante }: ProductosCompradosDto,
  ) {
    try {
      const [productosComprados] = await this.compraRepository.query(
        'Call sp_listar_productos_comprados(?,?)',
        [institucion, id_estudiante],
      );
      return productosComprados;
    } catch (error) {
      console.log(error);
      throw new Error('Error al listar productos comprados: ' + error.message);
    }
  }

  async precio(precioDtoArray: ProductoDto[]) {
    // try {
    let precioFinal = 0;
    const productosArray = precioDtoArray;
    let array = [];
    let cupones;

    for (const productos of productosArray) {
      const [cupon] = await this.compraRepository.query(
        'CALL sp_listar_cupon_compra(?)',
        [productos.id_cupon],
      );
      //  array.push(cupon[0])
      if (productos.id_cupon > 0) {
        if (productos.tipo_moneda === 'PEN') {
          if (cupon[0].cupon_tipo === 'General') {
            const [result] = await this.compraRepository.query(
              'CALL sp_listar_precios_compra(?,?)',
              [productos.idProducto, productos.tipo],
            );
            const PrecioSoles = result[0].servicio_precio_soles;
            const cuponPorcentaje = parseFloat(cupon[0].cupon_monto_porcentaje);
            const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

            precioFinal = precioFinal + aplicar;
          } else if (
            cupon[0].cupon_tipo === 'Curso' &&
            productos.tipo === 'Curso'
          ) {
            if (cupon[0].servicio_id === productos.idProducto) {
              if (cupon[0].cupon_tipo === productos.tipo) {
                const [result] = await this.compraRepository.query(
                  'CALL sp_listar_precios_compra(?,?)',
                  [productos.idProducto, productos.tipo],
                );

                const PrecioSoles = result[0].servicio_precio_soles;
                const cuponPorcentaje = parseFloat(
                  cupon[0].cupon_monto_porcentaje,
                );
                const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

                precioFinal = precioFinal + aplicar;
              } else {
                throw new BadRequestException(
                  'El cupon no pertenece al tipo de servicio Curso',
                );
              }
            } else {
              throw new BadRequestException(
                'El curso con id ' +
                  productos.idProducto +
                  ' no tiene cupon de descuento',
              );
            }
          } else if (
            cupon[0].cupon_tipo === 'Especializacion' &&
            productos.tipo === 'Especializacion'
          ) {
            if (cupon[0].servicio_id === productos.idProducto) {
              if (cupon[0].cupon_tipo === productos.tipo) {
                const [result] = await this.compraRepository.query(
                  'CALL sp_listar_precios_compra(?,?)',
                  [productos.idProducto, productos.tipo],
                );
                if (
                  result &&
                  result[0] &&
                  result[0].servicio_precio_soles !== null
                ) {
                  const PrecioSoles = result[0].servicio_precio_soles;
                  const cuponPorcentaje = parseFloat(
                    cupon[0].cupon_monto_porcentaje,
                  );
                  const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

                  precioFinal = precioFinal + aplicar;
                } else {
                  throw new BadRequestException(
                    'NO es una especialización el id ' + productos.idProducto,
                  );
                }
              } else {
                throw new BadRequestException(
                  'El cupon no pertenece al tipo de servicio Especializacion',
                );
              }
            } else {
              throw new BadRequestException(
                'La especializacion con id ' +
                  productos.idProducto +
                  ' no tiene cupon de descuento',
              );
            }
          }
        } else if (productos.tipo_moneda === 'USD') {
          if (cupon[0].cupon_tipo === 'General') {
            const [result] = await this.compraRepository.query(
              'CALL sp_listar_precios_compra(?,?)',
              [productos.idProducto, productos.tipo],
            );
            const PrecioSoles = result[0].servicio_precio_dolar;
            const cuponPorcentaje = parseFloat(cupon[0].cupon_monto_porcentaje);
            const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

            precioFinal = precioFinal + aplicar;
          } else if (
            cupon[0].cupon_tipo === 'Curso' &&
            productos.tipo === 'Curso'
          ) {
            if (cupon[0].servicio_id === productos.idProducto) {
              if (cupon[0].cupon_tipo === productos.tipo) {
                const [result] = await this.compraRepository.query(
                  'CALL sp_listar_precios_compra(?,?)',
                  [productos.idProducto, productos.tipo],
                );

                const PrecioSoles = result[0].servicio_precio_dolar;
                const cuponPorcentaje = parseFloat(
                  cupon[0].cupon_monto_porcentaje,
                );
                const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

                precioFinal = precioFinal + aplicar;
              } else {
                throw new BadRequestException(
                  'El cupon no pertenece al tipo de servicio Curso',
                );
              }
            } else {
              throw new BadRequestException(
                'El curso con id ' +
                  productos.idProducto +
                  ' no tiene cupon de descuento',
              );
            }
          } else if (
            cupon[0].cupon_tipo === 'Especializacion' &&
            productos.tipo === 'Especializacion'
          ) {
            if (cupon[0].servicio_id === productos.idProducto) {
              if (cupon[0].cupon_tipo === productos.tipo) {
                const [result] = await this.compraRepository.query(
                  'CALL sp_listar_precios_compra(?,?)',
                  [productos.idProducto, productos.tipo],
                );
                if (
                  result &&
                  result[0] &&
                  result[0].servicio_precio_dolar !== null
                ) {
                  const PrecioSoles = result[0].servicio_precio_dolar;
                  const cuponPorcentaje = parseFloat(
                    cupon[0].cupon_monto_porcentaje,
                  );
                  const aplicar = PrecioSoles - PrecioSoles * cuponPorcentaje;

                  precioFinal = precioFinal + aplicar;
                } else {
                  throw new BadRequestException(
                    'NO es una especialización el id ' + productos.idProducto,
                  );
                }
              } else {
                throw new BadRequestException(
                  'El cupon no pertenece al tipo de servicio Especializacion',
                );
              }
            } else {
              throw new BadRequestException(
                'La especializacion con id ' +
                  productos.idProducto +
                  ' no tiene cupon de descuento',
              );
            }
          }
        }
      } else if (productos.id_cupon === 0) {
        if (productos.tipo_moneda === 'PEN') {
          const [result] = await this.compraRepository.query(
            'CALL sp_listar_precios_compra(?,?)',
            [productos.idProducto, productos.tipo],
          );
          const PrecioSoles = result[0].servicio_precio_soles;
          precioFinal = precioFinal + PrecioSoles;
        } else if (productos.tipo_moneda === 'USD') {
          const [result] = await this.compraRepository.query(
            'CALL sp_listar_precios_compra(?,?)',
            [productos.idProducto, productos.tipo],
          );
          const PrecioDolar = result[0].servicio_precio_dolar;
          precioFinal = precioFinal + PrecioDolar;
        }
      }
    }

    return { PrecioFinal: precioFinal };
    // } catch (error) {
    //   console.error(error);
    //   throw new Error('Error al obtener los precios: ' + error.message);
    // }
  }
}
