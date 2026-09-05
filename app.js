/**
 * Monitor de Divisas - Vanilla JS
 * Lógica matemática bidireccional y cambio de contexto de tasas.
 */

// 1. Estado inicial y almacenamiento en memoria de las tasas
const ratesState = {
  usdt: {
    name: 'Tasa USDT',
    label: 'Dólares (USDT)',
    symbol: '₮',
    rate: 0,
    updatedAt: 'Sincronizando...'
  },
  bcv: {
    name: 'Tasa BCV',
    label: 'Dólares (BCV)',
    symbol: '$',
    rate: 0,
    updatedAt: 'Sincronizando...'
  },
  euro: {
    name: 'Tasa Euro',
    label: 'Euros (BCV)',
    symbol: '€',
    rate: 0,
    updatedAt: 'Sincronizando...'
  }
};

let currentRateId = 'bcv';
let lastActiveInput = 'foreign'; // 'foreign' | 'ves'

// 2. Referencias al DOM
const ratesGrid = document.getElementById('rates-grid');
const rateCards = document.querySelectorAll('.rate-card');
const foreignInput = document.getElementById('foreign-input');
const vesInput = document.getElementById('ves-input');
const foreignLabel = document.getElementById('foreign-label');
const foreignSymbol = document.getElementById('foreign-symbol');
const timestampEl = document.getElementById('update-timestamp');
const copyForeignBtn = document.getElementById('copy-foreign-btn');
const copyVesBtn = document.getElementById('copy-ves-btn');

// 3. Funciones de cálculo matemático
function calculateFromForeign() {
  const currentRate = ratesState[currentRateId].rate;
  const rawValue = foreignInput.value.trim();

  if (rawValue === '' || isNaN(rawValue)) {
    vesInput.value = '';
    return;
  }

  const foreignAmount = parseFloat(rawValue);
  if (currentRate > 0) {
    vesInput.value = (foreignAmount * currentRate).toFixed(2);
  } else {
    vesInput.value = '';
  }
}

function calculateFromVes() {
  const currentRate = ratesState[currentRateId].rate;
  const rawValue = vesInput.value.trim();

  if (rawValue === '' || isNaN(rawValue)) {
    foreignInput.value = '';
    return;
  }

  const vesAmount = parseFloat(rawValue);
  if (currentRate > 0) {
    foreignInput.value = (vesAmount / currentRate).toFixed(2);
  } else {
    foreignInput.value = '';
  }
}

function recalculate() {
  if (lastActiveInput === 'ves' && vesInput.value !== '') {
    calculateFromVes();
  } else if (foreignInput.value !== '') {
    calculateFromForeign();
  }
}

// 4. Actualización de UI y Cambio de Contexto
function selectRate(rateId) {
  if (!ratesState[rateId]) return;

  currentRateId = rateId;
  const current = ratesState[rateId];

  // Actualizar clases activas en las tarjetas
  rateCards.forEach(card => {
    card.classList.toggle('active', card.dataset.rateId === rateId);
  });

  // Cambiar etiquetas del input superior
  foreignLabel.textContent = current.label;
  foreignSymbol.textContent = current.symbol;

  // Actualizar indicador de fecha de corte
  updateTimestampUI();

  // Recálculo inmediato con la nueva tasa seleccionada
  recalculate();
}

function updateTimestampUI() {
  const current = ratesState[currentRateId];
  timestampEl.textContent = `Corte de tasa: ${current.updatedAt}`;
}

function renderRatesUI() {
  for (const [key, data] of Object.entries(ratesState)) {
    const el = document.getElementById(`rate-val-${key}`);
    if (el) {
      el.textContent = data.rate > 0 ? `${data.rate.toFixed(2)} Bs` : '--';
    }
  }
}

function formatApiDate(isoString) {
  if (!isoString) return '--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// 5. Asignación de Listeners para interactividad en tiempo real
foreignInput.addEventListener('input', () => {
  lastActiveInput = 'foreign';
  calculateFromForeign();
});

vesInput.addEventListener('input', () => {
  lastActiveInput = 'ves';
  calculateFromVes();
});

ratesGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.rate-card');
  if (card && card.dataset.rateId) {
    selectRate(card.dataset.rateId);
  }
});

