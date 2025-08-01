import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './infra/config/env/environment-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('MS Customer Order Service')
    .setDescription(
      'Este microserviço é responsável pelo gerenciamento de clientes, pedidos e itens do pedido. Ele representa o ponto de entrada do sistema de pedidos, iniciando o fluxo de compra, validando produtos com o estoque e integrando-se com o microserviço de inventário via REST e **RabbitMQ.',
    )
    .setVersion('0.0.1')
    .addTag('ms-customer-service')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(env<number>('PORT'));
}
bootstrap();
