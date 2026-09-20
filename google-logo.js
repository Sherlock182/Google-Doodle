// Reemplaza el logo de Google por el logo personalizado de Google Doodle.
// Lee color de fondo, logos y tamano desde chrome.storage (ajustables con
// el icono de engranaje que inyecta settings-panel.js).
(function () {
  'use strict';

  const MARK = 'data-gd-logo';
  const DEFAULT_FULL = chrome.runtime.getURL('logo.svg');
  const DEFAULT_COMPACT = chrome.runtime.getURL('logo-compact.svg');
  const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
  const DARK_PRESET = window.GDogleSettings.DARK_PRESET;

  let settings = { bgColor: '', logoFull: '', logoCompact: '', logoSize: 380, darkMode: false };

  const HOME_SELECTORS = [
    'svg.lnXdpd', 'img.lnXdpd', '#hplogo',
    '#lga img', '#lga svg',
    'div.k1zIA img', 'div.k1zIA svg',
    'img[alt="Google"]', 'img[alt^="Doodle"]'
  ].join(',');

  function currentFull() { return settings.logoFull || DEFAULT_FULL; }
  function currentCompact() { return settings.logoCompact || DEFAULT_COMPACT; }

  function fullSize() {
    const w = settings.logoSize || 380;
    return { w, h: Math.round(w * 230 / 660) };
  }
  function compactSize() {
    const scale = (settings.logoSize || 380) / 380;
    return { w: Math.round(150 * scale), h: Math.round(45 * scale) };
  }

  const DARK_LOGO_FILTER = 'invert(1) hue-rotate(180deg)';

  function makeImg(kind, src, w, h) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Google Doodle';
    if (w) img.width = w;
    if (h) img.height = h;
    img.style.display = 'block';
    img.style.objectFit = 'contain';
    img.style.userSelect = 'none';
    img.style.filter = settings.darkMode ? DARK_LOGO_FILTER : '';
    img.setAttribute(MARK, kind);
    return img;
  }

  function replaceHome() {
    document.querySelectorAll(HOME_SELECTORS).forEach(el => {
      if (el.hasAttribute(MARK)) return;
      if (el.closest('#logo, #searchform, form')) return;
      const size = fullSize();
      const w = size.w || Math.round(el.getBoundingClientRect().width) || 340;
      const img = makeImg('full', currentFull(), w, Math.round(w * 230 / 660));
      img.style.margin = '0 auto';
      el.replaceWith(img);
    });
  }

  function replaceResults() {
    const spots = new Set();
    const byId = document.getElementById('logo');
    if (byId) spots.add(byId);
    document.querySelectorAll('a[href="/"], a[href^="https://www.google."][data-pid], #gb a.gb_A').forEach(a => {
      if (a.querySelector('svg, img')) spots.add(a);
    });
    spots.forEach(spot => {
      if (spot.querySelector('[' + MARK + ']')) return;
      const inner = spot.querySelector('svg, img');
      if (!inner) return;
      spot.textContent = '';
      const s = compactSize();
      const img = makeImg('compact', currentCompact(), s.w, s.h);
      img.style.marginTop = '4px';
      spot.appendChild(img);
    });
  }

  function killOldLogo() {
    document.querySelectorAll('img[src*="i.imgur.com"]').forEach(el => {
      if (el.hasAttribute(MARK)) return;
      const inHeader = el.closest('#logo');
      if (inHeader) {
        const s = compactSize();
        el.replaceWith(makeImg('compact', currentCompact(), s.w, s.h));
      } else {
        const size = fullSize();
        const w = size.w || Math.round(el.getBoundingClientRect().width) || 340;
        el.replaceWith(makeImg('full', currentFull(), w, Math.round(w * 230 / 660)));
      }
    });
  }

  function updateAllMarked() {
    document.querySelectorAll('[' + MARK + ']').forEach(img => {
      const kind = img.getAttribute(MARK);
      img.style.filter = settings.darkMode ? DARK_LOGO_FILTER : '';
      if (kind === 'full') {
        const s = fullSize();
        img.src = currentFull();
        img.width = s.w; img.height = s.h;
      } else {
        const s = compactSize();
        img.src = currentCompact();
        img.width = s.w; img.height = s.h;
      }
    });
  }

  function applyBg() {
    let styleEl = document.getElementById('gdogle-bg-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'gdogle-bg-style';
      (document.head || document.documentElement).appendChild(styleEl);
    }
    const color = settings.darkMode
      ? DARK_PRESET
      : (HEX_COLOR.test(settings.bgColor) ? settings.bgColor : '');
    const css = color ? 'html, body { background: ' + color + ' !important; }' : '';
    // Solo tocar el DOM si el valor realmente cambio: reescribir el mismo
    // textContent en cada llamada dispara el MutationObserver de abajo,
    // que a su vez vuelve a llamar apply() -> applyBg() -> bucle infinito.
    if (styleEl.textContent !== css) styleEl.textContent = css;
  }

  function apply() {
    try { applyBg(); replaceResults(); replaceHome(); killOldLogo(); } catch (e) {}
  }

  function mountGear() {
    if (document.getElementById('gdogle-settings-host')) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', mountGear, { once: true });
      return;
    }
    try {
      window.GDogleSettings.mount({
        fixed: true,
        defaultFull: DEFAULT_FULL,
        defaultCompact: DEFAULT_COMPACT,
        onApply: (s) => {
          settings = s;
          applyBg();
          updateAllMarked();
        }
      });
    } catch (e) {}
  }

  function init() {
    chrome.storage.local.get(['gd_bgColor', 'gd_logoFull', 'gd_logoCompact', 'gd_logoSize', 'gd_darkMode'], (res) => {
      settings = {
        bgColor: res.gd_bgColor || '',
        logoFull: res.gd_logoFull || '',
        logoCompact: res.gd_logoCompact || '',
        logoSize: res.gd_logoSize || 380,
        darkMode: !!res.gd_darkMode
      };

      apply();
      document.addEventListener('DOMContentLoaded', apply);
      new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });

      chrome.storage.onChanged.addListener((changes, area) => {
        try {
          if (area !== 'local') return;
          let changed = false;
          if (changes.gd_bgColor) { settings.bgColor = changes.gd_bgColor.newValue || ''; changed = true; }
          if (changes.gd_logoFull) { settings.logoFull = changes.gd_logoFull.newValue || ''; changed = true; }
          if (changes.gd_logoCompact) { settings.logoCompact = changes.gd_logoCompact.newValue || ''; changed = true; }
          if (changes.gd_logoSize) { settings.logoSize = changes.gd_logoSize.newValue || 380; changed = true; }
          if (changes.gd_darkMode) { settings.darkMode = !!changes.gd_darkMode.newValue; changed = true; }
          if (changed) { applyBg(); updateAllMarked(); }
        } catch (e) {}
      });

      mountGear();
    });
  }

  init();
})();
