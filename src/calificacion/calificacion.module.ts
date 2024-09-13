import { Module } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './entities/calificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion])],
  controllers: [CalificacionController],
  providers: [CalificacionService],
})
export class CalificacionModule {}
