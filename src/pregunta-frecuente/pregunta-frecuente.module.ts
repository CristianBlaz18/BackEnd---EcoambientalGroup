import { Module } from '@nestjs/common';
import { PreguntaFrecuenteService } from './pregunta-frecuente.service';
import { PreguntaFrecuenteController } from './pregunta-frecuente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntaFrecuente } from './entities/pregunta-frecuente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreguntaFrecuente])],
  controllers: [PreguntaFrecuenteController],
  providers: [PreguntaFrecuenteService],
})
export class PreguntaFrecuenteModule {}
