import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import dotEnv = require('dotenv');
import { urlencoded, json } from 'express';
import { candidatesCron } from './cron/candidates';
import { employeeCron } from './cron/employee';

let corsOrigins = [process.env.FE_ORIGIN];

if (process.env.ALLOW_LOCAL_ORIGINS === 'true') {
  corsOrigins = corsOrigins.concat([
    'http://localhost:3001',
    'http://localhost:3000',
  ]);
}

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

  // swagger
  const options = new DocumentBuilder()
    .setTitle('CV generator')
    .setDescription(
      'The API for employee soft/tech assessment and cv generation',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();

candidatesCron.start();
// employeeCron.start();

console.log(`Serving at http://localhost:${process.env.PORT || 5000}`);
