import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  // Create the NestJS app instance
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://localhost:1312', 
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type, Authorization', 
  });
  


  const port = process.env.PORT;

  await app.listen(port);
}

bootstrap()
