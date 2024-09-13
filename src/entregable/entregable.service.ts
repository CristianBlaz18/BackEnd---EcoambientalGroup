import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entregable } from './entities/entregable.entity';
import { Repository } from 'typeorm';
import { DataRegistroEntregable } from './dto/data-registro-entregable.dto';

@Injectable()
export class EntregableService {
  constructor(
    @InjectRepository(Entregable)
    private readonly entregableRepository: Repository<Entregable>,
  ) {}

  async mostrarEntregable(
    institucion: string,
    idMatricula: number,
    idModulo: number,
    idCurso: number,
    idEstudiante: number,
  ) {
    try {
      const [entregable] = await this.entregableRepository.query(
        'Call sp_visualizar_entregables(?,?,?,?)',
        [institucion, idMatricula, idModulo, idEstudiante],
      );
      return entregable;
    } catch (error) {
      console.log(error);
      throw new Error(
        'Error al obtener los entregables del modulo ' + error.message,
      );
    }
  }

  async detalleEntregable(
    institucion: string,
    idEstudiante: number,
    idEntregable: number,
  ) {
    try {
      const [entregable] = await this.entregableRepository.query(
        'CALL sp_listar_entregable_detalle(?,?,?)',
        [institucion, idEstudiante, idEntregable],
      );
      return entregable[0];
    } catch (error) {
      console.log(error);
      throw new error(
        'Error al mostrar detalles de la entrega ' + error.message,
      );
    }
  }

  async registrarEntregable(
    nombre_institucion: string,
    dataRegistroEntregable: DataRegistroEntregable,
  ) {
    try {
      const [isInstitucion] = await this.entregableRepository.query(
        'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
        [nombre_institucion],
      );
      if (isInstitucion) {
        const query =
          'Call sp_registrar_entregable_estudiante(?,?,?,?,@mensaje_salida)';
        await this.entregableRepository.query(query, [
          nombre_institucion,
          dataRegistroEntregable.id_estudiante,
          dataRegistroEntregable.id_entregable,
          dataRegistroEntregable.urlArchivo,
        ]);
        const salida = await this.entregableRepository.query(
          'SELECT @mensaje_salida AS mensaje',
        );

        return salida;
      } else {
        return { message: 'No existe la institucion ingresada' };
      }
      // return { message: 'Se registro correctamente el entregable' };
    } catch (error) {
      console.log(error);
      throw new Error('Error al registrar entregable' + error.message);
    }
  }
  // async registrarEntregable(
  //   nombre_institucion: string,
  //   dataRegistroEntregable: DataRegistroEntregable,
  //   file: Express.Multer.File,
  // ) {
  //   try {
  //     if (!file) {
  //       // Verificar si file es undefined
  //       return { message: 'Archivo no proporcionado' };
  //     }
  //     const [isInstitucion] = await this.entregableRepository.query(
  //       'SELECT * FROM tbl_institucion WHERE institucion_nombre = ?',
  //       [nombre_institucion],
  //     );

  //     if (isInstitucion) {
  //       // Guardar el archivo en la carpeta y obtener la ruta
  //       // const filePath = `${file.filename}`
  //       const filePath = `${file.filename}`;

  //       // Llamar al procedimiento almacenado con la ruta del archivo
  //       const query =
  //         'Call sp_registrar_entregable_estudiante(?,?,?,?,?,@mensaje_salida)';
  //       await this.entregableRepository.query(query, [
  //         nombre_institucion,
  //         dataRegistroEntregable.id_curso,
  //         dataRegistroEntregable.id_estudiante,
  //         dataRegistroEntregable.id_entregable,
  //         filePath,
  //       ]);

  //       const salida = await this.entregableRepository.query(
  //         'SELECT @mensaje_salida AS mensaje',
  //       );

  //       return salida;
  //     } else {
  //       return { message: 'No existe la institucion ingresada' };
  //     }

  //     // return { message: 'Se registro correctamente el entregable' };
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al registrar entregable' + error.message);
  //   }
  // }

  async revisarEntregable(institucion: string, idEstudiante: number) {
    try {
      await this.entregableRepository.query(
        'CALL sp_revisar_entregable_caducado(?,?)',
        [institucion, idEstudiante],
      );
      await this.entregableRepository.query(
        'CALL  sp_revisar_evaluacion_caducado(?,?)',
        [institucion, idEstudiante],
      );
      return { mensaje: 'Actualizado' };
    } catch (error) {
      console.log(error);
      throw new Error('Error revisar entregable' + error.message);
    }
  }
}