// 6. Conexión a la API de Divisas
async function fetchRates() {
  try {
    // Endpoint público estable con soporte CORS
    const [dolaresRes, eurosRes] = await Promise.all([
      fetch('https://ve.dolarapi.com/v1/dolares'),
      fetch('https://ve.dolarapi.com/v1/euros')
    ]);

    if (!dolaresRes.ok || !eurosRes.ok) {
      throw new Error('Error al obtener tasas');
    }

    const dolaresData = await dolaresRes.json();
    const eurosData = await eurosRes.json();

    // Mapeo de variables: usd_bcv, usdt y eur_bcv
    const usd_bcv = dolaresData.find(item => item.fuente === 'oficial');
    const usdt = dolaresData.find(item => item.fuente === 'paralelo');
    const eur_bcv = eurosData.find(item => item.fuente === 'oficial');

    if (usd_bcv && usd_bcv.promedio) {
      ratesState.bcv.rate = usd_bcv.promedio;
      ratesState.bcv.updatedAt = formatApiDate(usd_bcv.fechaActualizacion);
    }

    if (usdt && usdt.promedio) {
      ratesState.usdt.rate = usdt.promedio;
      ratesState.usdt.updatedAt = formatApiDate(usdt.fechaActualizacion);
    }

    if (eur_bcv && eur_bcv.promedio) {
      ratesState.euro.rate = eur_bcv.promedio;
      ratesState.euro.updatedAt = formatApiDate(eur_bcv.fechaActualizacion);
    }

    renderRatesUI();
    updateTimestampUI();
    recalculate();
  } catch (error) {
    console.error('Error al sincronizar tasas:', error);
    // Manejo silencioso: Se preservan las tasas en memoria sin romper la UI
    timestampEl.textContent = 'Error de conexión. Usando datos locales.';
  }
}

// Inicialización de la vista y sincronización inicial
renderRatesUI();
updateTimestampUI();
fetchRates();

// 7. Gestión de Instalación PWA (Solo en navegador, oculto si ya está instalada)
let deferredPrompt = null;
const installBtn = document.getElementById('install-btn');

// Verificar si se ejecuta en modo standalone (ya instalada como PWA)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (!isStandalone && installBtn) {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Evitar que el navegador muestre automáticamente su mini-barra
    event.preventDefault();
    deferredPrompt = event;
    // Mostrar nuestro botón de instalación
    installBtn.style.display = 'flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.style.display = 'none';
    }
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}

// 8. Control de Tema (Claro / Oscuro)
const themeToggleBtn = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeMeta) {
    themeMeta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0f172a');
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

// Sincronizar si el sistema operativo cambia de tema y no hay preferencia manual guardada
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// 9. Función para copiar resultado al portapapeles
function fallbackCopyText(text) {
  try {
    const mark = document.createElement('span');
    mark.textContent = text;
    mark.style.all = 'unset';
    mark.style.position = 'fixed';
    mark.style.top = '0';
    mark.style.left = '0';
    mark.style.clip = 'rect(0, 0, 0, 0)';
    mark.style.whiteSpace = 'pre';
    mark.style.webkitUserSelect = 'text';
    mark.style.userSelect = 'text';

    document.body.appendChild(mark);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNode(mark);
    selection.removeAllRanges();
    selection.addRange(range);

    const successful = document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(mark);
    return successful;
  } catch (err) {
    console.error('Error en fallback de copiado:', err);
    return false;
  }
}

async function copyToClipboard(text) {
  if (!text) return false;

  // 1. Intentar primero con la API nativa moderna
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('API Clipboard no disponible o bloqueada, recurriendo a fallback:', err);
    }
  }

  // 2. Método de respaldo (ideal para PWA móvil y navegadores WebKit/iOS/Android)
  return fallbackCopyText(text);
}

function setupCopyButton(button, input) {
  if (!button || !input) return;
  let timeoutId = null;

  // Evitar desenfoque del input o parpadeo del teclado virtual al pulsar el botón en móviles
  button.addEventListener('pointerdown', (e) => {
    e.preventDefault();
  });

  const performCopy = async (e) => {
    if (e) e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    const copied = await copyToClipboard(val);
    if (copied) {
      const copyIcon = button.querySelector('.copy-icon');
      const checkIcon = button.querySelector('.check-icon');

      if (timeoutId) clearTimeout(timeoutId);

      button.classList.add('copied');
      button.setAttribute('title', '¡Copiado!');
      button.setAttribute('aria-label', '¡Copiado!');
      if (copyIcon) copyIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = 'block';

      timeoutId = setTimeout(() => {
        button.classList.remove('copied');
        button.setAttribute('title', 'Copiar monto');
        button.setAttribute('aria-label', 'Copiar monto');
        if (copyIcon) copyIcon.style.display = 'block';
        if (checkIcon) checkIcon.style.display = 'none';
        timeoutId = null;
      }, 1500);
    }
  };

  button.addEventListener('click', performCopy);
}

setupCopyButton(copyForeignBtn, foreignInput);
setupCopyButton(copyVesBtn, vesInput);

