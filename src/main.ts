import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors();

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  // Set up Swagger with Vercel-compatible configuration
  const config = new DocumentBuilder()
    .setTitle('Restaurant Management System')
    .setDescription('API for managing restaurant orders and generating reports')
    .setVersion('1.0')
    .addTag('orders')
    .addTag('reports')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configure Swagger with custom options for Vercel
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Restaurant Management API',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Use PORT environment variable or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();

