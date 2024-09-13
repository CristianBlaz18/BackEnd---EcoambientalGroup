import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Sesion } from './entities/sesion.entity';
import { Modulo } from './entities/modulo.entity';
import { Resena } from './entities/resena.entity';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Sesion, Modulo,Resena,Categoria])],
  controllers: [CursoController],
  providers: [CursoService],
  exports:[CursoService]
})
export class CursoModule {}
