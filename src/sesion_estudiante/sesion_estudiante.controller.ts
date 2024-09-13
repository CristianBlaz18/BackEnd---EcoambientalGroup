import { Controller, Post, Body, Param } from '@nestjs/common';
import { SesionEstudianteService } from './sesion_estudiante.service';
import { SesionEstudianteDto } from './dto/sesion-estudiante.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('sesion-estudiante')
export class SesionEstudianteController {
  constructor(
    private readonly sesionEstudianteService: SesionEstudianteService,
  ) {}

  @Post(':institucion')
  @ApiTags('Sesion estudiante')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Registrar sesion estudiante',
    description:
      'Esta Api registrara la sesion del estudiante mediante los parametros:{"institucion":"string(nombre de la institucion)", y query ("id_estudiante":"number", "id_sesion": "number"}; SP: sp_insertar_sesion_estudiante()',
  })
  sesionestudiante(
    @Param('institucion') nombre_institucion: string,
    @Body() sesionEstudianteDto: SesionEstudianteDto,
  ) {
    try {
      return this.sesionEstudianteService.sesionEstudiante(
        nombre_institucion,
        sesionEstudianteDto,
      );
    } catch (error) {
      throw new Error('Error al insertar sesion estudiante ' + error.message);
    }
  }
}
