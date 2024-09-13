import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { EntregableService } from './entregable.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataRegistroEntregable } from './dto/data-registro-entregable.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Response } from 'express';
import { of } from 'rxjs';

@ApiTags('Entregable')
@Controller('entregable')
export class EntregableController {
  constructor(private readonly entregableService: EntregableService) {}

  @Get(':institucion/:idMatricula/:idModulo/:idCurso/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Obtener los entregables de un modulo',
    description:
      'Mediante los parametros{"institucion":"string(nombre de la institucion)","idMatricula":"number","idModulo":"number","idCurso":"number","idEstudiante":"number"}. SP: sp_visualizar_entregables(?,?,?,?,?)',
  })
  mostrarEntregable(
    @Param('institucion') institucion: string,
    @Param('idMatricula') idMatricula: number,
    @Param('idModulo') idModulo: number,
    @Param('idCurso') idCurso: number,
    @Param('idEstudiante') idEstudiante: number,
  ) {
    return this.entregableService.mostrarEntregable(
      institucion,
      idMatricula,
      idModulo,
      idCurso,
      idEstudiante,
    );
  }

  @Get(':institucion/:idEstudiante/:idEntregable')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Obtener detalles de la entrega',
    description:
      'Mediante los parametros{"institucion":"string(nombre de la institucion)","idEstudiante":"number","idCurso":"number","idEntregable":"number"} SP: sp_listar_entregable_detalle()',
  })
  detalleEntregable(
    @Param('institucion') institucion: string,
    @Param('idEstudiante') idEstudiante: number,
    @Param('idEntregable') idEntregable: number,
  ) {
    return this.entregableService.detalleEntregable(
      institucion,
      idEstudiante,
      idEntregable,
    );
  }

  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './archivos',
  //       filename: function (req, file, cb) {
  //         const idEstudiante = req.query.id_estudiante; // Asegúrate de que el nombre del parámetro sea correcto
  //         if (!idEstudiante) {
  //           return cb(
  //             new Error('ID del estudiante no proporcionado en la consulta'),
  //             '',
  //           );
  //         }

  //         const uniqueSuffix = Date.now() + '-';
  //         const fileName = `${
  //           file.originalname.split('.')[0]
  //         }-${idEstudiante}.pdf`;
  //         cb(null, fileName);
  //       },
  //     }),
  //   }),
  // )
  @Post('registrar/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registro de entregables',
    description:
      'Esta api permite registrar el entregables del estudiante mediante los parametros{"institucion":"string(nombre de la institucion)"}, y query:{"id_curso":"number","id_estudiante":"number","id_entregable":"number", "file": se sube como un archivo} SP : sp_registrar_entregable_estudiante()',
  })
  async uploadFile(
    // @UploadedFile() file: Express.Multer.File,
    @Param('institucion') nombre_institucion: string,
    @Query() dataRegistroEntregable: DataRegistroEntregable,
  ) {
    // console.log(file);
    return this.entregableService.registrarEntregable(
      nombre_institucion,
      dataRegistroEntregable,
      // file,
    );
  }
  @Get('descargar/:nombreArchivo')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Descargar entregable',
    description:
      'Es api descarga un entregable mendiante el nombre del archivo',
  })
  async descargarArchivo(
    @Param('nombreArchivo') nombreArchivo: string,
    @Res() res: Response,
  ) {
    const rutaArchivo = join(process.cwd(), 'archivos', nombreArchivo);

    // Configura los encabezados para permitir la descarga
    res.header('Content-Disposition', `attachment; filename=${nombreArchivo}`);
    res.header('Content-Type', 'application/octet-stream');

    return of(res.sendFile(rutaArchivo));
  }

  @Patch('revisarEntregable/:institucion/:idEstudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Revisar Entregable',
    description:
      'Esta API revisa el entragable con los parametros {institucion:string, y idEstudiante:number}SP :sp_revisar_entregable_caducado(nombre_institucion, id_estudiante) y sp_revisar_entregable_examen(nombre_institucion, id_estudiante)',
  })
  async revisarEntregable(
    @Param('institucion') nombre_institucion: string,
    @Param('idEstudiante') idEstudiante: number,
  ) {
    try {
      return this.entregableService.revisarEntregable(
        nombre_institucion,
        idEstudiante,
      );
    } catch (error) {
      console.log(error);
      throw new Error('Error al revisar entregable' + error.message);
    }
  }
}
