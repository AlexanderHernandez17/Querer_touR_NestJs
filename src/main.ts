import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exeption.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
  .setTitle('API de Autenticación')
  .setDescription('La API de autenticación de ejemplo')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors({
    origin: 'http://localhost:3000', // Cambia esto al origen de tu aplicación Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });
  
  const port = process.env.PORT || 3010;
  
  // app.setGlobalPrefix('v1/')
  await app.listen(port);
  console.log(`server listening at http://localhost:${port}`);
}
bootstrap();
