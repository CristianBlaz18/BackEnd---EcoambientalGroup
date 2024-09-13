import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
const Openpay1 = require('openpay');
import { Openpay } from './entities/openpay.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompraPaqueteDto } from './dto/create-compra-paquete.dto';
import { CertificadoCompradoServicio } from './dto/certificado-comprado-servicio.dto';
import { CreateComprarCursoDto } from './dto/create-insertar-compra-curso.dto';
import { CompraCertificadoService } from 'src/compra-certificado/compra-certificado.service';
import { HttpService } from '@nestjs/axios';
import { ChargeDto } from './dto/charge.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class OpenpayService {
  //Credenciales Produccion Ecoambiental

  
  
  private readonly openPayUrlProdPEN = 'https://api.openpay.pe/v1/';
  private readonly merchantIdProdPEN = 'mmw46fsubf7hbne2rwxa';
  private readonly apiKeyProdPEN = 'sk_97447d56f1924fc1847bbb98f81be23a';

  private readonly openPayUrlProdUSD = 'https://api.openpay.pe/v1/';
  private readonly merchantIdProdUSD = 'mwmnctcnpmj4nnpoyopq';
  private readonly apiKeyProdUSD = 'sk_d14c808d88e74e55b990778c2c769f93';

  // Credenciales SandBox
  private readonly openPayUrlPruebaPEN = 'https://sandbox-api.openpay.pe/v1/';
  private readonly merchantIdPruebaPEN = 'm18s8egxw1wkqn6avebt';
  private readonly apiKeyPruebaPEN = 'sk_09bcad15001549e4b20b117d6e820e67';

  private readonly merchantIdPruebaUSD ='mel0pxctydg7irforyn3'
  private readonly openPayUrlPruebaUSD = 'https://sandbox-api.openpay.pe/v1/';
  private readonly apiKeyPruebaUSD = 'sk_ebd88bad1eea4447af8b4358ffd89da2';
  private openpay: any;
  private completedStatuses: any[] = [];
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private compraCertificadoService: CompraCertificadoService,
    @InjectRepository(Openpay)
    private openpayRepositori: Repository<Openpay>,
  ) {
    // Inicializa la instancia de Openpay en el constructor
    // this.openpay = new Openpay1(this.merchantIdPruebaPEN, this.apiKeyPruebaPEN, false);
    // El último parámetro indica que es en modo sandbox
  }
  async pruebaCrearCargo(institucion: string, chargeDto: ChargeDto): Promise<any> {

    

    if(institucion === 'Ecoambiental'  ){
      let openPayUrl: string;
      let merchantId: string;
      let apiKey: string;
    
      if (chargeDto.currency === 'PEN') {
        openPayUrl = this.openPayUrlPruebaPEN;
        merchantId = this.merchantIdPruebaPEN;
        apiKey = this.apiKeyPruebaPEN;
      } else if (chargeDto.currency === 'USD') {
        openPayUrl = this.openPayUrlPruebaUSD;
        merchantId = this.merchantIdPruebaUSD;
        apiKey = this.apiKeyPruebaUSD;
      } else {
        throw new BadRequestException('Moneda no válida');
      }
    
      const url = `${openPayUrl}${merchantId}/checkouts`;
    
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      };
    
      const payload = {
        amount: chargeDto.amount,
        currency: chargeDto.currency,
        description: chargeDto.description,
        redirect_url: chargeDto.redirect_url,
        order_id: chargeDto.order_id,
        expiration_date: chargeDto.expiration_date,
        send_email: chargeDto.send_email,
        customer: {
          name: chargeDto.customer.name,
          last_name: chargeDto.customer.last_name,
          phone_number: chargeDto.customer.phone_number,
          email: chargeDto.customer.email,
        },
      };
    
      try {
        const response = await this.httpService
          .post(url, payload, { headers })
          .toPromise();
        return response.data;
      } catch (error) {
        throw new InternalServerErrorException('Error al crear el cargo en OpenPay');
      }
    }else if(institucion === 'Ghamec'){
      return {mensaje:"Todavia no xiste para Ghamec vuelve otro dia mongol."}
    }else if(institucion === 'Acm Ingenieros'){
      return {mensaje:"Todavia no xiste para Acm Ingenieros vuelve otro dia mongol."}
    }
    
  }

  async crearCargo(institucion: string,chargeDto: ChargeDto): Promise<any> {
    
    if(institucion === 'Ecoambiental'  ){
      let openPayUrl: string;
      let merchantId: string;
      let apiKey: string;
    
      if (chargeDto.currency === 'PEN') {
        openPayUrl = this.openPayUrlProdPEN;
        merchantId = this.merchantIdProdPEN ;
        apiKey = this.apiKeyProdPEN;
      } else if (chargeDto.currency === 'USD') {
        openPayUrl = this.openPayUrlProdUSD;
        merchantId = this.merchantIdProdUSD;
        apiKey = this.apiKeyProdUSD;
      } else {
        throw new HttpException('Moneda no válida', HttpStatus.BAD_REQUEST);
        
      }

      

      const url = `${openPayUrl}${merchantId}/checkouts`;
      
      // Puedes agregar encabezados, parámetros, etc., según las necesidades de la API de OpenPay
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      };

      // Aquí debes utilizar el DTO que se pasa como parámetro
      const payload = {
        amount: chargeDto.amount,
        currency: chargeDto.currency,
        description: chargeDto.description,
        redirect_url: chargeDto.redirect_url,
        order_id: chargeDto.order_id,
        expiration_date: chargeDto.expiration_date, // Asegúrate de formatear la fecha correctamente
        send_email: chargeDto.send_email,
        customer: {
          name: chargeDto.customer.name,
          last_name: chargeDto.customer.last_name,
          phone_number: chargeDto.customer.phone_number,
          email: chargeDto.customer.email,
        },
      };

      try {
        const response = await this.httpService
          .post(url, payload, { headers })
          .toPromise();
        return response.data;
      } catch (error) {
        throw new InternalServerErrorException('Error al crear el cargo en OpenPay');
      }
    }else if(institucion === 'Ghamec'){
      return {mensaje:"Todavia no xiste para Ghamec vuelve otro dia mongol."}
    }else if(institucion === 'Acm Ingenieros'){
      return {mensaje:"Todavia no xiste para Acm Ingenieros vuelve otro dia mongol."}
    }
  }
  

  async getWebhook(): Promise<any> {
    const url = `${this.openPayUrlProdUSD}${this.merchantIdProdUSD}/checkouts`;

    // Puedes agregar encabezados, parámetros, etc., según las necesidades de la API de OpenPay
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${this.apiKeyProdUSD}:`).toString(
        'base64',
      )}`,
    };

    // Realiza la solicitud HTTP usando el método get del HttpService
    const response = await this.httpService.get(url, { headers }).toPromise();

    return response.data; // Esto dependerá del formato de respuesta de la API de OpenPay
  }

  async handleWebhook(payload, res) {
    try {
      const { type, transaction } = payload;
      switch (type) {
        case 'charge.created':
          
          console.log('Webhook payload:', payload);
          console.log('EL Cargo se ha creado');
          const idCompraCreated= transaction.order_id;
          const transaccion = transaction.id;
          const tipoCreated = type;
          await this.openpayRepositori.query('CALL sp_actualizar_id_transaccion_compra(?,?)',[transaccion,idCompraCreated])
          const [datosCreate] = await this.openpayRepositori.query('CALL admin_sp_listar_correo_institucion_compra(?)',[
            idCompraCreated
          ])
          await this.enviarCorreoOpenpay(datosCreate[0].institucion_nombre,datosCreate[0].usuario_correo,tipoCreated)
          break;
        case 'charge.pending':
          console.log('Webhook payload:', payload);
          console.log('El cargo está pendiente');
          const idCompraPending = transaction.order_id;
          const tipoPending = type;
          const [datosPending] = await this.openpayRepositori.query('CALL admin_sp_listar_correo_institucion_compra(?)',[
            idCompraPending
          ])
          await this.enviarCorreoOpenpay(datosPending[0].institucion_nombre,datosPending[0].usuario_correo,tipoPending)
          break;
        case 'charge.succeeded':
          console.log('Webhook payload:', payload);
          const idCompraSucceeded= transaction.order_id;
          const tipoSucceeded = type;
          const [datosSucceeded] = await this.openpayRepositori.query('CALL admin_sp_listar_correo_institucion_compra(?)',[
            idCompraSucceeded
          ])
          await this.enviarCorreoOpenpay(datosSucceeded[0].institucion_nombre,datosSucceeded[0].usuario_correo,tipoSucceeded)
          if (transaction.payment_method.type === 'redirect') {
            let productosArray;
            const impuesto = transaction.fee.tax;
            const fecha =transaction.operation_date;
            
            const precioTotal = transaction.amount;
            const preciofinal = precioTotal - (impuesto * precioTotal) / 100;
            const idCompra1 = transaction.order_id;
            await this.openpayRepositori.query(
              'CALL sp_update_tbl_compra_prueba(?,?,?,?,?)',
              [idCompra1, impuesto, transaction.id, preciofinal,fecha],
            );
            const [arrayconvertantes] = await this.openpayRepositori.query(
              'SELECT compra_productos,compra_tipo_moneda,estudiante_id from tbl_compra where compra_id = ?',
              [idCompra1],
            );
            productosArray = JSON.parse(arrayconvertantes.compra_productos);
            const productos1 = productosArray;
            console.log(productosArray);

            const getPrecio = (product) =>
              arrayconvertantes.compra_tipo_moneda === 'PEN'
                ? product.precio_soles
                : arrayconvertantes.compra_tipo_moneda === 'USD'
                ? product.precio_dolar
                : null;
            for (const product of productos1) {
              switch (product.tipo) {
                case 'Curso':
                  console.log('Insertando compra de curso');
                  const cursoDto: CreateComprarCursoDto = {
                    id_cupon: product.id_cupon,
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_curso: product.id,
                    id_compra: idCompra1,
                    tipo_moneda: arrayconvertantes.compra_tipo_moneda,
                  };
                  console.log(cursoDto);
                  await this.insertarCompraCurso(cursoDto);
                  break;

                case 'Especializacion':
                case 'Promocion':
                  console.log('Insertando compra de paquete');
                  const paqueteDto: CreateCompraPaqueteDto = {
                    id_compra: idCompra1,
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_paquete: product.id,
                    id_cupon: product.id_cupon,
                    tipo_moneda: arrayconvertantes.compra_tipo_moneda,
                  };
                  console.log(paqueteDto);
                  await this.insertarCompraPaquete(paqueteDto);
                  break;

                case 'Certificado':
                  console.log('Insertando compra de certificado');
                  const certificadoDto: CertificadoCompradoServicio = {
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_compra: idCompra1,
                    id_certificado: product.id,
                  };
                  console.log(certificadoDto);
                  await this.compraCertificadoService.comprarcertificadoServicio(
                    product.institucion,
                    certificadoDto,
                  );

                  break;
                // case 'plan':
                //   console.log('Insertando compra de certificado');
                //   const planDto: CreateCompraPlanDto = {
                //     id_estudiante: createCompraDto.id_estudiante,
                //     id_plan: product.id,
                //     id_compra: idCompra,
                //     precio_total: getPrecio(product),
                //     tipo_moneda: createCompraDto.tipo_moneda,
                //   };
                //   console.log(planDto);
                //   await this.comprarplan(planDto);
                //   break;
                default:
                  console.log('Tipo de producto no identificado.');
                  break;
              }
            }
          } else if (transaction.payment_method.type === 'store') {
            let productosArray2;
            const impuesto = 0;
            const fecha =transaction.operation_date;
            const idCompra2 = transaction.order_id;
            const precioTotal = transaction.amount;
            await this.openpayRepositori.query(
              'CALL sp_update_tbl_compra_prueba(?,?,?,?,?)',
              [idCompra2, impuesto, transaction.id, precioTotal,fecha],
            );
            
            const tipo = 'pasarela';
            const [arrayconvertantes] = await this.openpayRepositori.query(
              'SELECT compra_productos,compra_tipo_moneda,estudiante_id from tbl_compra where compra_id = ?',
              [idCompra2],
            );
            productosArray2 = JSON.parse(arrayconvertantes.compra_productos);
            const productos2 = productosArray2;
            console.log(productosArray2);

            const getPrecio = (product) =>
              arrayconvertantes.compra_tipo_moneda === 'PEN'
                ? product.precio_soles
                : arrayconvertantes.compra_tipo_moneda === 'USD'
                ? product.precio_dolar
                : null;

            for (const product of productos2) {
              switch (product.tipo) {
                case 'Curso':
                  console.log('Insertando compra de curso');
                  const cursoDto: CreateComprarCursoDto = {
                    id_cupon: product.id_cupon,
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_curso: product.id,
                    id_compra: idCompra2,
                    tipo_moneda: arrayconvertantes.compra_tipo_moneda,
                  };
                  console.log(cursoDto);
                  await this.insertarCompraCurso(cursoDto);
                  break;

                case 'Especializacion':
                case 'Promocion':
                  console.log('Insertando compra de paquete');
                  const paqueteDto: CreateCompraPaqueteDto = {
                    id_compra: idCompra2,
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_paquete: product.id,
                    id_cupon: product.id_cupon,

                    tipo_moneda: arrayconvertantes.compra_tipo_moneda,
                  };
                  console.log(paqueteDto);
                  await this.insertarCompraPaquete(paqueteDto);
                  break;

                case 'Certificado':
                  console.log('Insertando compra de certificado');
                  const certificadoDto: CertificadoCompradoServicio = {
                    id_estudiante: arrayconvertantes.estudiante_id,
                    id_compra: idCompra2,
                    id_certificado: product.id,
                  };
                  console.log(certificadoDto);
                  await this.compraCertificadoService.comprarcertificadoServicio(
                    product.institucion,
                    certificadoDto,
                  );

                  break;
                // case 'plan':
                //   console.log('Insertando compra de certificado');
                //   const planDto: CreateCompraPlanDto = {
                //     id_estudiante: createCompraDto.id_estudiante,
                //     id_plan: product.id,
                //     id_compra: idCompra,
                //     precio_total: getPrecio(product),
                //     tipo_moneda: createCompraDto.tipo_moneda,
                //   };
                //   console.log(planDto);
                //   await this.comprarplan(planDto);
                //   break;
                default:
                  console.log('Tipo de producto no identificado.');
                  break;
              }
            }
          }

          break;
        case 'charge.failed':
          console.log('Webhook payload:', payload);
          console.log('El cargo Fallo');
          const idCompraFailed= transaction.order_id;
          const tipoFailed = type;
          const [datosFailed] = await this.openpayRepositori.query('CALL admin_sp_listar_correo_institucion_compra(?)',[
            idCompraFailed
          ])
          await this.enviarCorreoOpenpay(datosFailed[0].institucion_nombre,datosFailed[0].usuario_correo,tipoFailed)
        default:
          break;
      }

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  async enviarCorreoOpenpay(institucion: string, correo: string, tipo: string) {
    try {
        let templatePath: string;
        let tipoCompra:string;

        const [verificarinstitucion] = await this.openpayRepositori.query('CALL sp_validar_institucion(?)', [institucion]);
        if (!verificarinstitucion || verificarinstitucion.length === 0 || verificarinstitucion[0].resultado === 0) {
            throw new BadRequestException('La institucion no existe');
        } else {
            if (tipo === 'charge.created') {
              console.log("Estamos en create")
                templatePath = path.join(
                    __dirname,
                    'correoCreado',
                    'correoCreado.html',
                );
                tipoCompra = "Creado"

            } else if (tipo === 'charge.pending') {
              console.log("Estamos en pending")
                templatePath = path.join(
                    __dirname,
                    'correoPendiente',
                    'correoPendiente.html',
                );
                tipoCompra = "Pendiente"

            } else if (tipo === 'charge.succeeded') {
              console.log("Estamos en succeeded")
                templatePath = path.join(
                    __dirname,
                    'correoCompletado',
                    'correoCompletado.html',
                );

                tipoCompra = "Completado"

            } else if (tipo === 'charge.failed') {
              console.log("Estamos en failed")
                templatePath = path.join(
                    __dirname,
                    'correoFallido',
                    'correoFallido.html',
                );
                tipoCompra = "Rechazado"
            }

            // Cargar el template
            const institucionNombre = verificarinstitucion[0].institucion_nombre;
            const institucionLogo = verificarinstitucion[0].institucion_logo;
            const templateSource = fs.readFileSync(templatePath, 'utf-8');
            // Compilar el template
            const template = Handlebars.compile(templateSource);
            const html = template({ tipoCompra, institucionNombre, institucionLogo });
            // Enviar el correo
            await this.mailerService.sendMail({
                to: correo,
                subject: `Estado Compra - ${institucion}`,
                html: html,
            });
            return { mensaje: 'Correo enviado correctamente' };
        }

    } catch (error) {
        console.log(error);
        throw new Error('Error al enviar el correo: ' + error.message);
    }
  }

  async insertarCompraPaquete(createCompraPaqueteDto: CreateCompraPaqueteDto) {
    try {
      const query = 'CALL sp_insertar_compra_paquete(?,?,?,?,?)';
      const parametros = [
        createCompraPaqueteDto.id_compra,
        createCompraPaqueteDto.id_estudiante,
        createCompraPaqueteDto.id_paquete,
        createCompraPaqueteDto.id_cupon,
        createCompraPaqueteDto.tipo_moneda,
      ];
      await this.openpayRepositori.query(query, parametros);

      return { message: 'Se registro la compra del plan exitosamente' };
    } catch (error) {
      console.error(error);
      throw new Error('Error al registrar compra de Paquete: ' + error.message);
    }
  }

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
  //     await this.openpayRepositori.query(query, parametros);
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
      await this.openpayRepositori.query(query, parametros);

      return { message: 'Se registro la compra del curso exitosamente' };
    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar compra de curso: ' + error.message);
    }
  }

  async datos() {
    const idCompra2 = 1332;
    let productosArray;
    const [arrayconvertantes] = await this.openpayRepositori.query(
      'SELECT compra_productos,compra_tipo_moneda,estudiante_id from tbl_compra where compra_id = ?',
      [idCompra2],
    );
    productosArray = JSON.parse(arrayconvertantes.compra_productos);
    const productos2 = productosArray;
    console.log(productosArray);
    return productos2;
  }
}
