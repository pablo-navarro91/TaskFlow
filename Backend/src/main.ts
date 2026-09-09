import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esta opción permite que solo se acepten las propiedades definidas en los DTOs (Data Transfer Objects) durante la validación de las solicitudes entrantes. Cualquier propiedad adicional será eliminada automáticamente, lo que ayuda a mantener la integridad de los datos y evita la inyección de propiedades no deseadas.
    forbidNonWhitelisted: true, // Esta opción lanza un error si se reciben propiedades adicionales que no están definidas en los DTOs. Esto proporciona una capa adicional de seguridad al garantizar que solo se procesen los datos esperados y evita posibles vulnerabilidades de seguridad.
    transform: true, // Esta opción permite que los datos de las solicitudes entrantes se transformen automáticamente en instancias de las clases definidas en los DTOs. Esto facilita el trabajo con los datos validados y permite aprovechar las funcionalidades de las clases, como métodos y propiedades, en lugar de trabajar con objetos planos.
  }));

  const configService = app.get(ConfigService); // Se obtiene una instancia del servicio de configuración para acceder a las variables de entorno definidas en el archivo .env y validadas con Joi. Esto permite que la aplicación pueda leer y utilizar estas variables de manera segura y consistente.

  const port = configService.getOrThrow<number>('PORT'); // Se obtiene el valor de la variable de entorno PORT utilizando el servicio de configuración. Si la variable no está definida, se lanzará un error. Esto asegura que la aplicación siempre tenga un puerto válido para escuchar las solicitudes entrantes.

  await app.listen(port);
}

bootstrap();