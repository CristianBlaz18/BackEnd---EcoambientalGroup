import { Module } from '@nestjs/common';
import { HistorialCompraService } from './historial-compra.service';
import { HistorialCompraController } from './historial-compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCompra } from './entities/historial-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialCompra])],
  controllers: [HistorialCompraController],
  providers: [HistorialCompraService],
})
export class HistorialCompraModule {}
