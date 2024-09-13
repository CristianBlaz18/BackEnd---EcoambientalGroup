import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import serveStatic from 'serve-static';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(cookieParser());

  // app.useStaticAssets(join(__dirname, '...', 'public', 'correoVerificacion'), { prefix: '/correoVerificacion' });
  // app.useStaticAssets(join(__dirname, '...', 'public', 'usuarioVerificacion'), { prefix: '/usuarioVerificacion' });
  
  app.use(
    '/correoVerificacion',
    serveStatic(join(__dirname, '..', 'public', 'correoVerificacion'), {
      index: ['correoVerificacion.html'],
    }),
  );
  app.use(
    '/usuarioVerificacion',
    serveStatic(join(__dirname, '..', 'public', 'usuarioVerificacion'), {
      index: ['usuarioVerificacion.html'],
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // app.useStaticAssets('images', { prefix: '/images' });
  // app.useStaticAssets('entregables', { prefix: '/entregables' });
  // app.use(MercadoPagoMiddleware);

  //Prefijo fijo de utilizacion de apis
  app.setGlobalPrefix('api/v1');
  //Validacion Flobal
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //Configuracion de Swagger
  const config = new DocumentBuilder()
    .setTitle('EcoAmbiental APIS')
    .setDescription('Eh aqui las Apis de los guerreros.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();

  //Puerto del servidor
  await app.listen(process.env.PORT_SERVER);
}
bootstrap();
