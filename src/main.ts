import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import dotEnv = require('dotenv');
import { urlencoded, json } from 'express';

const corsOrigins =
  process.env.NODE_ENV === 'production'
    ? [/\.web\.app$/, /\.herokuapp\.com$/]
    : [
        /\.web\.app$/,
        /\.herokuapp\.com$/,
        'http://localhost:3001',
        'http://localhost:3000',
      ];

async function bootstrap() {
  await dotEnv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
