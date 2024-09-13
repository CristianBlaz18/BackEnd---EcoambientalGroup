import { Controller, Post, Body } from '@nestjs/common';
import { FormularioCapacitacionService } from './formulario_capacitacion.service';
import { CreateFormularioCapacitacionDto } from './dto/create-formulario_capacitacion.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Formulario Capacitacion')
@Controller('formulario-capacitacion')
export class FormularioCapacitacionController {
  constructor(
    private readonly formularioCapacitacionService: FormularioCapacitacionService,
  ) {}

  @Post()
  @ApiHeader({
    name: 'api-key',
    description: 'Contra de API',
  })
  @ApiOperation({
    summary: 'Formulario de Capacitación',
    description:
      'Requiere un body: json {"formcap_nombre": "string","formcap_apellido_paterno": "string","formcap_apellido_materno": "string","formcap_organizacion": "string","formcap_ruc": "string","formcap_correo": "string","formcap_celular": "string","formcap_pais": "string","formcap_consulta": "string","capacitacion_id": 0 }. SP: sp_formulario_capacitacion()',
  })
  insertarregistroformularcapacitacion(
    @Body() createFormularioCapacitacionDto: CreateFormularioCapacitacionDto,
  ) {
    return this.formularioCapacitacionService.insertarregistroformularcapacitacion(
      createFormularioCapacitacionDto,
    );
  }
}
