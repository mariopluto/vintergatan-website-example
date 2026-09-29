import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for API requests
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  // Parse incoming cookies
  app.use(cookieParser());

  // DEPLOYMENT & HOSTING CONFIGURATION NOTES IF YOU ARE TRYING TO SET IT UP YOURSELF:
  //
  // 1. PORT:
  //    - Defaults to 3000 for local development.
  //    - Plesk Node.js Extension or Docker will automatically inject `process.env.PORT`.
  //
  // 2. HOST BINDING ('0.0.0.0'):
  //    - Bound to '0.0.0.0' so the app accepts connections from outside its container
  //      or local process space (essential for Docker container port mapping and 
  //      Plesk/Nginx reverse proxies).
  //
  // 3. PLESK SETUP (Native Node.js Extension):
  //    - Node Version: 18.x or 20.x
  //    - Application Startup File: dist/main.js
  //    - Commands: Run `npm install`, then `npm run build`
  //
  // 4. DOCKER SETUP:
  //    - Build: docker build -t app .
  //    - Run:   docker run -d -p 3000:3000 app

  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();