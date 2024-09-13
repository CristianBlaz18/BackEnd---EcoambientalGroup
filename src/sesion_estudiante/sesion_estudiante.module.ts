import { Module } from '@nestjs/common';
import { SesionEstudianteService } from './sesion_estudiante.service';
import { SesionEstudianteController } from './sesion_estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionEstudiante } from './entities/sesion_estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SesionEstudiante])],
  controllers: [SesionEstudianteController],
  providers: [SesionEstudianteService],
})
export class SesionEstudianteModule {}
