import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reporte } from './entities/reporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reporte])],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
