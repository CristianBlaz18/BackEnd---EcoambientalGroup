import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificado } from './entities/certificado.entity';
import { CertificadoPagadoDto } from './dto/certificadopagados.dto';
import { SolicitarEnvioCertificado } from './dto/solicitar-envio-certificado.dto';
import { ListarCertificadoAdquirirDto } from './dto/listar-certificado-adquirir.dto';
import { VisualizarDescargaCertificado } from './dto/visualizar-descarga-certificado.dto';
import { ListarEnvioCertificadoDto } from './dto/listar-envio-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
//Se llama a la libreria pdfkit para poder construir el pdf del certificado
const PDFDocument = require('pdfkit');

@Injectable()
export class CertificadoService {
  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepository: Repository<Certificado>,
  ) {}

  async getDetalleCertificado(codigoCertificado: string, institucion: string) {
    try {
      const [certificado] = await this.certificadoRepository.query(
        'CALL sp_validar_certificado(?,?)',
        [codigoCertificado, institucion],
      );
      return certificado;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener detalle de certificado ' + error.message,
      );
    }
  }

  // async habilitarCertificado(
  //   dataHabilitarCertificadoDto: DataHabilitarCertificadoDto,
  // ) {
  //   try {
  //     const query = `CALL sp_habilitar_certificado(?)`;
  //     await this.certificadoRepository.query(query, [
  //       dataHabilitarCertificadoDto,
  //     ]);
  //     return {
  //       message: 'Se registro exitosamente el estado nuevo del progreso',
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'error al subir nuevo estado de progeso ' + error.message,
  //     );
  //   }
  // }

  // async certificadosDisponibles(
  //   institucion: string,
  //   { id_contenido, id_estudiante, tipo }: CertificadoDto,
  // ) {
  //   try {
  //     const [certificados] = await this.certificadoRepository.query(
  //       `CALL sp_listar_certificados_disponibles(?,?,?,?)`,
  //       [institucion, id_contenido, id_estudiante, tipo],
  //     );

  //     return certificados;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al listar los certificados disponibles ' + error.message,
  //     );
  //   }
  // }

  async certificadosPagados(
    institucion: string,
    {
      idContenido,
      idEstudiante,
      tipoContenido,
      idCertificado,
    }: CertificadoPagadoDto,
  ) {
    try {
      //Ejecutar el procedimiento almacenado
      const certificados = await this.certificadoRepository.query(
        `CALL sp_obtener_certificado_cpagado(?,?,?,?,?)`,
        [institucion, idContenido, idEstudiante, tipoContenido, idCertificado],
      );
      return certificados[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al listar los certificados de contenido pagado' + error.message,
      );
    }
  }

  // async datosDescarga(
  //   institucion: string,
  //   { idCertificadoPropio }: DescargaCertificadoDto,
  // ) {
  //   try {
  //     const [certificado] = await this.certificadoRepository.query(
  //       `CALL sp_visualizar_descargar_certificado(?,?)`,
  //       [institucion, idCertificadoPropio],
  //     );
  //     return certificado[0];
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(
  //       'Error al listar los certificados disponibles ' + error.message,
  //     );
  //   }
  // }

  async envioCertificado(
    id_certificadopropio: number,
    solicitarEnvioCertificado: SolicitarEnvioCertificado,
  ) {
    try {
      //Se ejecuta esta consulta SQL para ver si ya existe un envio pendiente de este certificado
      const pendienteCertificadofisico = await this.certificadoRepository.query(
        'SELECT * FROM tbl_enviocertificado WHERE certificadopropio_id = ? and envio_certificado_estado = ?',
        [id_certificadopropio, 0],
      );

      if (pendienteCertificadofisico && pendienteCertificadofisico.length > 0) {
        return {
          message:
            'Ya existe un envio que esta pendiente para este certificado',
        };
      }

      //Ejecutamos el procedimieto almacenado para solicitar envio certificado
      const result = await this.certificadoRepository.query(
        'call sp_solicitar_envio_certificado(?,?,?,?,?,?)',
        [
          id_certificadopropio,
          solicitarEnvioCertificado.departamento,
          solicitarEnvioCertificado.provincia,
          solicitarEnvioCertificado.distrito,
          solicitarEnvioCertificado.direccion,
          solicitarEnvioCertificado.referencia,
        ],
      );

      return result[0];
    } catch (error) {
      throw new Error(
        'Error al subir registrar envio certificado ' + error.message,
      );
    }
  }

  async certificadoAdquirir(
    institucion: string,
    { id_estudiante, tipo_contenido }: ListarCertificadoAdquirirDto,
  ) {
    try {
      //Esta consulta SQL Ayuda a verificar si la institucion ingresada existe o no existe
      const idInstitucion = await this.certificadoRepository.query(
        'SELECT institucion_id FROM tbl_institucion WHERE institucion_nombre=?',
        [institucion],
      );

      if (idInstitucion.length === 0) {
        throw new BadRequestException('No existe la institución ingresada');
      } else {
        //Ejecutamos el procediminto almacenado para listar el erificado por comprar

        const [certificadoadquirir] = await this.certificadoRepository.query(
          'Call sp_listar_servicio_certificados_por_comprar(?,?,?)',
          [institucion, id_estudiante, tipo_contenido],
        );
        //validamos si lo qe deuelve es un array
        if (certificadoadquirir && Array.isArray(certificadoadquirir)) {
          // Primero validamos que sea una especializacion
          if (tipo_contenido === 'Especializacion') {
            //Filtramos que solo se listen los objetos que tengan el progreso y la matricul_progreso 100
            const certificadoResultado = certificadoadquirir.filter(
              (certificado) =>
                certificado.progreso === 100 ||
                certificado.matricula_progreso === '100.00',
            );
            //Mapeamos los datos que se estan filtrando
            const certificadoadquirirMapped = certificadoResultado.map(
              (adquirir: any) => ({
                paquete_id: adquirir.paquete_id,
                paquete_imagen: adquirir.paquete_imagen,
                paquete_nombre: adquirir.paquete_nombre,
                paquete_tipo: adquirir.paquete_tipo,
                detalleventa_fecha_inicio_acceso:
                  adquirir.detalleventa_fecha_inicio_acceso,
                nota_promedio: adquirir.nota_promedio,
                progreso: adquirir.progreso,
                certificados: [],
              }),
            );

            //Creamos un for para recorrer todo el array que tenemos
            for (const certificado of certificadoadquirirMapped) {
              //LLamamos a la funcion para listar los certificados disponibles
              const certificados = await this.listarcertificadosdisponibles(
                institucion,
                certificado.paquete_id,
                id_estudiante,
                tipo_contenido,
              );

              if (Array.isArray(certificados)) {
                //De los certificados disponibles que se esta listando tambien lo vamos a filtrar por adquisicion 0 y que sea de la empresa Ecoambiental --- Esto estaba arriba si no funcion devolver
                const certificadoespecializacion = certificados.filter(
                  (certificado) =>
                    certificado.tipocert_nombre !== 'Empresa Ecoambiental' &&
                    certificado.adquisicion === 0,
                );

                certificado.certificados = certificadoespecializacion.map(
                  (certificado: any) => ({
                    certificado_id: certificado.certificado_id,
                    certificado_descripcion:
                      certificado.certificado_descripcion,
                    certificado_costo_soles:
                      certificado.certificado_costo_soles,
                    certificado_costo_dolares:
                      certificado.certificado_costo_dolares,
                    certificado_horas: certificado.certificado_horas,
                    tipo_servicio: certificado.tipo_servicio,
                    tipocert_id: certificado.tipocert_id,
                    tipocert_nombre: certificado.tipocert_nombre,
                    institucion_id: certificado.institucion_id,
                    institucion_nombre: certificado.institucion_nombre,
                    tipocert_logo: certificado.tipocert_logo,
                    adquisicion: certificado.adquisicion,
                    nota_promedio: certificado.nota_promedio,
                    progreso: certificado.progreso,
                    certificadopropio_id: certificado.certificadopropio_id,
                    fecha_obtencion: certificado.fecha_obtencion,
                    fecha_finmatricula: certificado.fecha_finmatricula,
                    tutor_celular: certificado.tutor_celular,
                  }),
                );
              }
            }
            return certificadoadquirirMapped;

          //Validamos  que el tipo contenido sea Curso
          } else if (tipo_contenido === 'Curso') {
            const certificadoadquirirMapped = certificadoadquirir.map(
              (adquirir: any) => {
                if (adquirir.curso_tipo === 'Pagado') {
                  const certificadoResultado = certificadoadquirir.filter(
                    (certificado) =>
                      certificado.progreso === 100 ||
                      certificado.matricula_progreso === '100.00',
                  );
                  certificadoResultado.filter(
                    (certificado) =>
                      certificado.tipocert_nombre !== 'Empresa Ecoambiental' &&
                      certificado.adquisicion === 0,
                  );
                } else if (adquirir.curso_tipo == 'Gratuito') {
                  certificadoadquirir.filter(
                    (certificado) => certificado.adquisicion === 0,
                  );
                }

                return {
                  curso_id: adquirir.curso_id,
                  curso_imagen: adquirir.curso_imagen,
                  curso_nombre: adquirir.curso_nombre,
                  curso_tipo: adquirir.curso_tipo,
                  matricula_fecha_inscripcion:
                    adquirir.matricula_fecha_inscripcion,
                  matricula_progreso: adquirir.matricula_progreso,
                  matricula_nota_promedio: adquirir.matricula_nota_promedio,
                  certificados: [],
                };
              },
            );

            for (const certificado of certificadoadquirirMapped) {
              const certificados = await this.listarcertificadosdisponibles(
                institucion,
                certificado.curso_id,
                id_estudiante,
                tipo_contenido,
              );

              const certificadocurso = certificados.filter(
                (certificado) => certificado.adquisicion === 0,
              );
              if (Array.isArray(certificadocurso)) {
                certificado.certificados = certificadocurso.map(
                  (certificado: any) => ({
                    certificado_id: certificado.certificado_id,
                    certificado_descripcion:
                      certificado.certificado_descripcion,
                    certificado_costo_soles:
                      certificado.certificado_costo_soles,
                    certificado_costo_dolares:
                      certificado.certificado_costo_dolares,
                    certificado_horas: certificado.certificado_horas,
                    tipo_servicio: certificado.tipo_servicio,
                    tipocert_id: certificado.tipocert_id,
                    tipocert_nombre: certificado.tipocert_nombre,
                    institucion_id: certificado.institucion_id,
                    institucion_nombre: certificado.institucion_nombre,
                    tipocert_logo: certificado.tipocert_logo,
                    adquisicion: certificado.adquisicion,
                    nota_promedio: certificado.nota_promedio,
                    progreso: certificado.progreso,
                    certificadopropio_id: certificado.certificadopropio_id,
                    fecha_obtencion: certificado.fecha_obtencion,
                    fecha_finmatricula: certificado.fecha_finmatricula,
                    tutor_celular: certificado.tutor_celular,
                  }),
                );
              }
            }
            return certificadoadquirirMapped;
          }
        } else {
          return [];
        }
      }
    } catch (error) {
      throw new Error(
        'Error al obtener el listado de certifcado por adquirir' +
          error.message,
      );
    }
  }

  async certificadoAdquirido(
    institucion: string,
    { id_estudiante, tipo_contenido }: ListarCertificadoAdquirirDto,
  ) {
    try {
      const idInstitucion = await this.certificadoRepository.query(
        'SELECT institucion_id FROM tbl_institucion WHERE institucion_nombre=?',
        [institucion],
      );

      if (idInstitucion.length === 0) {
        throw new BadRequestException('No existe la institución ingresada');
      }

      const [certificadoadquirir] = await this.certificadoRepository.query(
        'Call sp_listar_servicio_certificados_adquiridos(?,?,?)',
        [institucion, id_estudiante, tipo_contenido],
      );

      if (certificadoadquirir && Array.isArray(certificadoadquirir)) {
        if (tipo_contenido === 'Especializacion') {
          const certificadoResultado = certificadoadquirir.filter(
            (certificado) => certificado.progreso === 100,
          );

          const certificadoadquirirMapped = await Promise.all(
            certificadoResultado.map(async (adquirir: any) => {
              const certificados = await this.listarcertificadosdisponibles(
                institucion,
                adquirir.paquete_id,
                id_estudiante,
                tipo_contenido,
              );

              let certificadoResult = [];
              console.log(
                'Certificados después del filtrado:',
                adquirir.curso_id,
              );
              console.log(adquirir.adquisicion);
              if (Array.isArray(certificados)) {
                const certiresult = certificados.filter(
                  (certi) => certi.adquisicion === 1,
                );
                certificadoResult = certiresult.map((certificado: any) => {
                  return {
                    certificado_id: certificado.certificado_id,
                    certificado_descripcion:
                      certificado.certificado_descripcion,
                    certificado_costo_soles:
                      certificado.certificado_costo_soles,
                    certificado_costo_dolares:
                      certificado.certificado_costo_dolares,
                    certificado_horas: certificado.certificado_horas,
                    tipo_servicio: certificado.tipo_servicio,
                    tipocert_id: certificado.tipocert_id,
                    tipocert_nombre: certificado.tipocert_nombre,
                    institucion_id: certificado.institucion_id,
                    institucion_nombre: certificado.institucion_nombre,
                    tipocert_logo: certificado.tipocert_logo,
                    adquisicion: certificado.adquisicion,
                    nota_promedio: certificado.nota_promedio,
                    progreso: certificado.progreso,
                    certificadopropio_id: certificado.certificadopropio_id,
                    fecha_obtencion: certificado.fecha_obtencion,
                    fecha_finmatricula: certificado.fecha_finmatricula,
                    tutor_celular: certificado.tutor_celular,
                  };
                });
              }

              return {
                paquete_id: adquirir.paquete_id,
                paquete_imagen: adquirir.paquete_imagen,
                paquete_nombre: adquirir.paquete_nombre,
                paquete_tipo: adquirir.paquete_tipo,
                detalleventa_fecha_inicio_acceso:
                  adquirir.detalleventa_fecha_inicio_acceso,
                nota_promedio: adquirir.nota_promedio,
                progreso: adquirir.progreso,
                certificados: certificadoResult,
              };
            }),
          );

          return certificadoadquirirMapped;
        }

        if (tipo_contenido === 'Curso') {
          const certificadoadquirirMapped = [];

          for (const adquirir of certificadoadquirir) {
            const certificados = await this.listarcertificadosdisponibles(
              institucion,
              adquirir.curso_id,
              id_estudiante,
              tipo_contenido,
            );

            let certificadoResult = [];
            if (Array.isArray(certificados)) {
              if (
                adquirir.curso_tipo === 'Pagado' &&
                adquirir.matricula_progreso === '100.00'
              ) {
                certificadoResult = certificados.filter(
                  (certificado) =>
                    (certificado.tipocert_nombre !== 'Empresa Ecoambiental' &&
                      certificado.adquisicion === 1) ||
                    (certificado.tipocert_nombre === 'Empresa Ecoambiental' &&
                      (certificado.adquisicion === 1 ||
                        certificado.adquisicion === 0)),
                );
              } else if (adquirir.curso_tipo === 'Gratuito') {
                certificadoResult = certificados.filter(
                  (certificado) => certificado.adquisicion === 1,
                );
              }

              certificadoResult = certificadoResult.map((certificado: any) => {
                return {
                  certificado_id: certificado.certificado_id,
                  certificado_descripcion: certificado.certificado_descripcion,
                  certificado_costo_soles: certificado.certificado_costo_soles,
                  certificado_costo_dolares:
                    certificado.certificado_costo_dolares,
                  certificado_horas: certificado.certificado_horas,
                  tipo_servicio: certificado.tipo_servicio,
                  tipocert_id: certificado.tipocert_id,
                  tipocert_nombre: certificado.tipocert_nombre,
                  institucion_id: certificado.institucion_id,
                  institucion_nombre: certificado.institucion_nombre,
                  tipocert_logo: certificado.tipocert_logo,
                  adquisicion: certificado.adquisicion,
                  nota_promedio: certificado.nota_promedio,
                  progreso: certificado.progreso,
                  certificadopropio_id: certificado.certificadopropio_id,
                  fecha_obtencion: certificado.fecha_obtencion,
                  fecha_finmatricula: certificado.fecha_finmatricula,
                  tutor_celular: certificado.tutor_celular,
                };
              });
            }
            // Verifica si hay certificados antes de agregar a certificadoadquirirMapped
            if (certificadoResult.length > 0) {
              certificadoadquirirMapped.push({
                curso_id: adquirir.curso_id,
                curso_imagen: adquirir.curso_imagen,
                curso_nombre: adquirir.curso_nombre,
                curso_tipo: adquirir.curso_tipo,
                matricula_fecha_inscripcion:
                  adquirir.matricula_fecha_inscripcion,
                matricula_progreso: adquirir.matricula_progreso,
                matricula_nota_promedio: adquirir.matricula_nota_promedio,
                certificados: certificadoResult,
              });
            }
          }

          return certificadoadquirirMapped;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        'Error al obtener el listado de certifcado por adquirir' +
          error.message,
      );
    }
  }

  async listarcertificadosdisponibles(
    institucion: string,
    id_contenido: number,
    id_estudiante: number,
    tipo_contenido: string,
  ) {
    const certificadodisponibles = await this.certificadoRepository.query(
      'call sp_listar_certificados_disponibles(?,?,?,?)',
      [institucion, id_contenido, id_estudiante, tipo_contenido],
    );
    return certificadodisponibles[0];
  }

  //Visualizar datos para descargar certificado
  async visualizarDescargaCertificado(
    institucion: string,
    visualizarDescargaCertificado: VisualizarDescargaCertificado,
  ) {
    try {
      const result = await this.certificadoRepository.query(
        'CALL sp_visualizar_descargar_certificado(?,?,?,@mensaje);',
        [
          institucion,
          visualizarDescargaCertificado.idCertificado,
          visualizarDescargaCertificado.idEstudiante,
        ],
      );

      const mensaje = await this.certificadoRepository.query(
        'SELECT @mensaje as mensaje',
      );

      if (result && result.length > 0 && result[0].length > 0) {
        return { result: result[0][0] };
      } else if (mensaje.length > 0 && mensaje[0].mensaje) {
        return { mensaje: mensaje[0].mensaje };
      } else {
        return { mensaje: 'No se obtuvo ningún resultado o mensaje.' };
      }
    } catch (error) {
      throw new Error('Error al visualizar los certificados: ' + error.message);
    }
  }

  /*async obtenerPagado(
    institucion: string,
    {
      idServicio,
      idEstudiante,
      tipo,
      idCertificado,
    }: ObtenerCertificadoPagado,
  ) {
    try {
      const result = await this.certificadoRepository.query(
        'CALL sp_obtener_certificado_cpagado(?,?,?,?,?,@mensaje)',
        [institucion, idServicio, idEstudiante, tipo, idCertificado],
      );

      const mensaje = await this.certificadoRepository.query(
        'SELECT @mensaje as mensaje',
      );

      if (result[0].length > 0) {
        console.log('Retornando result:', result[0][0]);
        return { result: result[0][0] };

      } else {
        return { mensaje: mensaje[0] };
      }

    } catch (error) {
      console.error('Error al obtener los certificados pagados', error);
      throw new Error('Error al obtener los certificados pagados');
    }
  }*/

  async listarEnvioCertificado({
    id_estudiante,
    id_certificado,
  }: ListarEnvioCertificadoDto) {
    try {
      const listarenviocertificado = await this.certificadoRepository.query(
        'call sp_listar_envio_certificado(?,?)',
        [id_estudiante, id_certificado],
      );
      return listarenviocertificado[0];
    } catch (error) {
      throw new Error('Error al listar envio certificado');
    }
  }

  async generarPDFURL(
    institucion: string,
    idCertificado: number,
    idEstudiante: number,
  ): Promise<Buffer> {
    //Inicializamos las variables que vamos a utilizar en el certificado
    let nombres = '';
    let curso = '';
    let nota = '';
    let numDoc = '';
    let emision = '';
    let codigo = '';
    let urlPortada = '';
    let urlContraportada = '';
    let horas = '';
    //construirmos una funcion para hacer una consulta a una api para obtener datos del certificado
    const fetchDataFromApi = async (
      baseUrl: string,
      params: Record<string, string>,
      queryParams: Record<string, string>,
    ): Promise<any> => {
      const pathParams = Object.keys(params).reduce((acc, key) => {
        return acc.replace(`:${key}`, params[key]);
      }, baseUrl);

      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${pathParams}?${queryString}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error al obtener datos de la API. Código de estado: ${response.status}`,
        );
      }

      return await response.json();
    };

    try {
      const baseUrl =
        'https://back.ingenieropro.com/api/v1/certificado/visualizar/:tipoCertificado';
      const params = {
        institucion: institucion,
      };
      const queryParams = {
        idCertificado: idCertificado.toString(),
        idEstudiante: idEstudiante.toString(),
      };
      //se llama a la funcion para obtener los datos de la api
      const apiData = await fetchDataFromApi(baseUrl, params, queryParams);
      //se asignan los datos obtenidos de la api a las variables
      nombres = apiData.result.nombre_estudiantes;
      curso = apiData.result.curso_nombre;
      numDoc = apiData.result.usuario_carnet_identidad;
      nota = apiData.result.nota_promedio;
      emision = apiData.result.certificadopropio_fecha_creacion;
      codigo = apiData.result.certificadopropio_codigo;
      urlPortada = apiData.result.certificado_imagen_portada;
      urlContraportada = apiData.result.certificado_imagen_temario;
      horas = apiData.result.certificado_horas;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener datos de la API: ' + error.message);
    }
    //Se construye el certificado
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        bufferPages: true,
      });
      //Se construye la funcion para agregar la imagen del certificado
      const addImageFromUrl = async (
        url: string,
        options: {
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        } = {},
      ) => {
        return new Promise<void>((resolveImage) => {
          const requestModule = url.startsWith('https://')
            ? httpsRequest
            : httpRequest;

          const req = requestModule(url, (response) => {
            let chunks: Uint8Array[] = [];

            response.on('data', (chunk: Uint8Array) => {
              chunks.push(chunk);
            });

            response.on('end', () => {
              const imageBuffer = Buffer.concat(chunks);
              doc.image(imageBuffer, options);
              resolveImage();
            });
          });

          req.end();
        });
      };
      //Se agrega la imagen de la portada del certificado
      addImageFromUrl(urlPortada, {
        x: 0,
        y: 0,
        width: doc.page.width,
        height: doc.page.height,
      }).then(() => {
        const nombreCertificado = (
          texto: string,
          fontSize: number,
          y: number,
          width?: number,
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('black')
            .font('fonts/Stash Regular.otf')
            .text(
              texto,
              {
                align: 'center',
                width: width ? width.toString() : undefined,
              },
              y,
            );
        };
        //Se construye la funcion para agregar el texto al certificado
        const infoCertificado = (
          texto: string,
          fontSize: number,
          y: number,
          width?: number, // Add width parameter
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('black')
            .font('fonts/Poppins-Regular.ttf')
            .text(
              texto,
              {
                align: 'center',
                width: width ? width.toString() : undefined, // Convert width to string if present
              },
              y,
            );
        };

        const horasCertificado = (
          texto: string,
          fontSize: number,
          y: number,
          width?: number, // Add width parameter
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('black')
            .font('fonts/Poppins-SemiBold.ttf')
            .text(
              texto,
              {
                align: 'center',
                width: width ? width.toString() : undefined, // Convert width to string if present
              },
              y,
            );
        };

        const cursoCertificado = (
          texto: string,
          fontSize: number,
          y: number,
          width?: number, // Add width parameter
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('black')
            .font('fonts/Poppins-SemiBold.ttf')
            .text(
              texto,
              {
                align: 'center',
                width: width ? width.toString() : undefined, // Convert width to string if present
              },
              y,
            );
        };

        const codigoCertificado = (
          texto: string,
          fontSize: number,
          x: number,
          y: number,
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('#F9DB5C')
            .font('fonts/Poppins-Medium.ttf')
            .text(texto, x, y);
        };
        //Se corrige el nombre para que la primera letra de cada palabra sea mayuscula
        const nombresCorreccion = nombres
          .split(' ')
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ');
        //Se corrige la fecha de emision para que se muestre en el formato correcto
        const emisionCorreccion = new Date(emision);
        const year = emisionCorreccion.getFullYear();
        const month = String(emisionCorreccion.getMonth() + 1).padStart(2, '0');
        const day = String(emisionCorreccion.getDate()).padStart(2, '0');
        const emisionCorreccionFinal = `${year}-${month}-${day}`;
        //Se valida la cantidad de caracteres del nombre para que se pueda centrar y disminuir el tamaño de la letra
        if (nombresCorreccion.length > 35) {
          nombreCertificado(nombresCorreccion, 35, 193);
        } else {
          nombreCertificado(nombresCorreccion, 40, 195);
        }
        //Se colocan los datos en el certificado
        cursoCertificado('"' + curso + '"', 14, 273);
        horasCertificado(horas + ' horas académicas', 14, 318);
        infoCertificado('Identificacion del alumno: ' + numDoc, 11, 350);
        infoCertificado('Promedio Final: ' + nota + '/20', 11, 365);
        infoCertificado('Fecha de emisión: ' + emisionCorreccionFinal, 11, 380);
        //Se valida la cantidad de caracteres del codigo para que se pueda centrar y disminuir el tamaño de la letra
        if (codigo.length > 20) {
          codigoCertificado(codigo, 10, 371, 64);
        } else {
          codigoCertificado(codigo, 12, 375, 62);
        }
        //Se añade la pagina trasera el certificado
        doc.addPage();
        const atrasCodigoCertificado = (
          texto: string,
          fontSize: number,
          x: number,
          y: number,
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('#F9DB5C')
            .font('fonts/Poppins-Medium.ttf')
            .text(texto, x, y);
        };

        const atrasHorasCertificado = (
          texto: string,
          fontSize: number,
          x: number,
          y: number,
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('#474747')
            .font('fonts/Poppins-Bold.ttf')
            .text(texto, x, y);
        };

        const atrasCursoCertificado = (
          texto: string,
          fontSize: number,
          x: number,
          y: number,
          width?: number, // Add width parameter
        ) => {
          doc
            .fontSize(fontSize)
            .fillColor('white')
            .font('fonts/Poppins-SemiBold.ttf')
            .text(texto, x, y, {
              align: 'center',
              width: width ? width.toString() : undefined,
            });
        };
        //Se agrega la imagen de la contraportada del certificado
        addImageFromUrl(urlContraportada, {
          x: 0,
          y: 0,
          width: doc.page.width,
          height: doc.page.height,
        }).then(() => {
          const buffer = [];
          doc.on('data', buffer.push.bind(buffer));
          doc.on('end', () => {
            const data = Buffer.concat(buffer);
            resolve(data);
          });
          //Se valida la cantidad de caracteres del codigo para que se pueda centrar y disminuir el tamaño de la letra
          if (codigo.length > 20) {
            atrasCodigoCertificado(codigo, 10, 371, 40);
          } else {
            atrasCodigoCertificado(codigo, 12, 375, 39);
          }
          //Se valida la cantidad de caracteres del nombre para que se pueda centrar y disminuir el tamaño de la letra G
          atrasHorasCertificado(horas, 36, 165, 83);
          if (curso.length > 31) {
            atrasCursoCertificado('"' + curso + '"', 14, 355, 82, 375);
          } else {
            atrasCursoCertificado('"' + curso + '"', 19, 355, 90, 375);
          }

          doc.end();
        });
      });
    });

    return pdfBuffer;
  }

  async actualizarDeseoCertificado(UpdateCertificadoDto: UpdateCertificadoDto) {
    try {
      const [deseo] = await this.certificadoRepository.query(
        'CALL sp_registrar_deseo_certificado(?,?,?)',
        [
          UpdateCertificadoDto.idEstudiante,
          UpdateCertificadoDto.idCurso,
          UpdateCertificadoDto.respuesta,
        ],
      );
      return deseo[0];
    } catch (error) {
      console.log(error);
      throw new BadRequestException('No se pudo actualizar');
    }
  }
}
