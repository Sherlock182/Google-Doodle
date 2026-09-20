document.getElementById('q').focus();

document.getElementById('lucky').addEventListener('click', function () {
  var q = document.getElementById('q').value.trim();
  if (!q) { location.href = 'https://www.google.com/doodles'; return; }
  location.href = 'https://www.google.com/search?btnI=1&q=' + encodeURIComponent(q);
});

function applySettings(s) {
  document.body.style.background = s.darkMode ? GDogleSettings.DARK_PRESET : (s.bgColor || '');
  var logo = document.getElementById('logo');
  logo.src = s.logoFull || 'logo.svg';
  logo.style.width = (s.logoSize || 380) + 'px';
  logo.style.filter = s.darkMode ? 'invert(1) hue-rotate(180deg)' : '';
}

GDogleSettings.getSettings(applySettings);
GDogleSettings.onChange(applySettings);
GDogleSettings.mount({
  fixed: true,
  defaultFull: 'logo.svg',
  defaultCompact: 'logo-compact.svg',
  onApply: applySettings
});
