import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ResenaService } from './resena.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Reseña')
@Controller('resena')
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Get('curso')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Ver Reseña ',
    description:
      'La api regresa a reseña de los cursos por con los parametros cursoId,institucion nombre en el procedimiento.SP: sp_visualizar_reseñas_curso()',
  })
  async getResenaCurso(
    @Query('idCurso') id_curso: number,
    @Query('institucion') nombre_institucion: string,
  ) {
    try {
      if (!id_curso || !nombre_institucion) {
        throw new NotFoundException('Datos de búsqueda de curso incompletos');
      }
      return await this.resenaService.resumenCurso(id_curso, nombre_institucion);
    } catch (error) {
      return {
        error: 'No se pudo obtener la reseña del curso desde el controller',
        message: error.message,
      };
    }
  }

  @Post()
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Insertar Reseña',
    description:
      'La api ingresa una reseña con los parametros nombre_institucion,id_curso,id_estudiante,calificacion_curso,comentario_curso en el procedimiento almacenado. SP: sp_registrar_calificacion_curso()',
  })
  async crearResena(@Body() creaarResenaDto: CreateResenaDto) {
    try {
      return await this.resenaService.enviarResena(creaarResenaDto);
    } catch (error) {
      console.error(
        'Error al enviar la reseña del curso desde controller:',
        error,
      );
      throw new Error('No se pudo crear la reseña del curso desde controller');
    }
  }
}
