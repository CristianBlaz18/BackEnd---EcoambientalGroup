import { Module } from '@nestjs/common';
import { FormularioCapacitacionService } from './formulario_capacitacion.service';
import { FormularioCapacitacionController } from './formulario_capacitacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormularioCapacitacion } from './entities/formulario_capacitacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormularioCapacitacion])],
  controllers: [FormularioCapacitacionController],
  providers: [FormularioCapacitacionService],
})
export class FormularioCapacitacionModule {}
