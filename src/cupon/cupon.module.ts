import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cupon } from "./entities/cupon.entity";
import { CuponController } from "./cupon.controller";
import { CuponService } from "./cupon.service";


@Module({
  imports: [TypeOrmModule.forFeature([Cupon])],
  controllers: [CuponController],
  providers: [CuponService],
})
export class CuponModule {}
