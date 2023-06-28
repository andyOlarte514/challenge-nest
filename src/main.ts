import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  // Cargar la configuración de dotenv
  config();

  const app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(3000);
}

bootstrap();
