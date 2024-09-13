import { BadRequestException, Injectable } from '@nestjs/common';
import { Docente } from './entities/docente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { ValidarNumeroDocumentoDto } from './dto/validar-numero-documento.dto';
import { CreateDocenteDto } from './dto/create-docente.dto';

@Injectable()
export class DocenteService {
  constructor(
    @InjectRepository(Docente)
    private docenteRepository: Repository<Docente>,
  ) {}

  async docentes(institucion: string) {
    try {
      const [docentes] = await this.docenteRepository.query(
        `Call sp_listar_docente_institucion(?)`,
        [institucion],
      );
      return docentes;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar el listado de docentes de la institucion ' +
          error.message,
      );
    }
  }

  async docenteDetalle(idDoc: number, institucion: string) {
    try {
      const [docente] = await this.docenteRepository.query(
        'Call sp_listar_docente_detalle(?,?)',
        [idDoc, institucion],
      );
      return docente;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al mostrar los detalles del docente ' + error.message,
      );
    }
  }
  async crearDocente(
    institucion: string,
    tipousuario: string,
    crearDocenteDto: CreateDocenteDto,
  ) {
    try {
      const idInstitucion = await this.docenteRepository.query(
        'SELECT institucion_id FROM tbl_institucion WHERE institucion_nombre=?',
        [institucion],
      );

      if (idInstitucion.length === 0) {
        throw new BadRequestException('No existe la institución ingresada');
      } else {
        //Se valida que el usuario sea un docente
        if (tipousuario === 'Docente') {
          const correoValidacion = await this.docenteRepository.query(
            'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 3',
            [crearDocenteDto.correo],
          );
          //Se valida que el correo no este registrado en el rol docente
          if (correoValidacion && correoValidacion.length > 0) {
            const usuarioCorreo = correoValidacion[0].usuario_correo;

            if (usuarioCorreo === crearDocenteDto.correo) {
              throw new BadRequestException(
                'Correo ya registrado en el rol docente',
              );
            }
          } else {
            const validarDocumento = await this.validarNumeroDocumento(
              institucion,
              {
                pais_origen: crearDocenteDto.pais_origen,
                numero_carnet: crearDocenteDto.carnet_identidad,
              },
            );
            //Se valida que el documento no este registrado en el rol docente
            if (validarDocumento.resultado > 0) {
              throw new BadRequestException(
                crearDocenteDto.pais_origen +
                  ' : ' +
                  crearDocenteDto.carnet_identidad +
                  ', ya existe.',
              );
            } else {
              if (validarDocumento.resultado == 0) {
                const [idUsuario] = await this.docenteRepository.query(
                  'SELECT usuario_id FROM tbl_usuario WHERE usuario_usuario = ? AND rol_id = 3',
                  [crearDocenteDto.nombre_usuario],
                );
                if (!idUsuario || idUsuario.usuario_id === null) {
                  const codigo_verificacion = 15;
                  const pasHashed = await bcryptjs.hash(
                    crearDocenteDto.clave,
                    10,
                  );
                  const query =
                    'CALL admin_sp_crear_docente_tutor(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
                  const parameters = [
                    crearDocenteDto.correo,
                    pasHashed,
                    crearDocenteDto.nombres,
                    crearDocenteDto.apellidos,
                    crearDocenteDto.pais_origen,
                    crearDocenteDto.carnet_identidad,
                    crearDocenteDto.nombre_usuario,
                    crearDocenteDto.fecha_nacimiento,
                    crearDocenteDto.telefono,
                    crearDocenteDto.pais,
                    crearDocenteDto.genero,
                    crearDocenteDto.grado_estudio,
                    crearDocenteDto.grado_ocupacion,
                    crearDocenteDto.carrera,
                    crearDocenteDto.publicidad,
                    institucion,
                    codigo_verificacion,
                    tipousuario,
                    crearDocenteDto.usuario_descripcion,
                    crearDocenteDto.docente_linkedin,
                    crearDocenteDto.docente_youtube,
                    crearDocenteDto.docente_instagram,
                    1,
                  ];
                  const [result] = await this.docenteRepository.query(
                    query,
                    parameters,
                  );
                  // await this.enviarUsuario(createUsuarioDto.correo,createUsuarioDto.nombre_usuario)
                  return { mensaje: 'Se registro el usuario correctamente' };
                } else {
                  throw new BadRequestException(
                    'El nombre de usuario ya existe',
                  );
                }
              }
            }
          }
        } else {
          //Se valida que el usuario sea un tutor
          if (tipousuario === 'Tutor') {
            const correoValidacionTutor = await this.docenteRepository.query(
              'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 2',
              [crearDocenteDto.correo],
            );
            //Se valida que el correo no este registrado en el rol tutor
            if (correoValidacionTutor && correoValidacionTutor.length > 0) {
              const usuarioCorreo = correoValidacionTutor[0].usuario_correo;

              if (usuarioCorreo === crearDocenteDto.correo) {
                throw new BadRequestException(
                  'Correo ya registrado en el rol Tutor',
                );
              }
            } else {
              const validarDocumento = await this.validarNumeroDocumento(
                institucion,
                {
                  pais_origen: crearDocenteDto.pais_origen,
                  numero_carnet: crearDocenteDto.carnet_identidad,
                },
              );
              //Se valida que el documento no este registrado en el rol tutor
              if (validarDocumento.resultado > 0) {
                throw new BadRequestException(
                  crearDocenteDto.pais_origen +
                    ' : ' +
                    crearDocenteDto.carnet_identidad +
                    ', ya existe.',
                );
              } else {
                if (validarDocumento.resultado == 0) {
                  const [idUsuario] = await this.docenteRepository.query(
                    'SELECT usuario_id FROM tbl_usuario WHERE usuario_usuario = ? AND rol_id = 2',
                    [crearDocenteDto.nombre_usuario],
                  );
                  if (!idUsuario || idUsuario.usuario_id === null) {
                    const codigo_verificacion = 15;
                    const pasHashed = await bcryptjs.hash(
                      crearDocenteDto.clave,
                      10,
                    );
                    const query =
                      'CALL admin_sp_crear_docente_tutor(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
                    const parameters = [
                      crearDocenteDto.correo,
                      pasHashed,
                      crearDocenteDto.nombres,
                      crearDocenteDto.apellidos,
                      crearDocenteDto.pais_origen,
                      crearDocenteDto.carnet_identidad,
                      crearDocenteDto.nombre_usuario,
                      crearDocenteDto.fecha_nacimiento,
                      crearDocenteDto.telefono,
                      crearDocenteDto.pais,
                      crearDocenteDto.genero,
                      crearDocenteDto.grado_estudio,
                      crearDocenteDto.grado_ocupacion,
                      crearDocenteDto.carrera,
                      crearDocenteDto.publicidad,
                      institucion,
                      codigo_verificacion,
                      tipousuario,
                      crearDocenteDto.usuario_descripcion,
                      null,
                      null,
                      null,
                      null,
                    ];
                    const [result] = await this.docenteRepository.query(
                      query,
                      parameters,
                    );
                    // await this.enviarUsuario(createUsuarioDto.correo,createUsuarioDto.nombre_usuario)
                    return { mensaje: 'Se registro el usuario correctamente' };
                  } else {
                    throw new BadRequestException(
                      'El nombre de usuario ya existe',
                    );
                  }
                }
              }
            }
          } else {
            //Se valida que el usuario sea un administrador
            if (tipousuario === 'Administrador') {
              const correoValidacionAdmin = await this.docenteRepository.query(
                'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 1',
                [crearDocenteDto.correo],
              );
              //Se valida que el correo no este registrado en el rol administrador
              if (correoValidacionAdmin && correoValidacionAdmin.length > 0) {
                const usuarioCorreo = correoValidacionAdmin[0].usuario_correo;

                if (usuarioCorreo === crearDocenteDto.correo) {
                  throw new BadRequestException(
                    'Correo ya registrado en el rol Administrador',
                  );
                }
              } else {
                const validarDocumento = await this.validarNumeroDocumento(
                  institucion,
                  {
                    pais_origen: crearDocenteDto.pais_origen,
                    numero_carnet: crearDocenteDto.carnet_identidad,
                  },
                );
                //Se valida que el documento no este registrado en el rol administrador
                if (validarDocumento.resultado > 0) {
                  throw new BadRequestException(
                    crearDocenteDto.pais_origen +
                      ' : ' +
                      crearDocenteDto.carnet_identidad +
                      ', ya existe.',
                  );
                } else {
                  if (validarDocumento.resultado == 0) {
                    const [idUsuario] = await this.docenteRepository.query(
                      'SELECT usuario_id FROM tbl_usuario WHERE usuario_usuario = ? AND rol_id = 1',
                      [crearDocenteDto.nombre_usuario],
                    );
                    if (!idUsuario || idUsuario.usuario_id === null) {
                      const codigo_verificacion = 15;
                      const pasHashed = await bcryptjs.hash(
                        crearDocenteDto.clave,
                        10,
                      );
                      const result = await this.docenteRepository.query(
                        'CALL admin_sp_crear_docente_tutor(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [
                          crearDocenteDto.correo,
                          pasHashed,
                          crearDocenteDto.nombres,
                          crearDocenteDto.apellidos,
                          crearDocenteDto.pais_origen,
                          crearDocenteDto.carnet_identidad,
                          crearDocenteDto.nombre_usuario,
                          crearDocenteDto.fecha_nacimiento,
                          crearDocenteDto.telefono,
                          crearDocenteDto.pais,
                          crearDocenteDto.genero,
                          crearDocenteDto.grado_estudio,
                          crearDocenteDto.grado_ocupacion,
                          crearDocenteDto.carrera,
                          crearDocenteDto.publicidad,
                          institucion,
                          codigo_verificacion,
                          tipousuario,
                          crearDocenteDto.usuario_descripcion,
                          null,
                          null,
                          null,
                          null,
                        ],
                      );
                      return {
                        mensaje: 'Se registro el usuario correctamente',
                      };
                    } else {
                      throw new BadRequestException(
                        'El nombre de usuario ya existe',
                      );
                    }
                  }
                }
              }
            } else {
              throw new BadRequestException('No existe el tipo de usuario');
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al ingresar el usuario' + error.message);
    }
  }
  async validarNumeroDocumento(
    institucion: string,
    validarNumeroDocumentoDto: ValidarNumeroDocumentoDto,
  ) {
    try {
      await this.docenteRepository.query(
        'CALL sp_validar_numero_documento(?,?,?,@resultado)',
        [
          validarNumeroDocumentoDto.pais_origen,
          validarNumeroDocumentoDto.numero_carnet,
          institucion,
        ],
      );

      const [output] = await this.docenteRepository.query(
        'SELECT @resultado as resultado',
      );

      return output;
    } catch (error) {
      throw new Error('Error al validar numero de documento');
    }
  }
}
