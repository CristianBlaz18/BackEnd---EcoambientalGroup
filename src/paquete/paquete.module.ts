import { Module } from '@nestjs/common';
import { PaqueteService } from './paquete.service';
import { PaqueteController } from './paquete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';
import { Objetivo } from './entities/objetivo.entity';
import { Curso } from './entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete, Objetivo, Curso])],
  controllers: [PaqueteController],
  providers: [PaqueteService],
})
export class PaqueteModule {}
