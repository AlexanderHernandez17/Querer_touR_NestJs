import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Cambia esto al origen de tu aplicación Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });
  const port = process.env.PORT || 3010;
  
  app.setGlobalPrefix('v1/')
  await app.listen(port);
  console.log(`server listening at http://localhost:${port}`);
}
bootstrap();
