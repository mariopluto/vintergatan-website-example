import { Controller, All, Req, Res, Param } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/module')
export class ModuleGatewayController {
  @All(':moduleName/:action')
  async routeModuleRequest(
    @Param('moduleName') moduleName: string,
    @Param('action') action: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const loaderPath = path.join(process.cwd(), 'src', 'module-loader.json');
    const loaderData = JSON.parse(fs.readFileSync(loaderPath, 'utf8'));
    
    const isModuleActive = loaderData.modules.some((m: any) => m.name === moduleName);
    if (!isModuleActive) {
      return res.status(404).json({ error: 'Module not found or not active.' });
    }

    const apiPath = path.join(process.cwd(), 'src', 'modules', moduleName, 'api.ts');
    
    if (fs.existsSync(apiPath)) {
      const moduleApi = await import(`file://${apiPath}`);
      if (typeof moduleApi.handleRequest === 'function') {
        return await moduleApi.handleRequest(action, req, res);
      }
    }

    return res.status(404).json({ error: 'Module backend action not found.' });
  }
}