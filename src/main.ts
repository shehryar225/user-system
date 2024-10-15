import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './utils/filter/httpExceptionFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter())

  
  // Load environment variables
  dotenvConfig();

  const config = new DocumentBuilder()
  .setTitle('User System')
  .setDescription('The User Syestem API description')
  .setVersion('1.0')
  .addTag('user')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
