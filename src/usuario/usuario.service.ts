import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { UpdateClaveUsuario } from './dto/update-clave-usuario.dto';
import * as bcryptjs from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { ValidateUsuario } from './dto/validate-usuario.dto';
import { ProfileUsuario } from './dto/profile-usuario.dto';
import { TokenDto } from './dto/token.dto';
import { ValidarNumeroDocumentoDto } from './dto/validar-numero-documento.dto';
import { ValidarCorreoDto } from './dto/validar-correo.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PaisEstudianteDto } from './dto/validar-pais.dto';
import { UpdateCorreoUsuario } from './dto/update-correo-usuario.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as Handlebars from 'handlebars';
import { CreateDocenteDto } from './dto/create-docente.dto';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearUsuario(institucion: string, createUsuarioDto: CreateUsuarioDto) {
    const idInstitucion = await this.usuarioRepository.query(
      'SELECT institucion_id FROM tbl_institucion WHERE institucion_nombre=?',
      [institucion],
    );

    if (idInstitucion.length === 0) {
      throw new BadRequestException('No existe la institución ingresada');
    } else {
      await this.usuarioRepository.query(
        'CALL sp_validar_correo(?,?,@resultado)',
        [createUsuarioDto.correo, institucion],
      );
      const validar = await this.usuarioRepository.query(
        'SELECT  @resultado AS resultado',
      );

      if (validar[0].resultado == 1) {
        throw new BadRequestException(
          'Correo ya registrado en esta institución',
        );
      } else {
        const validarDocumento = await this.validarNumeroDocumento(
          institucion,
          {
            pais_origen: createUsuarioDto.pais_origen,
            numero_carnet: createUsuarioDto.carnet_identidad,
          },
        );
        //Validar si el documento ya existe en la base de datos
        if (validarDocumento.resultado > 0) {
          throw new BadRequestException(
            createUsuarioDto.pais_origen +
              ' : ' +
              createUsuarioDto.carnet_identidad +
              ', ya existe.',
          );
        } else {
          if (validarDocumento.resultado == 0) {
            const [idUsuario] = await this.usuarioRepository.query(
              'select usuario_id FROM tbl_usuario Where usuario_usuario = ?',
              [createUsuarioDto.nombre_usuario],
            );
            if (!idUsuario || idUsuario.usuario_id === null) {
              const codigo_verificacion = 0;
              const pasHashed = await bcryptjs.hash(createUsuarioDto.clave, 10);

              const query =
                'CALL sp_crear_usuario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
              const parameters = [
                createUsuarioDto.correo,
                pasHashed,
                createUsuarioDto.nombres,
                createUsuarioDto.apellidos,
                createUsuarioDto.pais_origen,
                createUsuarioDto.carnet_identidad,
                createUsuarioDto.nombre_usuario,
                createUsuarioDto.fecha_nacimiento,
                createUsuarioDto.telefono,
                createUsuarioDto.pais,
                createUsuarioDto.genero,
                createUsuarioDto.grado_estudio,
                createUsuarioDto.grado_ocupacion,
                createUsuarioDto.carrera,
                createUsuarioDto.publicidad,
                institucion,
                codigo_verificacion,
              ];
              const [result] = await this.usuarioRepository.query(
                query,
                parameters,
              );
              await this.enviarUsuario(institucion,
                createUsuarioDto.correo,
                createUsuarioDto.nombre_usuario,
              );
              return { mensaje: 'Se registro el usuario correctamente' };
            } else {
              throw new BadRequestException('El nombre de usuario ya existe');
            }
          }
        }
      }
    }
  }

  // async getUsuario(institucionId: number, nombreUsuario: string) {
  //   try {
  //     const [usuarioget] = await this.usuarioRepository.query(
  //       'CALL sp_validar_usuario(?,?)',
  //       [institucionId, nombreUsuario],
  //     );
  //     return usuarioget;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al ontener usuario ' + error.message);
  //   }
  // }

  async validarUsuarios(
    institucion: string,
    { token }: TokenDto,
    validateUsuario: ValidateUsuario,
  ) {
    try {
      let id_usuario;
      if (token) {
        id_usuario = await this.authService.obtenerIdUsuarioToken(token);
      } else {
        id_usuario = null;
      }
      await this.usuarioRepository.query(
        'CALL sp_validar_existencia_usuario(?,?,?, @nick_temp)',
        [institucion, validateUsuario.usuarioNick, id_usuario],
      );
      const [output] = await this.usuarioRepository.query(
        'SELECT @nick_temp as nick_temp',
      );

      return output;
    } catch (error) {
      console.error(error);
      throw new Error('Error al validar usuario');
    }
  }

  async actualizardatos(
    institucion: string,
    token: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ) {
    try {
      const idUsuario = await this.authService.obtenerIdUsuarioToken(token);
      if (
        !updateUsuarioDto.fecha_nacimiento &&
        !updateUsuarioDto.telefono &&
        !updateUsuarioDto.nombre_usuario &&
        !updateUsuarioDto.ocupacion &&
        !updateUsuarioDto.grado_estudio &&
        !updateUsuarioDto.pais &&
        !updateUsuarioDto.imagen
      ) {
        return {
          message: 'Debes proporcionar al menos un campo para actualizar.',
        };
      } else {
        // const existeConsulta = await this.usuarioRepository.query(
        //   'SELECT usuario_telefono, usuario_usuario FROM tbl_usuario WHERE usuario_telefono = ? OR usuario_usuario = ?',
        //   [updateUsuarioDto.telefono, updateUsuarioDto.nombre_usuario],
        // );

        // if (existeConsulta.length > 0) {
        //   if (
        //     existeConsulta.some(
        //       (usuario) =>
        //         usuario.usuario_telefono === updateUsuarioDto.telefono,
        //     )
        //   ) {
        //     throw new Error('Número telefónico ya registrado');
        //   }
        //   if (
        //     existeConsulta.some(
        //       (usuario) =>
        //         usuario.usuario_usuario === updateUsuarioDto.nombre_usuario,
        //     )
        //   ) {
        //     throw new Error('Nombre de usuario ya registrado');
        //   }
        // }
        // if (updateUsuarioDto.fecha_nacimiento) {
        //   const [year, month, day] =
        //     updateUsuarioDto.fecha_nacimiento.split('-');
        //   const fec = new Date(`${year}-${month}-${day}T00:00:00`);

        //   if (isNaN(fec.getTime())) {
        //     return {
        //       message: 'La fecha de nacimiento no es válida.',
        //     };
        //   }
        // }
        const result = await this.usuarioRepository.query(
          'Call sp_actualizar_datos_perfil(?,?,?,?,?,?,?,?,?)',
          [
            idUsuario,
            institucion,
            updateUsuarioDto.fecha_nacimiento,
            updateUsuarioDto.telefono,
            updateUsuarioDto.pais,
            updateUsuarioDto.nombre_usuario,
            updateUsuarioDto.ocupacion,
            updateUsuarioDto.grado_estudio,
            updateUsuarioDto.imagen,
          ],
        );
        if (result.affectedRows === 0) {
          return { message: 'Usuario no encontrado' };
        }
        return { mensaje: 'True' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al actualizar datos ' + error.message);
    }
  }

  async actualizarClave(
    institucion: string,
    token: string,
    updateClaveUsuario: UpdateClaveUsuario,
  ) {
    try {
      const id_usuario = await this.authService.obtenerIdUsuarioToken(token);
      //console.log('idToken: '+idToken);
      //console.log('idAPI: '+idUsuario);
      const [idUsuarioResult] = await this.usuarioRepository.query(
        'SELECT usuario_id FROM tbl_usuario WHERE usuario_id = ?',
        [id_usuario],
      );
      //Validar si el idusuario existe en la base de datos
      if (!idUsuarioResult || !idUsuarioResult.usuario_id) {
        return {
          message: 'No se encontró un usuario con el ID proporcionado',
        };
      }

      const [idEstudianteResult] = await this.usuarioRepository.query(
        'SELECT estudiante_id FROM tbl_estudiante WHERE usuario_id = ?',
        [id_usuario],
      );
      //Validar si el idestudiante existe en la base de datos
      if (!idEstudianteResult || !idEstudianteResult.estudiante_id) {
        return {
          message: 'No se encontró un estudiante con el ID proporcionado',
        };
      }

      const getpass = await this.usuarioRepository.query(
        'SELECT usuario_clave FROM tbl_usuario WHERE usuario_id = ?',
        [id_usuario],
      );
      // Validar si la contraseña actual es correcta
      if (getpass && getpass.length > 0) {
        const storedHash = getpass[0].usuario_clave;
        // Verificar la contraseña actual usando bcrypt
        const isPasswordValid = await bcryptjs.compare(
          updateClaveUsuario.pass,
          storedHash,
        );
        if (isPasswordValid) {
          // Generar el nuevo hash para la nueva contraseña
          const newPassHash = await bcryptjs.hash(
            updateClaveUsuario.newPass,
            10,
          );
          // Actualizar la contraseña en la base de datos
          const result = await this.usuarioRepository.query(
            'Call sp_actualizar_contraseña(?,?,?)',
            [institucion, idEstudianteResult.estudiante_id, newPassHash],
          );

          return result[0];
        } else {
          return { message: 'La contraseña actual es incorrecta' };
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al actualizar clave ' + error.message);
    }
  }

  async eliminarcuenta(token: string) {
    try {
      const id_usuario = await this.authService.obtenerIdUsuarioToken(token);
      const stateuser = await this.usuarioRepository.query(
        'SELECT usuario_estado FROM tbl_usuario WHERE usuario_id = ?',
        [id_usuario],
      );
      //Validar si el usuario ua ya esta aliminado
      if (stateuser && stateuser.length > 0) {
        if (stateuser[0].usuario_estado === 0) {
          return { message: 'El usuario ya se encuentra eliminado' };
        } else {
          const result = await this.usuarioRepository.query(
            'Call sp_dar_baja_cuenta(?)',
            [id_usuario],
          );

          return { message: 'Usuario eliminado exitosamente' };
        }
      } else {
        return { message: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('error al eliminar cuenta ' + error.message);
    }
  }

  async perfilusuario(
    institucion: string,
    token: string,
    profileUsuario: ProfileUsuario,
  ) {
    try {
      const id_usuario = await this.authService.obtenerIdUsuarioToken(token);
      // const [rol] = await this.usuarioRepository.query(
      //   ' SELECT rol_id from tbl_usuario where usuario_id = ?',
      //   [id_usuario],
      // );
      const [usuario] = await this.usuarioRepository.query(
        `Call sp_filtrar_perfil_usuario(?,?,?)`,

        [institucion, id_usuario, profileUsuario.rol_nombre],
      );

      return usuario[0];
    } catch (error) {
      console.error(error);
      throw new Error(
        'Ocurrió un error al obtener el perfil del usuario ' + error.message,
      );
    }
  }

  async validarNumeroDocumento(
    institucion: string,
    validarNumeroDocumentoDto: ValidarNumeroDocumentoDto,
  ) {
    try {
      await this.usuarioRepository.query(
        'CALL sp_validar_numero_documento(?,?,?,@resultado)',
        [
          validarNumeroDocumentoDto.pais_origen,
          validarNumeroDocumentoDto.numero_carnet,
          institucion,
        ],
      );

      const [output] = await this.usuarioRepository.query(
        'SELECT @resultado as resultado',
      );

      return output;
    } catch (error) {
      throw new Error('Error al validar numero de documento');
    }
  }

  async validarCorreo(institucion: string, validarCorreoDto: ValidarCorreoDto) {
    try {
      await this.usuarioRepository.query(
        'call sp_validar_correo(?,?,@resultado)',
        [validarCorreoDto.correo_usuario, institucion],
      );

      const [output] = await this.usuarioRepository.query(
        'select @resultado as resultado',
      );

      return output;
    } catch (error) {}
  }

  async actualizarCorreoUsuario(
    token: string,
    updateCorreoUsuario: UpdateCorreoUsuario,
  ) {
    try {
      const idUsuario = await this.authService.obtenerIdUsuarioToken(token);
      const getpass = await this.usuarioRepository.query(
        'SELECT usuario_clave FROM tbl_usuario WHERE usuario_id = ?',
        [idUsuario],
      );
      //Validar si la contraseña actual es correcta
      if (getpass && getpass.length > 0) {
        const passAlmacenado = getpass[0].usuario_clave;
        const isPasswordValid = await bcryptjs.compare(
          updateCorreoUsuario.password,
          passAlmacenado,
        );

        if (isPasswordValid) {
          const [result] = await this.usuarioRepository.query(
            'CALL sp_actualizar_correo(?,?,?)',
            [idUsuario, passAlmacenado, updateCorreoUsuario.email],
          );

          return result[0];
        } else {
          throw new Error('Correo Incorrecto');
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al actualizar el correo del usuario' + error.message,
      );
    }
  }

  async paisEstudiante({ idEstudiante }: PaisEstudianteDto) {
    try {
      await this.usuarioRepository.query(
        'CALL sp_pais_estudiante(?, @pais_estudiante)',
        [idEstudiante],
      );
      const [pais] = await this.usuarioRepository.query(
        'SELECT @pais_estudiante as pais_estudiante',
      );
      return pais;
    } catch (error) {
      console.log(error);
      throw new Error('Error al mostrar pais del estudiante ' + error.message);
    }
  }

  async actualizarCodigo(institucion:string,idUsuario: number) {
    // try {
    const [email] = await this.usuarioRepository.query(
      'Call sp_devolver_email_institucion(?);',
      [idUsuario],
    );
    if (email && email.length > 0) {
      if (email && Array.isArray(email)) {
        const emailMapeado = email.map((email) => ({
          usuario_correo: email.usuario_correo,
          institucion_nombre: email.institucion_nombre,
        }));

        for (const email of emailMapeado) {
          await this.usuarioRepository.query(
            'call sp_validar_correo(?,?,@resultado)',
            [email.usuario_correo, email.institucion_nombre],
          );

          const [output] = await this.usuarioRepository.query(
            'select @resultado as resultado',
          );
          if (output.resultado == 1) {
            const codigo = uuidv4().slice(0, 8);
            await this.sendWelcomeEmail(institucion,email.usuario_correo, codigo);
            const actualizar = await this.usuarioRepository.query(
              'CALL sp_actualizar_codigo_verificacion(?,?)',
              [idUsuario, codigo],
            );
            return { mensaje: 'Actualizado' };
          } else if (output.resultado == 0) {
            throw new BadRequestException('No existe el correo');
          }
        }
      } else {
        return { mensaje: 'No existen datos' };
      }
    } else {
      throw new BadRequestException('No existe el usuario');
    }

    // if(output === 1

    // const codigo = uuidv4().slice(0, 8);
    // await this.sendWelcomeEmail(email.usuario_correo, codigo);
    // const actualizar = await this.usuarioRepository.query(
    //   'CALL sp_actualizar_codigo_verificacion(?,?)',
    //   [idUsuario, codigo],
    // );

    // } catch (error) {
    //   console.log(error);
    //   throw new BadRequestException('No se actualizo ');
    // }
  }

  async actualizarEstadoCodigo(idUsuario: number, codigo: string) {
    try {
      const [codigoBD] = await this.usuarioRepository.query(
        'SELECT usuario_codigo_activacion from tbl_usuario where usuario_id = ?',
        [idUsuario],
      );
      if (codigoBD.usuario_codigo_activacion == codigo) {
        await this.usuarioRepository.query(
          'CALL sp_actualizar_estado_verificacion(?)',
          [idUsuario],
        );
        return { mensaje: 'Se actualizo' };
      } else {
        throw new BadRequestException('Codigo erroneo no se actualizo ');
      }
    } catch (error) {
      console.log('Error:', error);
      throw new BadRequestException('Código erróneo, no se actualizó');
    }
  }

  async sendWelcomeEmail(institucion:string,correo: string, codigo: string) {
    try {

      const [verificarinstitucion] = await this.usuarioRepository.query('CALL sp_validar_institucion(?)',[institucion]);
      if (!verificarinstitucion || verificarinstitucion.length === 0 || verificarinstitucion[0].resultado === 0) {
        
        throw new BadRequestException('La institucion no existe');
      }else{
        const institucionNombre = verificarinstitucion[0].institucion_nombre;
        const institucionLogo = verificarinstitucion[0].institucion_logo;
        const templatePath = path.join(
          __dirname,
          'correoVerificacion',
          'correoVerificacion.html',
        );
        console.log('Ruta del archivo:', templatePath);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        const html = template({codigo,institucionNombre,institucionLogo});
  
        await this.mailerService.sendMail({
          to: correo,
          subject: 'Tu codigo de Verificacion',
          html: html,
        });
      }
      
      return { mensaje: 'Correo enviado correctamente' };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo: ' + error.message);
    }
  }


  async enviarUsuario(institucion:string,correo: string, usuario: string) {
    try {
      const [verificarinstitucion] = await this.usuarioRepository.query('CALL sp_validar_institucion(?)',[institucion]);
      if (!verificarinstitucion || verificarinstitucion.length === 0 || verificarinstitucion[0].resultado === 0) {
        
        throw new BadRequestException('La institucion no existe');
      }else{
        const templatePath = path.join(
          __dirname,
          'usuarioVerificacion',
          'usuarioVerificacion.html',
        );
        const institucionNombre = verificarinstitucion[0].institucion_nombre;
        const institucionLogo = verificarinstitucion[0].institucion_logo;
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        const html = template({usuario,institucionNombre,institucionLogo});
  
        await this.mailerService.sendMail({
          to: correo,
          subject: 'Bienvenido a Ecoambiental GROUP',
          html: html,
        });
        return { mensaje: 'Correo enviado correctamente' };
      }
      
    } catch (error) {
      console.log(error);
      throw new Error('Error al enviar el correo: ' + error.message);
    }
  }

  async restablecerContrasena(correo: string, institucion: string) {
    const [validarCorreo] = await this.usuarioRepository.query(
      'CALL sp_validar_correo_restablecer_contraseña(?,?)',
      [correo, institucion],
    );
    if (validarCorreo[0].usuario_id > 0) {
      const codigo = await this.generarContrasena();
      await this.enviarCorreoContraseña(institucion,correo, codigo);
      const pasHashed = await bcryptjs.hash(codigo, 10);
      await this.usuarioRepository.query('CALL sp_actualizar_clave(?,?,?)', [
        validarCorreo[0].usuario_id,
        pasHashed,
        institucion,
      ]);
      return { mensaje: 'Se actualizó la contraseña' };
    } else {
      throw new BadRequestException(
        'No se encontró un usuario con el correo proporcionado',
      );
    }
  }

  async generarContrasena() {
    //Caracteres que se usaran para generar la contraseña
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const aleatorio = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const letra = aleatorio(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    );
    const numero = aleatorio('0123456789');
    const especial = aleatorio('!@#$%^&*()_+');

    const otrosCaracteres = Array.from({ length: 5 }, () =>
      aleatorio(caracteres),
    );
    //Aqui se genera la contraseña
    const contrasena = [letra, numero, especial, ...otrosCaracteres].join('');

    return contrasena;
  }

  async enviarCorreoContraseña(institucion:string,correo: string, codigo: string) {
    try {
      const [verificarinstitucion] = await this.usuarioRepository.query('CALL sp_validar_institucion(?)',[institucion]);
      if (!verificarinstitucion || verificarinstitucion.length === 0 || verificarinstitucion[0].resultado === 0) {
        
        throw new BadRequestException('La institucion no existe');
      }else{
        const templatePath = path.join(
          __dirname,
          'correoContrasena',
          'correoContrasena.html',
        );
        //Cargar el template
        const institucionNombre = verificarinstitucion[0].institucion_nombre;
        const institucionLogo = verificarinstitucion[0].institucion_logo;
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        //Compilar el template
        const template = Handlebars.compile(templateSource);
        const html = template({ codigo,institucionNombre,institucionLogo });
        //Enviar el correo
        await this.mailerService.sendMail({
          to: correo,
          subject: `Recuperar Contraseña ${institucion}`,
          html: html,
        });
        return { mensaje: 'Correo enviado correctamente' };
      }
      
    } catch (error) {
      console.log(error);
      throw new Error('Error al enviar el correo: ' + error.message);
    }
  }
  async crearDocenteTutor(
    institucion: string,
    tipousuario: string,
    crearDocenteDto: CreateDocenteDto,
  ) {
    const idInstitucion = await this.usuarioRepository.query(
      'SELECT institucion_id FROM tbl_institucion WHERE institucion_nombre=?',
      [institucion],
    );

    if (idInstitucion.length === 0) {
      throw new BadRequestException('No existe la institución ingresada');
    } else {
      //Valida que el usuario sea de tipo docente
      if (tipousuario === 'Docente') {
        const correoValidacion = await this.usuarioRepository.query(
          'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 3',
          [crearDocenteDto.correo],
        );
        //valida que el correo no este registrado en el rol docente
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
          //valida que el documento no este registrado en la base de datos
          if (validarDocumento.resultado > 0) {
            throw new BadRequestException(
              crearDocenteDto.pais_origen +
                ' : ' +
                crearDocenteDto.carnet_identidad +
                ', ya existe.',
            );
          } else {
            if (validarDocumento.resultado == 0) {
              const [idUsuario] = await this.usuarioRepository.query(
                'select usuario_id FROM tbl_usuario Where usuario_usuario = ?',
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
                const [result] = await this.usuarioRepository.query(
                  query,
                  parameters,
                );
                // await this.enviarUsuario(createUsuarioDto.correo,createUsuarioDto.nombre_usuario)
                return { mensaje: 'Se registro el usuario correctamente' };
              } else {
                throw new BadRequestException('El nombre de usuario ya existe');
              }
            }
          }
        }
      } else if (tipousuario === 'Tutor') {
        const correoValidacionTutor = await this.usuarioRepository.query(
          'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 2',
          [crearDocenteDto.correo],
        );
        //valida que el correo no este registrado en el rol tutor
        if (correoValidacionTutor && correoValidacionTutor.length > 0) {
          const usuarioCorreo = correoValidacionTutor[0].usuario_correo;

          if (usuarioCorreo === crearDocenteDto.correo) {
            throw new BadRequestException(
              'Correo ya registrado en el rol Tutor',
            );
          }
        } else {
          const correoValidacion = await this.usuarioRepository.query(
            'SELECT u.usuario_correo FROM tbl_usuario u LEFT JOIN tbl_estudiante e ON u.usuario_id = e.usuario_id WHERE u.usuario_correo=? AND u.rol_id = 3',
            [crearDocenteDto.correo],
          );
          //valida que el correo no este registrado en el rol docente
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
            //valida que el documento no este registrado en la base de datos
            if (validarDocumento.resultado > 0) {
              throw new BadRequestException(
                crearDocenteDto.pais_origen +
                  ' : ' +
                  crearDocenteDto.carnet_identidad +
                  ', ya existe.',
              );
            } else {
              if (validarDocumento.resultado == 0) {
                const [idUsuario] = await this.usuarioRepository.query(
                  'select usuario_id FROM tbl_usuario Where usuario_usuario = ?',
                  [crearDocenteDto.nombre_usuario],
                );
                if (!idUsuario || idUsuario.usuario_id === null) {
                  const codigo_verificacion = 15;
                  const pasHashed = await bcryptjs.hash(
                    crearDocenteDto.clave,
                    10,
                  );
                  const query =
                    'CALL admin_sp_crear_docente_tutor(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
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
                  const [result] = await this.usuarioRepository.query(
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
        }
      }
    }
  }

  async validarCorreoEstudiante(idEstudiante: number, institucion: string) {
    try {
      const [validar] = await this.usuarioRepository.query(
        'CALL sp_validar_verificacion_correo(?,?)',
        [idEstudiante, institucion],
      );
      return validar[0];
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al actualizar el correo del usuario' + error.message,
      );
    }
  }
}
