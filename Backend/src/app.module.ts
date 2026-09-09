import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({ //en esta sección se definen las variables de entorno que se van a utilizar en la aplicación y se validan con Joi  
        NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),

      PORT: Joi.number().port().default(3000),

      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().port().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    }),
  }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),

        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),

        autoLoadEntities: true,

        // Temporal durante el desarrollo inicial.
        synchronize: true,
      }),
    }),


    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}