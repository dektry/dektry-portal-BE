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
    origin: process.env.API_URL,
    credentials: true,
  });
  await app.listen(process.env.API_PORT);
}
bootstrap();
