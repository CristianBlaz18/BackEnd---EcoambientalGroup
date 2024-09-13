import { Module } from '@nestjs/common';
import { CursoMatriculadoService } from './curso_matriculado.service';
import { CursoMatriculadoController } from './curso_matriculado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoMatriculado } from './entities/curso_matriculado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CursoMatriculado])],
  controllers: [CursoMatriculadoController],
  providers: [CursoMatriculadoService],
})
export class CursoMatriculadoModule {}
