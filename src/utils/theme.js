export const NEON_COLORS = [
  { name: 'Púrpura Eléctrico', hex: '#8b7cf7' },
  { name: 'Cian Ciberpunk', hex: '#00f3ff' },
  { name: 'Rosa Neón', hex: '#ff00ff' },
  { name: 'Verde Matriz', hex: '#00ff66' },
  { name: 'Naranja Láser', hex: '#ff4d00' },
  { name: 'Rojo Sangre', hex: '#ff003c' },
  { name: 'Amarillo Neón', hex: '#fcee0a' },
];

export const THEME_MODES = {
  standard: {
    '--bg-base': '#08080d',
    '--bg-surface': '#0e0e16',
    '--bg-card': '#141420',
    '--bg-card-hover': '#1a1a28',
    '--bg-elevated': '#1c1c2c',
    '--bg-input': '#111119',
  },
  oled: {
    '--bg-base': '#000000',
    '--bg-surface': '#050505',
    '--bg-card': '#0a0a0a',
    '--bg-card-hover': '#111111',
    '--bg-elevated': '#151515',
    '--bg-input': '#050505',
  }
};

export const hexToRgb = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return `${+r}, ${+g}, ${+b}`;
};

export const applyTheme = (accentHex, mode = 'standard') => {
  const root = document.documentElement;
  
  // Fondo
  const modeColors = THEME_MODES[mode] || THEME_MODES.standard;
  Object.entries(modeColors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Acentos
  const rgbStr = hexToRgb(accentHex);
  root.style.setProperty('--accent', accentHex);
  root.style.setProperty('--accent-glow', `rgba(${rgbStr}, 0.25)`);
  root.style.setProperty('--accent-bg', `rgba(${rgbStr}, 0.1)`);
  root.style.setProperty('--accent-soft', `rgba(${rgbStr}, 0.8)`);
  root.style.setProperty('--accent-dim', `rgba(${rgbStr}, 0.8)`);
  
  localStorage.setItem('app_theme_accent', accentHex);
  localStorage.setItem('app_theme_mode', mode);
};

export const loadTheme = () => {
  const accent = localStorage.getItem('app_theme_accent') || '#8b7cf7';
  const mode = localStorage.getItem('app_theme_mode') || 'standard';
  applyTheme(accent, mode);
  return { accent, mode };
};
