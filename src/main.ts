import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { FILESYSTEM_DIRECTORIES } from './constants/upload-file-path';
import { createStorageDirectories } from './utils';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  createStorageDirectories(FILESYSTEM_DIRECTORIES);

  const config = new DocumentBuilder()
    .setTitle('Restaurant example')
    .setDescription('The restaurant API description')
    .addTag('Restaurant')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);
  return app;
}
bootstrap();
