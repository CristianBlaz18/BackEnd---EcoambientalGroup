import { Module } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progreso } from './entities/progreso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Progreso])],
  controllers: [ProgresoController],
  providers: [ProgresoService],
})
export class ProgresoModule {}
