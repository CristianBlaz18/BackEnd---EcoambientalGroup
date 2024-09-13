import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GetDataDto } from './dto/get-data.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async login(institucion: string, loginDto: LoginDto) {
    try {
      //Con esta consulta SQL se verifica si existe o no la institucion ingresada
      const [isInstitucion] = await this.authRepository.query(
        'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
        [institucion],
      );
      if (!isInstitucion) {
        throw new BadRequestException('No existe la institucion ingresada');
      } else {
        const [hashResult] = await this.authRepository.query(
          'SELECT u.usuario_clave FROM tbl_usuario u INNER JOIN tbl_estudiante e ON e.usuario_id=u.usuario_id WHERE (u.usuario_usuario = ? OR u.usuario_correo = ?) AND ? IN (u.usuario_usuario, u.usuario_correo)',
          [
            loginDto.nombre_usuario,
            loginDto.nombre_usuario,
            loginDto.nombre_usuario,
          ],
        );

        if (!hashResult || !hashResult.usuario_clave) {
          throw new BadRequestException('Contraseña ingresada es erronea');
        }
        const storedHash = hashResult.usuario_clave;

        // Verificar la contraseña usando bcrypt
        const isPasswordValid = await bcryptjs.compare(
          loginDto.clave,
          storedHash,
        );

        if (isPasswordValid) {
          //Ejecutamos el procedimiento para iniciar sesion
          const [usuario] = await this.authRepository.query(
            'Call sp_iniciar_sesion(?,?,?)',
            [institucion, loginDto.nombre_usuario, storedHash],
          );
          const payload = {
            idUsuario: usuario[0].usuario_id,
            idEstudiante: usuario[0].tipo_usuario_id,
          };
          const token = await this.jwtService.signAsync(payload);

          //Ejecutar cuando se inicie sesion
          await this.authRepository.query(
            `Call sp_revisar_evaluacion_caducado(?,?)`,
            [institucion, payload.idEstudiante],
          );

          await this.authRepository.query(
            `Call sp_revisar_entregable_caducado(?,?)`,
            [institucion, payload.idEstudiante],
          );
          //Llamamos a la funcion donde se validan los cupones
          await this.validarCupones(institucion);

          //Llamamos a la funcion para obtener el idEstudiante con el Token
          const idEstudiante = await this.obtenerIdEstudianteToken(token);
          const idUsuario = await this.obtenerIdUsuarioToken(token);
          await this.authRepository.query(
            `SELECT rol_id From tbl_usuario WHERE usuario_id = ?`,
            [idUsuario],
          );
          console.log(usuario[0].rol_nombre);
          if (
            usuario[0].rol_nombre != 'Estudiante' &&
            usuario[0].rol_nombre != 'Alumno'
          ) {
            throw new BadRequestException(
              'El usuario ingresado no es de rol Estudiante/Alumno',
            );
          }

          await this.validarCuponesEstudiante(idEstudiante);

          return {
            token: token,
            usuario: {
              rol: usuario[0].rol_nombre,
              id: usuario[0].usuario_id,
              idRol: usuario[0].tipo_usuario_id,
              nombre: usuario[0].nombres,
              apellido: usuario[0].apellidos,
              imagen: usuario[0].imagen_usuario,
              correo: usuario[0].correo,
              telefono: usuario[0].telefono,
              codigo_verificado: usuario[0].codigo_verificado,
            },
          };
        } else {
          throw new BadRequestException('Credenciales inválidas');
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al iniciar sesion: ' + error.message);
    }
  }
  async validarCupones(institucion: string) {
    try {
      //Se ejecuta el procedimineto almacenado
      const [cupones] = await this.authRepository.query(
        'Call sp_listar_cupones_empresas(?)',
        [institucion],
      );
      if (cupones && Array.isArray(cupones)) {
        const cuponesMapeado = cupones.map((cupone: any) => ({
          cupon_id: cupone.cupon_id,
        }));
        for (const cupones of cuponesMapeado) {
          await this.authRepository.query(
            'CALL sp_actualizar_estado_cupon(?)',
            [cupones.cupon_id],
          );
          return { mensaje: 'Actualizado' };
        }
      } else {
        throw new BadRequestException('No tiene cupones');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al iniciar sesion: ' + error.message);
    }
  }

  async validarCuponesEstudiante(idEstudiante: number) {
    try {
      const [cupones] = await this.authRepository.query(
        'CALL sp_listar_miscupones_vencidos(?)',
        [idEstudiante],
      );
      if (cupones && Array.isArray(cupones)) {
        const cuponesMapeado = cupones.map((cupone: any) => ({
          miscupones_id: cupone.miscupones_id,
        }));
        for (const cupones of cuponesMapeado) {
          await this.authRepository.query(
            'CALL sp_actualizar_estado_miscupones(?)',
            [cupones.miscupones_id],
          );
          return { mensaje: 'Actualizado' };
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al iniciar sesion: ' + error.message);
    }
  }

  async validacionLogin(institucion: string, getDataDto: GetDataDto) {
    try {
      //Con esta consulta SQL Validamos si existe o no la institucion
      const [isInstitucion] = await this.authRepository.query(
        'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
        [institucion],
      );
      if (!isInstitucion) {
        throw new BadRequestException('No existe la institucion ingresada');
      } else {
        const idToken = await this.obtenerIdEstudianteToken(getDataDto.token);
        const [data] = await this.authRepository.query(
          'Call sp_validar_login(?,?)',
          [institucion, idToken],
        );
        const resultado = {
          rol: data[0].rol,
          id: data[0].usuario_id,
          idRol: data[0].id_rol,
          nombre: data[0].nombre_usuario_concat,
          apellido: data[0].apellido_usuario_concat,
          imagen: data[0].imagen_usuario,
          correo: data[0].usuario_correo,
          telefono: data[0].usuario_telefono,
          codigo_verificado: data[0].usuario_codigo_verificado,
        };

        return resultado;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener datos: ' + error.message);
    }
  }

  //Sirve para obtener el idUsuario ingresando el token que se genero
  async obtenerIdUsuarioToken(token: string): Promise<number> {
    try {
      // Obtener el idUsuario del token
      const decoded = this.jwtService.verify(token);
      const userId = decoded.idUsuario;
      return userId;
    } catch (error) {
      console.error('Error al verificar el token:', error.message);
      throw new UnauthorizedException('Token inválido');
    }
  }
  //Sirve para obtener el IdEstudiante ingresando el toke que se genero
  async obtenerIdEstudianteToken(token: string): Promise<number> {
    try {
      // Obtener el idUsuario del token
      const decoded = this.jwtService.verify(token);
      const studentId = decoded.idEstudiante;
      return studentId;
    } catch (error) {
      console.error('Error al verificar el token:', error.message);
      throw new UnauthorizedException('Token inválido');
    }
  }

  // async pruebaTokenHeader(token: string) {
  //   const idUsuario = await this.obtenerIdUsuarioToken(token);
  //   const idEstudiante = await this.obtenerIdEstudianteToken(token);
  //   return { idUsuario, idEstudiante };
  // }
}
