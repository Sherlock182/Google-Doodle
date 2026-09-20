// Componente compartido: icono de ajustes + panel para personalizar Google Doodle
// (logo completo, logo compacto, color de fondo, tamano). Se usa tanto en
// google-logo.js (content script) como en newtab.html.
(function (global) {
  'use strict';

  const KEY_BG = 'gd_bgColor';
  const KEY_FULL = 'gd_logoFull';
  const KEY_COMPACT = 'gd_logoCompact';
  const KEY_SIZE = 'gd_logoSize';
  const KEY_DARK = 'gd_darkMode';

  const DEFAULT_SIZE = 380;
  const MIN_SIZE = 200;
  const MAX_SIZE = 600;
  const DARK_PRESET = '#202124';

  function getSettings(cb) {
    chrome.storage.local.get([KEY_BG, KEY_FULL, KEY_COMPACT, KEY_SIZE, KEY_DARK], (res) => {
      cb({
        bgColor: res[KEY_BG] || '',
        logoFull: res[KEY_FULL] || '',
        logoCompact: res[KEY_COMPACT] || '',
        logoSize: res[KEY_SIZE] || DEFAULT_SIZE,
        darkMode: !!res[KEY_DARK]
      });
    });
  }

  function saveSettings(partial, cb) {
    const data = {};
    if ('bgColor' in partial) data[KEY_BG] = partial.bgColor;
    if ('logoFull' in partial) data[KEY_FULL] = partial.logoFull;
    if ('logoCompact' in partial) data[KEY_COMPACT] = partial.logoCompact;
    if ('logoSize' in partial) data[KEY_SIZE] = partial.logoSize;
    if ('darkMode' in partial) data[KEY_DARK] = partial.darkMode;
    chrome.storage.local.set(data, cb || function () {});
  }

  function onChange(cb) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes[KEY_BG] || changes[KEY_FULL] || changes[KEY_COMPACT] || changes[KEY_SIZE] || changes[KEY_DARK]) {
        getSettings(cb);
      }
    });
  }

  function fileToDataUrl(file, cb) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  }

  const GEAR_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">' +
    '<path d="M19.14 12.94a7.14 7.14 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.61 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.14 7.14 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.42.32.6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.05.28.29.42.5.42h4c.24 0 .45-.17.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.24.1.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/></svg>';

  function mount(opts) {
    opts = opts || {};
    const host = document.createElement('div');
    host.id = 'gdogle-settings-host';
    host.style.position = opts.fixed ? 'fixed' : 'absolute';
    if (opts.fixed) {
      host.style.right = '18px';
      host.style.bottom = '18px';
      host.style.zIndex = '2147483000';
    }
    (opts.anchor || document.body).appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    // No usamos shadow.innerHTML = html directamente: google.com aplica una
    // Content-Security-Policy con Trusted Types que bloquea asignar HTML como
    // texto plano a innerHTML. DOMParser crea un documento aparte que no esta
    // sujeto a esa politica, y de ahi movemos los nodos ya construidos.
    const html =
      '<style>' +
      '.gear-btn{cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.06);color:#5f6368;' +
      'opacity:.55;transition:opacity .15s,background .15s;font-family:arial,sans-serif;border:none;}' +
      '.gear-btn:hover{opacity:1;background:rgba(0,0,0,.12);}' +
      '@media (prefers-color-scheme: dark){' +
      '.gear-btn{background:rgba(255,255,255,.08);color:#e8eaed;}' +
      '.gear-btn:hover{background:rgba(255,255,255,.16);}}' +
      '.panel{position:absolute;right:0;bottom:36px;width:270px;background:#fff;color:#202124;' +
      'border-radius:10px;padding:16px;box-shadow:0 4px 18px rgba(0,0,0,.22);' +
      'font-family:arial,sans-serif;font-size:13px;display:none;box-sizing:border-box;}' +
      '.panel.open{display:block;}' +
      '@media (prefers-color-scheme: dark){' +
      '.panel{background:#303134;color:#e8eaed;box-shadow:0 4px 18px rgba(0,0,0,.5);}}' +
      'h3{font:700 13px arial,sans-serif;margin:0 0 10px;}' +
      'label{display:block;font:12px arial,sans-serif;margin:10px 0 4px;opacity:.8;}' +
      'input[type="color"]{width:40px;height:26px;border:none;padding:0;background:none;cursor:pointer;vertical-align:middle;}' +
      'input[type="range"]{width:100%;box-sizing:border-box;}' +
      'input[type="file"]{display:block;font:11px arial,sans-serif;color:inherit;max-width:150px;}' +
      '.row{display:flex;align-items:center;gap:8px;}' +
      '.switch-row{display:flex;align-items:center;gap:8px;cursor:pointer;font:12px arial,sans-serif;margin:2px 0 12px;}' +
      '.switch-row input{width:16px;height:16px;cursor:pointer;margin:0;}' +
      '.thumb{width:44px;height:28px;object-fit:contain;border:1px solid rgba(128,128,128,.35);border-radius:4px;background:rgba(128,128,128,.08);}' +
      '.actions{display:flex;justify-content:space-between;gap:8px;margin-top:14px;}' +
      'button.btn{cursor:pointer;font:12px arial,sans-serif;padding:6px 10px;border-radius:6px;' +
      'background:#1a73e8;color:#fff;border:none;text-align:center;}' +
      'button.btn.secondary{background:transparent;color:inherit;border:1px solid rgba(128,128,128,.4);}' +
      '.hint{font-size:11px;opacity:.65;float:right;cursor:pointer;text-decoration:underline;}' +
      '.close{cursor:pointer;float:right;opacity:.6;font:16px/1 arial,sans-serif;border:none;background:none;color:inherit;}' +
      '.close:hover{opacity:1;}' +
      '</style>' +
      '<button class="gear-btn" title="Personalizar Google Doodle">' + GEAR_SVG + '</button>' +
      '<div class="panel">' +
      '<button class="close">&times;</button>' +
      '<h3>Google Doodle</h3>' +
      '<label class="switch-row"><input type="checkbox" id="dark-toggle"> Modo oscuro de la pagina</label>' +
      '<label>Color de fondo</label>' +
      '<input type="color" id="bg-color">' +
      '<label>Logo completo (portada)</label>' +
      '<div class="row"><img class="thumb" id="thumb-full"><input type="file" id="file-full" accept="image/*"></div>' +
      '<label>Logo compacto (resultados)</label>' +
      '<div class="row"><img class="thumb" id="thumb-compact"><input type="file" id="file-compact" accept="image/*"></div>' +
      '<label>Tamano del logo <span class="hint" id="size-label"></span></label>' +
      '<input type="range" id="size-range" min="' + MIN_SIZE + '" max="' + MAX_SIZE + '" step="10">' +
      '<div class="actions">' +
      '<button class="btn secondary" id="reset-all">Restablecer todo</button>' +
      '<button class="btn" id="save">Guardar</button>' +
      '</div>' +
      '</div>';

    const parsed = new DOMParser().parseFromString(html, 'text/html');
    // El parser de documento completo mueve el <style> inicial a <head>
    // (porque va antes de cualquier contenido de body), asi que hay que
    // trasladar ambos, no solo el body, o el CSS se queda huerfano.
    [].slice.call(parsed.head.childNodes).concat([].slice.call(parsed.body.childNodes))
      .forEach((node) => shadow.appendChild(node));

    const gearBtn = shadow.querySelector('.gear-btn');
    const panel = shadow.querySelector('.panel');
    const closeBtn = shadow.querySelector('.close');
    const darkToggle = shadow.querySelector('#dark-toggle');
    const bgColor = shadow.querySelector('#bg-color');
    const fileFull = shadow.querySelector('#file-full');
    const fileCompact = shadow.querySelector('#file-compact');
    const thumbFull = shadow.querySelector('#thumb-full');
    const thumbCompact = shadow.querySelector('#thumb-compact');
    const sizeRange = shadow.querySelector('#size-range');
    const sizeLabel = shadow.querySelector('#size-label');
    const saveBtn = shadow.querySelector('#save');
    const resetAllBtn = shadow.querySelector('#reset-all');

    let pendingFull = null;
    let pendingCompact = null;
    let pendingBg = null;
    let current = { bgColor: '', logoFull: '', logoCompact: '', logoSize: DEFAULT_SIZE, darkMode: false };

    function fillFromSettings(s) {
      current = s;
      darkToggle.checked = !!s.darkMode;
      bgColor.value = s.bgColor || '#ffffff';
      bgColor.disabled = darkToggle.checked;
      thumbFull.src = s.logoFull || opts.defaultFull || '';
      thumbCompact.src = s.logoCompact || opts.defaultCompact || '';
      sizeRange.value = s.logoSize || DEFAULT_SIZE;
      sizeLabel.textContent = (s.logoSize || DEFAULT_SIZE) + 'px';
      pendingFull = null;
      pendingCompact = null;
      pendingBg = null;
    }

    getSettings(fillFromSettings);

    gearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
    document.addEventListener('click', (e) => {
      if (!host.contains(e.target)) panel.classList.remove('open');
    });

    darkToggle.addEventListener('change', () => { bgColor.disabled = darkToggle.checked; });

    bgColor.addEventListener('input', () => { pendingBg = bgColor.value; });

    fileFull.addEventListener('change', () => {
      const f = fileFull.files[0];
      if (!f) return;
      fileToDataUrl(f, (dataUrl) => { pendingFull = dataUrl; thumbFull.src = dataUrl; });
    });
    fileCompact.addEventListener('change', () => {
      const f = fileCompact.files[0];
      if (!f) return;
      fileToDataUrl(f, (dataUrl) => { pendingCompact = dataUrl; thumbCompact.src = dataUrl; });
    });

    sizeRange.addEventListener('input', () => { sizeLabel.textContent = sizeRange.value + 'px'; });

    saveBtn.addEventListener('click', () => {
      const patch = { logoSize: parseInt(sizeRange.value, 10), darkMode: darkToggle.checked };
      if (pendingBg !== null) patch.bgColor = pendingBg;
      if (pendingFull !== null) patch.logoFull = pendingFull;
      if (pendingCompact !== null) patch.logoCompact = pendingCompact;
      saveSettings(patch, () => {
        current = Object.assign({}, current, patch);
        if (opts.onApply) opts.onApply(current);
        panel.classList.remove('open');
      });
    });

    resetAllBtn.addEventListener('click', () => {
      const patch = { bgColor: '', logoFull: '', logoCompact: '', logoSize: DEFAULT_SIZE, darkMode: false };
      saveSettings(patch, () => {
        current = patch;
        if (opts.onApply) opts.onApply(current);
        fillFromSettings(current);
      });
    });

    onChange(fillFromSettings);

    return { refresh: () => getSettings(fillFromSettings) };
  }

  global.GDogleSettings = {
    getSettings, saveSettings, onChange, mount,
    DEFAULT_SIZE, MIN_SIZE, MAX_SIZE, DARK_PRESET
  };
})(typeof window !== 'undefined' ? window : this);
