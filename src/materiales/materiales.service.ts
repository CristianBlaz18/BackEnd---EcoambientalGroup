import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Materiale } from './entities/materiale.entity';
import { Repository } from 'typeorm';
import { DataMaterialesDto } from './dto/data-materiales.dto';
import { CursoService } from '../curso/curso.service';

@Injectable()
export class MaterialesService {
  constructor(
    private readonly cursoservice: CursoService,
    @InjectRepository(Materiale)
    private materialesRepository: Repository<Materiale>,
  ) {}

  async materialesporModulo(
    institucion: string, {id_curso, id_estudiante}:DataMaterialesDto
  ){
    try {
      const modulocurso = await this.cursoservice.modulosCurso(
        institucion, id_curso,
      );
      if(modulocurso && Array.isArray(modulocurso)){
        const modulosMapeado = modulocurso.map((modulo: any) => ({
          modulo_id: modulo.modulo_id,
          modulo_numeracion: modulo.modulo_numeracion,
          modulo_nombre: modulo.modulo_nombre,
          modulo_fecha_inicio:modulo.modulo_fecha_inicio,
          materiales: [],
      
        }));

        for (const material of modulosMapeado) {
          const materiales = await this.materiales(
            institucion,
            id_estudiante,
            id_curso,
            material.modulo_id,
          );
          if (Array.isArray(materiales)) {
            material.materiales = materiales.map((material: any) => ({
               material_id: material.material_id,
               material_nombre: material.material_nombre,
               material_url: material.material_url,
            }));
          }
        }
        return modulosMapeado
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('error al obtener los materiles de los modulos del curso' + error.message);
    }
  }

  async materiales(
    institucion: string, id_estudiante: number, id_curso: number, id_modulo: number,
  ) {
    try {
      const [material] = await this.materialesRepository.query(
        'CALL sp_listar_modulo_materiales(?,?,?,?)',
        [institucion, id_estudiante, id_curso, id_modulo],
      );
      return material;
    } catch (error) {
      console.log(error)
      throw new Error('Error al obtener los materiales: '+ error.message);
    }
  }
}
