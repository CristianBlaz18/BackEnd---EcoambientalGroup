import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDocenteDto } from './dto/create-docente.dto';

@ApiTags('Docente')
@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Get(':institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Docentes por Institución',
    description:
      'Esta API permite mostrar los docentes por institución que solo recibe como parametro el nombre de la institución en el procedimiento .SP: sp_listar_docente_institucion()',
  })
  docentes(@Param('institucion') institucion: string) {
    return this.docenteService.docentes(institucion);
  }

  @Get('detalle/:idDoc/:institucion')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Detalles de Docentes por Institución',
    description:
      'Esta API permite mostrar los detalles de los docentes que contiene una institución, se le pasa como parametro el id del docente y el nombre de la institución en el procedimieno sp_listar_docente_detalle()',
  })
  docente(
    @Param('idDoc') idDoc: number,
    @Param('institucion') institucion: string,
  ) {
    return this.docenteService.docenteDetalle(idDoc, institucion);
  }
  
  @Post(':institucion/:tipoUsuario')
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Crear Docente y tutor',
    description:
      'Esta api creara un nuevo usuario mediante un array y un parametro, el parametro sera del nombre de la institucion y el array que tendra los siguientes datos: {"correo": "string","clave": "string","nombres": "string","apellidos": "string","pais_origen": "string","carnet_identidad": "DNI","nombre_usuario": "string","fecha_nacimiento": "string","telefono": "string","pais": "string","genero": "Masculino","grado_estudio": "string","grado_ocupacion": "string","carrera": "string","publicidad": true}. SP: sp_crear_usuario(), sp_validar_numero_documento(?,?,?,@resultado)',
  })
  async crearDocente(
    @Param('institucion') institucion: string,
    @Param('tipoUsuario') tipoUsuario: string,
    @Body() createDocenteDto: CreateDocenteDto,
  ) {
    try {
      return this.docenteService.crearDocente(institucion,tipoUsuario, createDocenteDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Manejar el error de entrada duplicada, por ejemplo, lanzar un error específico o devolver un mensaje más amigable.
        throw new Error('Error al crear usuario. Datos duplicados.');
      }
      console.log(error);
      throw new Error('Error al crear usuario ' + error.message);
    }
  }
}
