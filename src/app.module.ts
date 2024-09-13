import { ForoModule } from './foro/foro.module';
import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionModule } from './institucion/institucion.module';
import { DocenteModule } from './docente/docente.module';
import { CursoModule } from './curso/curso.module';
import { ConfigModule } from '@nestjs/config';
import { CalificacionModule } from './calificacion/calificacion.module';
import { PlanModule } from './plan/plan.module';
import { ConvenioModule } from './convenio/convenio.module';
import { PaqueteModule } from './paquete/paquete.module';
import { ServicioModule } from './servicio/servicio.module';
import { PreguntaFrecuenteModule } from './pregunta-frecuente/pregunta-frecuente.module';
import { AuthModule } from './auth/auth.module';
import { FormularioCapacitacionModule } from './formulario_capacitacion/formulario_capacitacion.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CertificadoModule } from './certificado/certificado.module';
import { CuponModule } from './cupon/cupon.module';
import { HistorialCompraModule } from './historial-compra/historial-compra.module';
import { CompraModule } from './compra/compra.module';
import { CursoMatriculadoModule } from './curso_matriculado/curso_matriculado.module';
import { ModuloModule } from './modulo/modulo.module';
import { ResenaModule } from './resena/resena.module';
import { CompraCertificadoModule } from './compra-certificado/compra-certificado.module';
import { MaterialesModule } from './materiales/materiales.module';
import { ProgresoModule } from './progreso/progreso.module';
import { EntregableModule } from './entregable/entregable.module';
import { PoliticaModule } from './politica/politica.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { jwtConstants } from './auth/constants/jwt.constant';
import { JwtModule } from '@nestjs/jwt';
import { ReporteModule } from './reporte/reporte.module';
import { OpenpayModule } from './openpay/openpay.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { SesionEstudianteModule } from './sesion_estudiante/sesion_estudiante.module';
import { BannerModule } from './banner/banner.module';


@Module({
  imports: [
    
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ecoambientalsistemas@gmail.com',
          pass: 'xwwf lyac mycy xmgn',
        },
      },
      defaults: {
        from: '"Ecoambiental Group" <ecoabmiental@example.com>',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      logging: true
    }),
    AuthModule,
    CalificacionModule,
    CertificadoModule,
    CompraCertificadoModule,
    CompraModule,
    ConvenioModule,
    CuponModule,
    CursoModule,
    CursoMatriculadoModule,
    DocenteModule,
    EntregableModule,
    EvaluacionModule,
    FormularioCapacitacionModule,
    ForoModule,
    HistorialCompraModule,
    InstitucionModule,
    MaterialesModule,
    ModuloModule,
    PaqueteModule,
    PoliticaModule,
    PlanModule,
    ProgresoModule,
    PreguntaFrecuenteModule,
    ResenaModule,
    ServicioModule,
    UsuarioModule,
    ReporteModule,
    OpenpayModule,
    MercadoPagoModule,
    SesionEstudianteModule,
    BannerModule,
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ApiKeyMiddleware).forRoutes('*');
//   }
// }