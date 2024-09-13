import { Injectable } from '@nestjs/common';
import { CreateFormularioCapacitacionDto } from './dto/create-formulario_capacitacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FormularioCapacitacion } from './entities/formulario_capacitacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormularioCapacitacionService {
  constructor(
    @InjectRepository(FormularioCapacitacion)
    private readonly formulariocapacitacionRepository: Repository<FormularioCapacitacion>,
  ) {}

  async insertarregistroformularcapacitacion(
    createFormularioCapacitacionDto: CreateFormularioCapacitacionDto,
  ) {
    try {
      const idcapacitacion = await this.formulariocapacitacionRepository.query(
        'SELECT capacitacion_id FROM tbl_capacitacion WHERE capacitacion_id = ?',
        [createFormularioCapacitacionDto.capacitacion_id],
      );
      if (idcapacitacion && idcapacitacion.length > 0) {
        const query = `Call sp_formulario_capacitacion(?,?,?,?,?,?,?,?,?,?)`;
        await this.formulariocapacitacionRepository.query(query, [
          createFormularioCapacitacionDto.capacitacion_id,
          createFormularioCapacitacionDto.formcap_nombres,
          createFormularioCapacitacionDto.formcap_apellido_paterno,
          createFormularioCapacitacionDto.formcap_apellido_materno,
          createFormularioCapacitacionDto.formcap_organizacion,
          createFormularioCapacitacionDto.formcap_ruc,
          createFormularioCapacitacionDto.formcap_correo,
          createFormularioCapacitacionDto.formcap_celular,
          createFormularioCapacitacionDto.formcap_pais,
          createFormularioCapacitacionDto.formcap_consulta,
        ]);
        return { message: 'se registro correctamente el formulario' };
      } else {
        return {
          message:
            'La capacitacion_id de la tbl_capacitacion no se encuentra disponible',
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error al enviar formulario ' + error.message);
    }
  }
}
