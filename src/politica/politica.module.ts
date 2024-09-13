import { Module } from '@nestjs/common';
import { PoliticaService } from './politica.service';
import { PoliticaController } from './politica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Politica } from './entities/politica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Politica])],
  controllers: [PoliticaController],
  providers: [PoliticaService],
})
export class PoliticaModule {}
