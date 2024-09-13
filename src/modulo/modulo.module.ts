import { Module } from '@nestjs/common';
import { ModuloService } from './modulo.service';
import { ModuloController } from './modulo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modulo } from './entities/modulo.entity';
import { CursoModule } from 'src/curso/curso.module';

@Module({
  imports: [TypeOrmModule.forFeature([Modulo]),CursoModule],
  controllers: [ModuloController],
  providers: [ModuloService],
})
export class ModuloModule {}
