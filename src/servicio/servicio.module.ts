import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { ServicioDetalle } from './entities/serviciodetalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, ServicioDetalle])],
  controllers: [ServicioController],
  providers: [ServicioService],
})
export class ServicioModule {}
