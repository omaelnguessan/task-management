import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  //add log for application
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  //for call validation pipe in application
  app.useGlobalPipes(new ValidationPipe());

  //for call interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
