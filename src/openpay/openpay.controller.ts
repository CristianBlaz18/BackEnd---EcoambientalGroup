import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { OpenpayService } from './openpay.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChargeDto } from './dto/charge.dto';

@ApiTags('OpenPay')
@Controller('openpay')
export class OpenpayController {
  constructor(private readonly openpayService: OpenpayService) {}
  @Post('crear-pago/:institucion')
  async crearPago(
    @Param('institucion') institucion: string,
    @Body() chargeDto: ChargeDto) {
    return this.openpayService.crearCargo(institucion,chargeDto);
  }

  @Post('crear-pago/prueba/:institucion')
  async crearPagoPrueba(
    @Param('institucion') institucion: string,
    @Body() chargeDto: ChargeDto) {
    return this.openpayService.pruebaCrearCargo(institucion,chargeDto);
  }


  // @Post('webhook')
  // async handleWebhook(@Body() paymentData,@Res() res) {
  //   return this.openpayService.handleWebhook(paymentData,res);
  //   // console.log('Webhook received successfully');

  // }

  @Get()
  @ApiOperation({
    summary: 'Checkout GET',
    description:
      'Checkout GET',
  })
  getweebHook() {
    return this.openpayService.getWebhook();
  }
  @Get('datos')
  async datos(){
    return this.openpayService.datos();
  }
  
  @Post('webhook')
  async handleWebhook(@Body() paymentData, @Res() res) {
    return this.openpayService.handleWebhook(paymentData, res);
    // console.log('Webhook received successfully');
  }
}
