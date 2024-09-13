import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reporte } from './entities/reporte.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { id } from 'date-fns/locale';
import { Entregable } from '../entregable/entities/entregable.entity';
import { ids } from 'googleapis/build/src/apis/ids';
import es from 'date-fns/esm/locale/es/index.js';
import { certificatemanager } from 'googleapis/build/src/apis/certificatemanager';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
  ) {}
  // async generateReporte() {
  //   const [usuarios] = await this.reporteRepository.query(
  //     'call admin_sp_listar_curso_1();'		
  //   );
  //   return this.generateExcel(usuarios);
  // }
  

  async generarDatos(institucion:string,nombreCurso:string,tipo:string) {
    const [usuarios] = await this.reporteRepository.query('call admin_sp_listar_curso_1(?,?,?)',[institucion,nombreCurso,tipo]);
    // console.log(usuarios[0].cantidad_ev)
    // Mapear los resultados según tus necesidades
    if (usuarios && Array.isArray(usuarios)) {
      const resultadosMapeados = usuarios.map((usuario) => ({
        IdCurso: usuario.curso_id,
        NombreCurso: usuario.curso_nombre,
        TipoCurso: usuario.curso_tipo,
        CantidadEvaluaciones:usuario.cantidad_ev,
        CantidadEntregables:usuario.cantidad_en,
        Estudiantes:[]
      }));


      for (const usuariomap of resultadosMapeados) {

        const estudiantes = await this.getEstudiantes(usuariomap.IdCurso);
        
        
        if (estudiantes && Array.isArray(estudiantes)) {
          const estudiantesMapeados = estudiantes.map((estudiante) => ({
            estudiante_id: estudiante.estudiante_id,
            nombre_apellidos: estudiante.nombre_apellidos,
            usuario_correo: estudiante.usuario_correo,
            usuario_telefono:estudiante.usuario_telefono,
            usuario_pais_origen:estudiante.usuario_pais_origen,
            usuario_carnet_identidad:estudiante.usuario_carnet_identidad,
            usuario_usuario:estudiante.usuario_usuario,
            usuario_gradoacademico:estudiante.usuario_gradoacademico,
            usuario_ocupacion:estudiante.usuario_ocupacion,
            usuario_pais:estudiante.usuario_pais,
            Promedio:[],
            Estado: "",
            Certificado:[],
            Evaluaciones:[],
            Entregables:[],
            EmpresaCertificado:[]
            
          }));


          for(const estudiantes of estudiantesMapeados){
            if (usuariomap.CantidadEvaluaciones === 0) {
              estudiantes.Evaluaciones = [{
                evaluacion_id: 0,
                max_nota: 0,
                envio_estado: 'Sin evaluaciones',
                fecha_entrega: 'No hay evaluaciones',
                evaluacion_fecha_fin: 'No hay evaluaciones',
              }];
            } else {
            
              const evaluaciones = await this.getEvaluacionesCurso( usuariomap.IdCurso);

              if (evaluaciones && Array.isArray(evaluaciones)) {
                const evaluacionesMapeados = evaluaciones.map((evaluacion) => ({
                  servicio_id:evaluacion.servicio_id
                }));

                for (const evaluacion of evaluacionesMapeados) {
                  
                  const notaEvaluaciones = await this.getEvaluacionesNotas(estudiantes.estudiante_id, evaluacion.servicio_id);
                    if (notaEvaluaciones && notaEvaluaciones.length > 0) {
                      const resultadoFinal = {
                        evaluacion_id: evaluacion.servicio_id,
                        max_nota: notaEvaluaciones[0].max_nota || 0, 
                        envio_estado: notaEvaluaciones[0].envio_estado || 'Sin estado', 
                        fecha_entrega:notaEvaluaciones[0].fecha_entrega || 'No Tiene Fecha de Entrega',
                        evaluacion_fecha_fin:notaEvaluaciones[0].evaluacion_fecha_fin|| 'No Tiene Fecha Limite'
                      };
                    
                      estudiantes.Evaluaciones.push(resultadoFinal);
                    } else {
                      
                      const resultadoFinal = {
                        evaluacion_id: evaluacion.servicio_id,
                        max_nota: 0, 
                        envio_estado: 'Sin estado', 
                        fecha_entrega:'No Tiene Fecha de Entrega',
                        evaluacion_fecha_fin:'No Tiene Fecha Limite'
                      };
                    
                      estudiantes.Evaluaciones.push(resultadoFinal);
                    }
                  }
              } else {
                estudiantes.Evaluaciones.push({
                  evaluacion_id: 0,
                  max_nota: 0,
                  envio_estado: 'Sin evaluaciones',
                  fecha_entrega: 'N/A',
                  evaluacion_fecha_fin: 'N/A'
                });
                
                // const resultadoFinal = {
                //   evaluacion_id: evaluacionId,
                //   max_nota: 0, 
                //   envio_estado: 'Sin estado', 
                //   fecha_entrega:'No Tiene Fecha de Entrega',
                //   evaluacion_fecha_fin:'No Tiene Fecha Limite'
                // };
              
                // estudiantes.Evaluaciones.push(resultadoFinal);
                // return []
              }
            }
            if (usuariomap.CantidadEntregables === 0) {
              estudiantes.Entregables = [{
                entregable_id: 0,
                max_nota: 0,
                envio_estado: 'Sin entregables',
                link_entregable: 'No hay entregables',
                entregable_fecha_limite: 'No hay entregables',
                envios_fecha_entrega: 'No hay entregables',
              }];
            } else {
              const entregables = await this.getEntregablesCurso(usuariomap.IdCurso)
            // 
            if (entregables && Array.isArray(entregables)) {
              const entregablesMapeados = entregables.map((entregable) => ({
                servicio_id:entregable.servicio_id
              }));

              for (const entregable of entregablesMapeados) {
                const notaEntregables = await this.getEntregablesNotas(estudiantes.estudiante_id, entregable.servicio_id);
                if (notaEntregables && notaEntregables.length > 0) {
                  const resultadoFinal = {
                    entregable_id: entregable.servicio_id,
                    max_nota: notaEntregables[0].max_nota || 0, 
                    envio_estado: notaEntregables[0].envio_estado || 'Sin estado', 
                    link_entregable:notaEntregables[0].link_entregable || 'Sin link',
                    entregable_fecha_limite:notaEntregables[0].entregable_fecha_limite || 'No Tiene Fecha Limite',
                    envios_fecha_entrega:notaEntregables[0].envios_fecha_entrega || 'No Tiene Fecha de Entrega'

                  
                  };
                
                  estudiantes.Entregables.push(resultadoFinal);
                  
                } else {
                  
                  const resultadoFinal = {
                    entregable_id: entregable.servicio_id,
                    max_nota: 0, 
                    envio_estado: 'Sin estado', 
                    link_entregable:'Sin link',
                    entregable_fecha_limite:'No Tiene Fecha Limite',
                    envios_fecha_entrega:'No Tiene Fecha de Entrega'
                  };
                
                  estudiantes.Entregables.push(resultadoFinal);
                }
                
              }

              
            } else {
              estudiantes.Entregables.push({
                entregable_id: 0,
                max_nota: 0,
                envio_estado: 'Sin entregables',
                link_entregable: 'N/A',
                entregable_fecha_limite: 'N/A',
                envios_fecha_entrega: 'N/A'
              });
              // const resultadoFinalElse = {
              //   entregable_id: 0,
              //   max_nota: 0, 
              //   envio_estado: 'Sin estado', 
              //   link_entregable:'Sin link',
              //   entregable_fecha_limite:'No Tiene Fecha Limite',
              //   envios_fecha_entrega:'No Tiene Fecha de Entrega'
              // };
            
              // estudiantes.Entregables.push(resultadoFinalElse);
              // return []
              
            }
            }
             

            

            const promedio = await this.getPromedio(estudiantes.estudiante_id,usuariomap.IdCurso);
            if (promedio && Array.isArray(promedio)) {
              estudiantes.Promedio = promedio[0].promedio;
              const aprobado = promedio && promedio[0]?.promedio >= 12 ? 'Aprobado' : 'Desaprobado';
              estudiantes.Estado = aprobado
              
            }
            const certificado = await this.getCertificado(estudiantes.estudiante_id,usuariomap.IdCurso);
            
            if(certificado && Array.isArray(certificado) ){
              estudiantes.Certificado = certificado[0].estado;
            }
            const empresa  = await this.getValidarCertificado(estudiantes.estudiante_id,usuariomap.IdCurso);
            if(empresa && Array.isArray(empresa) ){
              estudiantes.EmpresaCertificado = empresa
            } 



          }

          usuariomap.Estudiantes = estudiantesMapeados;
        }
        
      }
      // return resultadosMapeados
      return this.generateExcel(resultadosMapeados);
    } else {
      return [];
    }
  }
  async getEstudiantes(idCurso){
    try {
      const [estudiantes] = await this.reporteRepository.query('CALL admin_sp_kistar_estudiantes_x_cursos_2_0(?)',[idCurso])
      return estudiantes;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener los estudiantes ' + error.message);
    }
  }
  // async getEvaluaciones(idEstudiante, idCurso) {
  //   try {
  //     const [notas] = await this.reporteRepository.query('CALL admin_sp_listar_evalluacion_x_estudiante_docente_3 (?,?)', [idEstudiante, idCurso]);
  //     return notas
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al obtener las evaluaciones ' + error.message);
  //   }
  // }
  
  
  
  // async getEntregables(idEstudiante,idCurso){
  //   try {
  //     const [Entregable] = await this.reporteRepository.query('call admin_sp_listar_entregables_x_estudiante_curso (?,?)',[idEstudiante,idCurso]);
  //     return Entregable;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al obtener el promedio ' + error.message);
  //   }
  // }
  
  async getPromedio(idEstudiante:number,idCurso:number){
    try {
      const [promedio] = await this.reporteRepository.query('CALL admin_sp_filtrar_promedio(?,?)',[idEstudiante,idCurso])
      return promedio;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener el promedio ' + error.message);
    }
  }

  async getCertificado(idEstudiante:number,idCurso:number){
    try {
       await this.reporteRepository.query('Call admin_sp_desea_certificado(?,?,@estado)',[idEstudiante,idCurso])
       const certificado = await this.reporteRepository.query(
        'SELECT @estado as estado',
      );
      return certificado
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener el promedio ' + error.message); 
    }

  }
  async getEvaluacionesCurso(idCurso:number){
    try {
      const tipo = 'Evaluacion'
      const [evaluacionesId] = await this.reporteRepository.query('CALL admin_listar_reporte_evaluacion_entregable_id(?,?)',[idCurso,tipo])
      return evaluacionesId
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener el id de la evauciones ' + error.message); 
    }
  }
  async getEvaluacionesNotas(idEstudiante:number,idEvaluacion:number){
    try {
      const tipo = 'Evaluacion'
      const [notasEvaluaciones] = await this.reporteRepository.query('CALL admin_listar_reporte_nota_evaluacion_entregable(?,?,?)',[idEstudiante,idEvaluacion,tipo])
      return notasEvaluaciones
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener las notas de las evaluaciones' + error.message);
    }
  }

  async getEntregablesNotas(idEstudiante:number,idEntregable:number){
    try {
      const tipo = 'Entregable'
      const [notasEntregable] = await this.reporteRepository.query('CALL admin_listar_reporte_nota_evaluacion_entregable(?,?,?)',[idEstudiante,idEntregable,tipo])
      return notasEntregable
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener las notas de los entregables' + error.message);
    }
    
  }

  async getEntregablesCurso(idCurso:number){
    try {
      const tipo = 'Entregable'
      const [evaluacionesId] = await this.reporteRepository.query('CALL admin_listar_reporte_evaluacion_entregable_id(?,?)',[idCurso,tipo])
      return evaluacionesId
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener el id de los entregables' + error.message); 
    }
  }
  async getValidarCertificado(idEstudiante: number, idCurso: number) {
    try {
      const tipoServicio = 'Curso';
      const [validacion] = await this.reporteRepository.query('CALL admin_sp_validar_certificado(?,?,?)', [idEstudiante, idCurso, tipoServicio]);
  
      if (validacion && Array.isArray(validacion)) {
        const validacionMap = await Promise.all(validacion.map(async (val: any) => {
          const tipo = await this.reporteRepository.query('SELECT fn_devolver_nombre_tipocert(?) as tipo;', [val.tipo]);
          return {
            tipo: tipo[0].tipo,
            resultado: val.resultado === 1 ? 'SI' : 'NO'
          };
        }));
  
        return validacionMap;
      } else {
        return [];
      }
  
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener' + error.message);
    }
  }
  
  private generateExcel(data: any[]): Promise<any> {
    if (!data || data.length === 0) {
      console.error('No hay datos para generar el informe.');
      return Promise.reject(new Error('No hay datos para generar el informe.'));
    }
    
    function getColumnLetter(columnNumber) {
      let columnLetters = "";
    
      while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        columnLetters = String.fromCharCode('A'.charCodeAt(0) + remainder) + columnLetters;
        columnNumber = Math.floor((columnNumber - 1) / 26);
      }
    
      return columnLetters;
    }

  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    
  
    // let maxNumEvaluaciones = data[0].CantidadEvaluaciones;
    // let maxNumEntregables = data[0].CantidadEntregables;    
    let maxNumEvaluaciones = 0;
    let maxNumEntregables = 0;
    let maxNumEmpresas = 0;
  // console.log(data[0].CantidadEvaluaciones[0])
    // Calcular el número máximo de evaluaciones
    
    data.forEach((curso) => {
      curso.Estudiantes.forEach((estudiante) => {
        maxNumEvaluaciones = Math.max(maxNumEvaluaciones, estudiante.Evaluaciones.length);
        maxNumEntregables = Math.max(maxNumEntregables, estudiante.Entregables.length);
        maxNumEmpresas = Math.max(maxNumEmpresas, estudiante.EmpresaCertificado.length)
      });
    });
    const cantidadCamposEvaluacion = Object.keys(data[0].Estudiantes[0].Evaluaciones[0]).length;
    // const cantidadEvaluaciones
    const cantidadCamposEntregables = Object.keys(data[0].Estudiantes[0].Entregables[0]).length;
    const cantidadObjetosEmpresa= Object.keys(data[0].Estudiantes[0].EmpresaCertificado).length; 
   

    const inicio = 1
    const curso = 5;
    const inicioEstudiante =curso + 1 
    const finEstudiante = 18;
    const inicioEvaluaciones = finEstudiante+1
    const finEvaluaciones = inicioEvaluaciones + (maxNumEvaluaciones*cantidadCamposEvaluacion) - 1
    const inicioEntregable = finEvaluaciones + 1
    const finEntregable = inicioEntregable + (maxNumEntregables*cantidadCamposEntregables) -1
    const inicioEmpresa = finEntregable + 1
    const finEmpresa = inicioEmpresa + cantidadObjetosEmpresa -1

    const cellCursos = worksheet.getCell(`${getColumnLetter(inicio)}1`);
    cellCursos.value = 'Cursos';
    cellCursos.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`${getColumnLetter(inicio)}1:${getColumnLetter(curso)}1`);
    cellCursos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '5ADCE7' } // Color de fondo amarillo
    };
    cellCursos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  
    const cellEstudiante = worksheet.getCell(`${getColumnLetter(inicioEstudiante)}1`);
    cellEstudiante.value = 'Estudiante';
    cellEstudiante.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`${getColumnLetter(inicioEstudiante)}1:${getColumnLetter(finEstudiante)}1`);

    cellEstudiante.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '5A92E7' } // Color de fondo amarillo
    };
    // cellEstudiante.border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };
  
    const cellEvaluaciones = worksheet.getCell(`${getColumnLetter(inicioEvaluaciones)}1`);
    cellEvaluaciones.value = 'Evaluaciones';
    cellEvaluaciones.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`${getColumnLetter(inicioEvaluaciones)}1:${getColumnLetter(finEvaluaciones)}1`);
    
    cellEvaluaciones.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '66F1A1' } // Color de fondo amarillo
    };
    cellEvaluaciones.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    const cellEntregables = worksheet.getCell(`${getColumnLetter(inicioEntregable)}1`);
    cellEntregables.value = 'Entregables';
    cellEntregables.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`${getColumnLetter(inicioEntregable)}1:${getColumnLetter(finEntregable)}1`);

    cellEntregables.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A689F5' } // Color de fondo amarillo
    };
    cellEntregables.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    const cellEmpresa = worksheet.getCell(`${getColumnLetter(inicioEmpresa)}1`);
    cellEmpresa.value = 'CertificadoEmpresa';
    cellEmpresa.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`${getColumnLetter(inicioEmpresa)}1:${getColumnLetter(finEmpresa)}1`);

    cellEmpresa.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FEE282' } // Color de fondo amarillo
    };
    cellEmpresa.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
  
    
    // Añadir filas de encabezados
      const headersRow = [
        'IdCurso', 'NombreCurso', 'TipoCurso','CantidadEvaluaciones','CantidadEntregables', 'EstudianteId', 'NombreApellidos', 'Correo', 'Telefono', 'UsuarioPaisOrigen', 'CarnetIdentidad', 'Usuario', 'GradoAcademico', 'Ocupacion', 'Pais', 'Promedio','Estado','Certificado'
      ];
    
      for (let i = 1; i <= maxNumEvaluaciones; i++) {
        headersRow.push(`Evaluacion${i}`, `NotaMaxEvaluacion${i}`, `EvaluacionEstado${i}`,`FechaEntregaEvaluacion${i}`,`FechaEvaluacionLimite${i}`);
      }
      for (let i = 1; i <= maxNumEntregables; i++) {
        headersRow.push(`Entregable${i}`, `NotaMaxEntregable${i}`, `EntregableEstado${i}`,`Link${i}`,`FechaEntregableLimite${i}`,`FechaEntregaEntregable${i}`);
      }

      const empresasArray = [];
      const tiposCertificados = data[0].Estudiantes[0].EmpresaCertificado.map(certificado => certificado.tipo);

      if (Array.isArray(tiposCertificados) && typeof tiposCertificados[0] === 'string') {
        const tiposCertificadosUnicos: string[] = [...new Set(tiposCertificados)];
        const empresas = data[0].Estudiantes[0].EmpresaCertificado;
        

        for (const certificado of empresas) {
          empresasArray.push(certificado.tipo);
          headersRow.push(certificado.tipo);
        }

        console.log(empresasArray);
        console.log(headersRow);
      } else {
        console.error('Los tipos de certificados no son cadenas de texto.');
      }


      
      const headerRow = worksheet.addRow(headersRow);
      const cursos = ['IdCurso', 'NombreCurso', 'TipoCurso','CantidadEvaluaciones','CantidadEntregables'];
      const estudiante = ['EstudianteId', 'NombreApellidos', 'Correo', 'Telefono', 'UsuarioPaisOrigen', 'CarnetIdentidad', 'Usuario', 'GradoAcademico', 'Ocupacion', 'Pais', 'Promedio','Estado','Certificado'];
      

      
      
      headerRow.eachCell((cell, index) => {
        if (empresasArray.includes(String(cell.value))) {
          // Aplicar estilo solo a las celdas específicas
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FEE282' } // Color de fondo azul
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });

      headerRow.eachCell((cell, index) => {
        if (cursos.includes(String(cell.value))) {
          // Aplicar estilo solo a las celdas específicas
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5ADCE7' } // Color de fondo azul
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      headerRow.eachCell((cell, index) => {
        if (estudiante.includes(String(cell.value))) {
          // Aplicar estilo solo a las celdas específicas
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5A92E7' } // Color de fondo azul
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });

      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('FechaEntregableLimite')) {
          // Aplicar estilo solo a las celdas de Entregables
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A689F5' } // Color de fondo verde para Entregables
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });

      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('FechaEntregaEntregable')) {
          // Aplicar estilo solo a las celdas de Entregables
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A689F5' } // Color de fondo verde para Entregables
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });


      
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('FechaEntregaEvaluacion')) {
          // Aplicar estilo solo a las celdas de Evaluaciones
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '66F1A1' } // Color de fondo amarillo para Evaluaciones
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('FechaEvaluacionLimite')) {
          // Aplicar estilo solo a las celdas de Evaluaciones
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '66F1A1' } // Color de fondo amarillo para Evaluaciones
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      
      
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('NotaMaxEvaluacion')) {
          // Aplicar estilo solo a las celdas de Evaluaciones
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '66F1A1' } // Color de fondo amarillo para Evaluaciones
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('Evaluacion')) {
          // Aplicar estilo solo a las celdas de Evaluaciones
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '66F1A1' } // Color de fondo amarillo para Evaluaciones
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      
      // Para Entregables
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('Entregable')) {
          // Aplicar estilo solo a las celdas de Entregables
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A689F5' } // Color de fondo verde para Entregables
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('NotaMaxEntregable')) {
          // Aplicar estilo solo a las celdas de Entregables
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A689F5' } // Color de fondo verde para Entregables
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
      headerRow.eachCell((cell, index) => {
        if (cell.value && cell.value.toString().startsWith('Link')) {
          // Aplicar estilo solo a las celdas de Entregables
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A689F5' } // Color de fondo verde para Entregables
          };
      
          // Configurar el texto centrado
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border ={
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
      
          // Configurar el ajuste automático del ancho de la columna basado en el contenido
          worksheet.getColumn(index).width = cell.text.length + 2; // Puedes ajustar el valor +2 según tus necesidades
        }
      });
     
    
      // worksheet.addRow(headersRow);
  
    let currentNombreCurso = null;
    let currentIdCurso = null;
    let startRow = 2;
    
    let startColumnCursos = 1;
    let startColumnEstudiante = (startColumnCursos + 3)+1;
    let startColumnEvaluaciones = startColumnEstudiante + 11;
    let startColumnEntregables = startColumnEvaluaciones + (maxNumEvaluaciones * 2);
    const cursoColumn = getColumnLetter(startColumnCursos); // Obtén la letra de la columna directamente
    const estudianteColumn = getColumnLetter(startColumnEstudiante);
    const evaluacionColumn = getColumnLetter(startColumnEvaluaciones);
    const entregableColumn = getColumnLetter(startColumnEntregables);
    
    
    data.forEach((curso) => {

      if (curso.NombreCurso !== currentNombreCurso || curso.IdCurso !== currentIdCurso) {
        // Si el curso actual es diferente al anterior, fusiona las celdas y restablece el inicio de la fila
        if (currentNombreCurso !== null || currentIdCurso !== null) {
          if (!worksheet.getCell(`B${startRow}`).isMerged) {
            worksheet.mergeCells(`B${startRow}:B${worksheet.rowCount}`);
          }
          
          if (!worksheet.getCell(`A${startRow}`).isMerged) {
            worksheet.mergeCells(`A${startRow}:A${worksheet.rowCount}`);
          }
        }
        currentNombreCurso = curso.NombreCurso;
        currentIdCurso = curso.IdCurso;
        startRow = worksheet.rowCount + 1;
      }
  
      curso.Estudiantes.forEach((estudiante) => {
        
        const rowData = [
          curso.IdCurso,
          curso.NombreCurso,
          curso.TipoCurso,
          curso.CantidadEvaluaciones,
          curso.CantidadEntregables,
          estudiante.estudiante_id,
          estudiante.nombre_apellidos,
          estudiante.usuario_correo,
          estudiante.usuario_telefono,
          estudiante.usuario_pais_origen,
          estudiante.usuario_carnet_identidad,
          estudiante.usuario_usuario,
          estudiante.usuario_gradoacademico,
          estudiante.usuario_ocupacion,
          estudiante.usuario_pais,
          estudiante.Promedio,
          estudiante.Estado,
          estudiante.Certificado,
          
        ];


        estudiante.Evaluaciones.forEach((evaluacion) => {
          rowData.push(
            evaluacion.evaluacion_id,
            evaluacion.max_nota, 
            evaluacion.envio_estado,
            evaluacion.fecha_entrega,
            evaluacion.evaluacion_fecha_fin
          );
        });

        estudiante.Entregables.forEach((entregable) => {

          rowData.push(
            entregable.entregable_id,
            entregable.max_nota,
            entregable.envio_estado,
            entregable.link_entregable,
            entregable.entregable_fecha_limite,
            entregable.envios_fecha_entrega
          );
        });
        

        
        estudiante.EmpresaCertificado.forEach((empresa)=>{
          rowData.push(
            // empresa.tipo,
            empresa.resultado
            )
        });
        
  
        const row = worksheet.addRow(rowData);

    // Aplicar centrado y ajuste automático del ancho para cada celda en la fila
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
            // Ajuste automático del ancho basado en el contenido
        const column = worksheet.getColumn(cell.col);
        column.width = Math.max(column.width || 0, cell.text.toString().length + 2);
        // cell.border = {
        //   top: { style: 'thin' },
        //   left: { style: 'thin' },
        //   bottom: { style: 'thin' },
        //   right: { style: 'thin' },
        // };
        });
        // if (!worksheet.getCell(`B${startRow}`).isMerged) {
        //   worksheet.mergeCells(`B${startRow}:B${worksheet.rowCount}`);
        // }
    
        // if (!worksheet.getCell(`A${startRow}`).isMerged) {
        //   worksheet.mergeCells(`A${startRow}:A${worksheet.rowCount}`);
        // }
        

        
      });
    });
   
  
    // Fusionar las celdas de la última fila del último curso
    if (currentNombreCurso !== null || currentIdCurso !== null) {
      worksheet.mergeCells(`B${startRow}:B${worksheet.rowCount}`);
      worksheet.mergeCells(`A${startRow}:A${worksheet.rowCount}`);
    }
    return workbook.xlsx.writeBuffer();

  }

}
