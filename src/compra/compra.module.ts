import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { CompraCertificadoModule } from 'src/compra-certificado/compra-certificado.module';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]),CompraCertificadoModule],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}
