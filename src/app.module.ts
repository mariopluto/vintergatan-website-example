import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ModuleGatewayController } from './module-gateway.controller.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, ModuleGatewayController],
  providers: [AppService],
})
export class AppModule {}