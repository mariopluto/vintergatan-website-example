export function generateNavigation(modules: any[], currentModuleName?: string): string {
  const separateModules = modules
    .filter((m: any) => m.type === 'separate')
    .sort((a: any, b: any) => a.order - b.order);

  const isHomeActive = !currentModuleName || currentModuleName === 'home' || currentModuleName === '/';

  // Base Home link styling with cosmic glass hover effect
  let navHtml = `
    <style>
      @keyframes navDropdownSlide {
        from { opacity: 0; transform: translateY(-8px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .animate-nav-slide:not(.hidden) {
        animation: navDropdownSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    </style>
    <a href="/" class="px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isHomeActive
        ? 'bg-purple-950/80 text-cyan-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
        : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
    }">Hem</a>
  `;

  // If there are no separate modules, return early with Home link
  if (separateModules.length === 0) {
    return navHtml;
  }

  // Helper to build dropdown items with arrow indicators and cosmic active state
  const renderDropdownItems = () => separateModules.map((mod: any) => {
    const isActive = currentModuleName === mod.name;
    return `
      <a href="/pages/${mod.name}" 
         class="group/item flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
           isActive
             ? 'bg-purple-950/60 text-cyan-300 font-semibold border border-purple-500/30'
             : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900/80'
         }">
        <span>${mod.title || mod.name}</span>
        <svg class="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </a>
    `;
  }).join('');

  // --- 1. MOBILE VERSION (Dropdown with dark space card styling) ---
  navHtml += `
    <div class="relative inline-block text-left md:hidden">
      <button id="mobile-dropdown-btn" class="text-slate-300 hover:text-white font-medium inline-flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-900/80 transition-all duration-200 focus:outline-none text-sm">
        <span>Menu</span>
        <svg class="w-4 h-4 ml-1.5 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div id="mobile-dropdown-menu" class="animate-nav-slide absolute right-0 pt-2 w-52 hidden z-50 origin-top-right">
        <div class="bg-black/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl shadow-purple-950/20 p-1.5 space-y-0.5">
          ${renderDropdownItems()}
        </div>
      </div>
    </div>
  `;

  // --- 2. DESKTOP VERSION ---
  if (separateModules.length <= 3) {
    // Direct Links (Visible on md+)
    navHtml += `<div class="hidden md:flex items-center space-x-1">`;
    for (const mod of separateModules) {
      const isActive = currentModuleName === mod.name;
      navHtml += `
        <a href="/pages/${mod.name}" 
           class="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
             isActive
               ? 'bg-purple-950/80 text-cyan-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] font-semibold'
               : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
           }">
          ${mod.title || mod.name}
        </a>
      `;
    }
    navHtml += `</div>`;
  } else {
    // Hover Dropdown Menu with CSS transforms (Visible on md+)
    navHtml += `
      <div class="relative hidden md:inline-block text-left group">
        <button class="text-slate-300 group-hover:text-white font-medium inline-flex items-center px-3.5 py-1.5 rounded-lg hover:bg-slate-900/80 transition-all duration-200 focus:outline-none text-sm">
          <span>Fler Sidor</span>
          <svg class="w-4 h-4 ml-1.5 text-slate-400 group-hover:text-cyan-400 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Animated Desktop Space-Themed Card -->
        <div class="absolute right-0 top-full pt-2 w-56 opacity-0 pointer-events-none scale-95 -translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out origin-top-right z-50">
          <div class="bg-black/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl shadow-purple-950/30 p-1.5 space-y-0.5">
            ${renderDropdownItems()}
          </div>
        </div>
      </div>
    `;
  }

  return navHtml;
}