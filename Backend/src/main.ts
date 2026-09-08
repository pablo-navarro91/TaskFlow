import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // Se obtiene una instancia del servicio de configuración para acceder a las variables de entorno definidas en el archivo .env y validadas con Joi. Esto permite que la aplicación pueda leer y utilizar estas variables de manera segura y consistente.

  const port = configService.getOrThrow<number>('PORT'); // Se obtiene el valor de la variable de entorno PORT utilizando el servicio de configuración. Si la variable no está definida, se lanzará un error. Esto asegura que la aplicación siempre tenga un puerto válido para escuchar las solicitudes entrantes.

  await app.listen(port);
}

bootstrap();