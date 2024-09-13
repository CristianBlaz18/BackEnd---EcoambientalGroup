import { Module } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materiale } from './entities/materiale.entity';
import { CursoModule } from 'src/curso/curso.module';

@Module({
  imports: [TypeOrmModule.forFeature([Materiale]), CursoModule ],
  controllers: [MaterialesController],
  providers: [MaterialesService],
})
export class MaterialesModule {}
