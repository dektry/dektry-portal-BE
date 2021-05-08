import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import dotEnv = require('dotenv');

async function bootstrap() {
  await dotEnv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
