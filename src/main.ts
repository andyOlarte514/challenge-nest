import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  // Cargar la configuración de dotenv
  config();

  const app = await NestFactory.create(AppModule);
  app.use(cors());

  // Configura Swagger
  const options = new DocumentBuilder()
    .setTitle('Nest Challenge API')
    .setDescription('Challenge Nest API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Aplica el ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
