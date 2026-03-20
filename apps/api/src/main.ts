import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mini Teramind API')
    .setDescription(
      'Employee activity monitoring platform — sessions, events, rules, alerts, and analytics.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('employees')
    .addTag('sessions')
    .addTag('events')
    .addTag('rules')
    .addTag('alerts')
    .addTag('stats')
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
