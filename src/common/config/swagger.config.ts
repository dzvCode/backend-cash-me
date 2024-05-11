import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CashMe API')
  .setDescription('The CashMe API description')
  .setVersion('1.0')
  .addTag('cashme')
  .addBearerAuth()
  .build();