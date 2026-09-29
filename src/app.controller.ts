import { Controller, Get, Param, Header, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html') // Tells NestJS to expect HTML
  async getHome(): Promise<string> {
    return await this.appService.getAssembledPage();
  }

  @Get('pages/:name')
  @Header('Content-Type', 'text/html') // Tells NestJS to expect HTML
  async getSeparatePage(@Param('name') name: string): Promise<string> {
    try {
      return await this.appService.getAssembledSeparatePage(name);
    } catch (error) {
      throw new NotFoundException('Page not found');
    }
  }
}