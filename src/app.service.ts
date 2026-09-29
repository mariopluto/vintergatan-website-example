import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { generateNavigation } from './utils/navigation.helper.js';

interface ModuleConfig {
  name: string;
  type: 'attached' | 'separate';
  title?: string;
  order?: number;
}

interface LoaderData {
  modules: ModuleConfig[];
}

@Injectable()
export class AppService {
  private getLoaderPath(): string {
    return path.join(process.cwd(), 'src', 'module-loader.json');
  }

  private async getLoaderData(): Promise<LoaderData> {
    const loaderPath = this.getLoaderPath();
    const content = await fs.readFile(loaderPath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Helper to safely read both template.html and script.js for any module
   */
  private async loadModuleAssets(moduleName: string): Promise<{ html: string; script: string }> {
    const modDir = path.join(process.cwd(), 'src', 'modules', moduleName);
    const templatePath = path.join(modDir, 'template.html');
    const scriptPath = path.join(modDir, 'script.js');

    let html = '';
    let script = '';

    if (existsSync(templatePath)) {
      html = await fs.readFile(templatePath, 'utf8');
    }

    if (existsSync(scriptPath)) {
      const scriptContent = await fs.readFile(scriptPath, 'utf8');
      script = `\n/* --- Script from: ${moduleName} --- */\n` + scriptContent + '\n';
    }

    return { html, script };
  }

  /**
   * Assembles the main home page (all attached modules combined)
   */
  async getAssembledPage(): Promise<string> {
    const loaderData = await this.getLoaderData();
    
    // Pass 'home' so the Home navigation tab is highlighted as active
    const navHtml = generateNavigation(loaderData.modules, 'home');

    const attachedModules = loaderData.modules
      .filter((m) => m.type === 'attached')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    let modulesHtml = '';
    let modulesScript = '';

    for (const mod of attachedModules) {
      const { html, script } = await this.loadModuleAssets(mod.name);
      modulesHtml += html + '\n';
      modulesScript += script;
    }

    return this.renderLayout(navHtml, modulesHtml, modulesScript);
  }

  /**
   * Assembles a dedicated separate page by module name
   */
  async getAssembledSeparatePage(moduleName: string): Promise<string> {
    const loaderData = await this.getLoaderData();
    const navHtml = generateNavigation(loaderData.modules, moduleName);

    const targetModule = loaderData.modules.find(
      (m) => m.name === moduleName && m.type === 'separate',
    );

    if (!targetModule) {
      throw new NotFoundException(`Module '${moduleName}' not found or is not a separate page.`);
    }

    // Loads both template.html AND script.js for separate pages
    const { html: moduleHtml, script: moduleScript } = await this.loadModuleAssets(targetModule.name);

    return this.renderLayout(navHtml, moduleHtml, moduleScript);
  }
  /**
   * Injects navigation, module content, JS scripts, and optional cookie banner into the base template
   */
  private async renderLayout(
    navHtml: string,
    contentHtml: string,
    scriptHtml: string = '',
  ): Promise<string> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'index.html');
    let template = await fs.readFile(templatePath, 'utf8');

    // Configuration toggle for the cookie compliance banner
    const enableCookieBanner = true; 

    const cookieBannerHtml = enableCookieBanner ? `
      <div id="cookie-banner" class="fixed bottom-4 left-4 max-w-md bg-gray-900 border border-gray-700 text-white p-5 rounded-xl shadow-2xl z-50 hidden flex flex-col gap-3">
          <h3 class="font-bold text-base">🍪 Privacy & Cookie Preferences</h3>
          <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We use essential cookies to run our site. With your permission, we also use optional cookies for analytics and marketing.
          </p>

          <!-- Collapsible Preferences Panel -->
          <div id="cookie-preferences-panel" class="hidden flex flex-col gap-2.5 py-2 border-y border-gray-800 my-1 text-xs">
              <label class="flex items-center justify-between cursor-pointer">
                  <span class="text-gray-300 font-medium">Essential (Required)</span>
                  <input type="checkbox" checked disabled class="accent-indigo-600 cursor-not-allowed">
              </label>
              <label class="flex items-center justify-between cursor-pointer">
                  <span class="text-gray-300">Analytics (Traffic & Performance)</span>
                  <input type="checkbox" id="pref-analytics" class="accent-indigo-600 rounded cursor-pointer">
              </label>
              <label class="flex items-center justify-between cursor-pointer">
                  <span class="text-gray-300">Marketing (Targeted Ads)</span>
                  <input type="checkbox" id="pref-marketing" class="accent-indigo-600 rounded cursor-pointer">
              </label>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-1 justify-between items-center">
              <button id="cookie-toggle-prefs" class="text-xs text-gray-400 hover:text-white underline cursor-pointer transition-colors">
                  Customize
              </button>
              <div class="flex gap-2">
                  <button id="cookie-reject" class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition-colors border border-gray-600 cursor-pointer">
                      Reject All
                  </button>
                  <button id="cookie-accept" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer">
                      Accept All
                  </button>
              </div>
          </div>
      </div>
    ` : '';

    const cookieScriptHtml = enableCookieBanner ? `
      const banner = document.getElementById('cookie-banner');
      const prefsPanel = document.getElementById('cookie-preferences-panel');
      const togglePrefsBtn = document.getElementById('cookie-toggle-prefs');
      const acceptBtn = document.getElementById('cookie-accept');
      const rejectBtn = document.getElementById('cookie-reject');

      const analyticsCheckbox = document.getElementById('pref-analytics');
      const marketingCheckbox = document.getElementById('pref-marketing');

      const hasConsented = document.cookie.split('; ').some(row => row.startsWith('cookie_consent='));

      if (banner && !hasConsented) {
          banner.classList.remove('hidden');
      }

      if (togglePrefsBtn && prefsPanel) {
          togglePrefsBtn.addEventListener('click', () => {
              const isHidden = prefsPanel.classList.toggle('hidden');
              togglePrefsBtn.textContent = isHidden ? 'Customize' : 'Hide Preferences';
          });
      }

      const saveConsent = (analytics, marketing) => {
          const consentData = JSON.stringify({ analytics, marketing });
          document.cookie = \`cookie_consent=\${encodeURIComponent(consentData)}; path=/; max-age=\${60*60*24*180}; SameSite=Lax\`;
          if (banner) banner.classList.add('hidden');
      };

      if (acceptBtn) {
          acceptBtn.addEventListener('click', () => {
              saveConsent(true, true);
          });
      }

      if (rejectBtn) {
          rejectBtn.addEventListener('click', () => {
              if (prefsPanel && !prefsPanel.classList.contains('hidden')) {
                  saveConsent(analyticsCheckbox.checked, marketingCheckbox.checked);
              } else {
                  saveConsent(false, false);
              }
          });
      }
    ` : '';

    // Replace all placeholders
    template = template.replace('{{NAV}}', navHtml);
    template = template.replace('{{CONTENT}}', contentHtml);
    template = template.replace('{{SCRIPTS}}', scriptHtml);
    template = template.replace('{{COOKIE_SCRIPT}}', cookieScriptHtml);
    template = template.replace('{{COOKIE_BANNER}}', cookieBannerHtml);

    return template;
  }
  
}