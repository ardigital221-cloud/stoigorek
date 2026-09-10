/**
 * ПАМЯТЬ И ЗАБОТА • ПАВЛОДАР
 * 1. Интерактивная корзина услуг (выбор из карточек каталога и калькулятора)
 * 2. Автоматический расчет общей суммы в тенге (₸)
 * 3. Генерация готового шаблона сообщения и мгновенное перенаправление в WhatsApp (+7 705 126 5477)
 * 4. Липкая нижняя панель корзины и модальное окно оформления
 * 5. Слайдер «До / После» с авто-показом
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMiniSlider();
  initBeforeAfterSlider();
  initCalculatorAndCart();
  initFaqAccordion();
  initMobileNavigation();
  initScrollReveal();
});

/* ==========================================================================
   КОНФИГУРАЦИЯ УСЛУГ И ТАРИФОВ
   ========================================================================== */
const SERVICES_DATA = {
  cleaning: {
    id: 'cleaning',
    name: 'Комплексная уборка участка',
    basePrice: 8000,
    desc: 'Выкорчевка бурьяна с корнем, сбор и вывоз мешков мусора, подметание цоколя'
  },
  paint_fence: {
    id: 'paint_fence',
    name: 'Покраска металлической оградки',
    basePrice: 14000,
    desc: 'Зачистка от ржавчины, грунтовка, 2 слоя кузнечной эмали Hammerite'
  },
  paint_table: {
    id: 'paint_table',
    name: 'Покраска столика и лавочки',
    basePrice: 5000,
    desc: 'Шлифовка, обработка защитной пропиткой и эмалью'
  },
  stone_wash: {
    id: 'stone_wash',
    name: 'Мытье памятника и полировка',
    basePrice: 4000,
    desc: 'Смывка мха и грязи био-шампунем, полировка защитным гидрофобизатором'
  },
  herbicides: {
    id: 'herbicides',
    name: 'Защита от сорняков (гербициды)',
    basePrice: 5000,
    desc: 'Глубокая обработка почвы гербицидом сплошного действия на весь сезон'
  },
  paint_cross: {
    id: 'paint_cross',
    name: 'Реставрация надписей и креста',
    basePrice: 4500,
    desc: 'Обновление золотых букв на камне, покраска креста'
  },
  marble_chips: {
    id: 'marble_chips',
    name: 'Отсыпка мраморной крошкой',
    basePrice: 28000,
    desc: 'Снятие грунта, плотный геотекстиль, бордюрный кант, 200 кг белой крошки'
  },
  fresh_flowers: {
    id: 'fresh_flowers',
    name: 'Возложение живых цветов + лампада',
    basePrice: 6000,
    desc: 'Свежие розы/гвоздики, зажжение поминальной лампады с фотоотчетом'
  }
};

const CEMETERIES_DATA = {
  suvorovskoe: { name: 'Суворовское кладбище (Павлодар)', surcharge: 0 },
  pahomovskoe: { name: 'Пахомовское кладбище (Павлодар)', surcharge: 0 },
  muslim: { name: 'Мусульманское городское кладбище', surcharge: 0 },
  usolskoe: { name: 'Усольское кладбище (старое)', surcharge: 0 },
  new_cemetery: { name: 'Новое кладбище (пригород)', surcharge: 2000 },
  leninsky: { name: 'Кладбище пос. Ленинский', surcharge: 2500 },
  other_region: { name: 'Другое в Павлодарской обл.', surcharge: 4500 }
};

const GRAVE_SIZES = {
  single: { name: 'Одиночное (до 5 м²)', multiplier: 1.0 },
  double: { name: 'Двойное (до 10 м²)', multiplier: 1.6 },
  family: { name: 'Семейный мемориал (от 12 м²)', multiplier: 2.3 }
};

// Состояние корзины
const cartState = {
  selectedServices: new Set(['cleaning', 'paint_fence']), // По умолчанию 2 основные услуги
  graveSize: 'single',
  cemetery: 'suvorovskoe',
  timing: 'standard',
  clientName: '',
  totalAmount: 0
};

/* ==========================================================================
   ИНТЕРАКТИВНАЯ КОРЗИНА И СИНХРОНИЗАЦИЯ
   ========================================================================== */
function initCalculatorAndCart() {
  // 1. Кнопки «В корзину» на карточках каталога
  const catalogToggleBtns = document.querySelectorAll('.btn-toggle-cart');
  catalogToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceId = btn.getAttribute('data-service');
      toggleServiceInCart(serviceId);
    });
  });

  // 2. Чекбоксы в калькуляторе
  const calcCheckboxes = document.querySelectorAll('input[name="service_item"]');
  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const serviceId = cb.value;
      if (cb.checked) {
        cartState.selectedServices.add(serviceId);
      } else {
        cartState.selectedServices.delete(serviceId);
      }
      updateCartAndCalculator();
    });
  });

  // 3. Радиокнопки размера могилки
  const graveRadios = document.querySelectorAll('input[name="grave_size"]');
  graveRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      cartState.graveSize = radio.value;
      updateCartAndCalculator();
    });
  });

  // 4. Селект кладбища
  const cemeterySelect = document.getElementById('cemeterySelect');
  if (cemeterySelect) {
    cemeterySelect.addEventListener('change', () => {
      cartState.cemetery = cemeterySelect.value;
      updateCartAndCalculator();
    });
  }

  // 5. Радиокнопки регулярности
  const timingRadios = document.querySelectorAll('input[name="timing_option"]');
  timingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      cartState.timing = radio.value;
      updateCartAndCalculator();
    });
  });

  // 6. Имя клиента
  const nameInput = document.getElementById('clientName');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      cartState.clientName = nameInput.value.trim();
      renderWhatsAppPreview();
    });
  }

  // 7. Готовые пакеты в 1 клик
  const presetChips = document.querySelectorAll('.preset-chip-btn');
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const preset = chip.getAttribute('data-preset');
      if (preset === 'clean') {
        cartState.selectedServices = new Set(['cleaning', 'stone_wash']);
      } else if (preset === 'paint') {
        cartState.selectedServices = new Set(['cleaning', 'paint_fence', 'paint_table']);
      } else if (preset === 'all_inclusive') {
        cartState.selectedServices = new Set(['cleaning', 'stone_wash', 'paint_fence', 'paint_table', 'herbicides', 'fresh_flowers']);
      } else if (preset === 'marble') {
        cartState.selectedServices = new Set(['cleaning', 'marble_chips', 'paint_fence', 'stone_wash']);
      }
      updateCartAndCalculator();
    });
  });

  // 8. Кнопки открытия модального окна корзины
  const openCartBtns = document.querySelectorAll('.btn-open-cart-modal, .header-cart-btn');
  openCartBtns.forEach(btn => {
    btn.addEventListener('click', openCartModal);
  });

  // 9. Закрытие модального окна корзины
  const modalBackdrop = document.getElementById('cartModalBackdrop');
  const closeModalBtn = document.getElementById('btnCloseCartModal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCartModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeCartModal();
    });
  }

  // 10. Кнопки отправки в WhatsApp
  const submitBtns = document.querySelectorAll('#btnSubmitCalcWa, #btnModalSubmitWa, #btnStickySubmitWa');
  submitBtns.forEach(btn => {
    btn.addEventListener('click', handleSendWhatsAppOrder);
  });

  // Начальная синхронизация
  updateCartAndCalculator();
}

function toggleServiceInCart(serviceId) {
  if (cartState.selectedServices.has(serviceId)) {
    cartState.selectedServices.delete(serviceId);
    showToast(`Услуга «${SERVICES_DATA[serviceId].name}» удалена из корзины`);
  } else {
    cartState.selectedServices.add(serviceId);
    showToast(`Услуга «${SERVICES_DATA[serviceId].name}» добавлена в корзину!`);
  }
  updateCartAndCalculator();
}

function updateCartAndCalculator() {
  const sizeData = GRAVE_SIZES[cartState.graveSize] || GRAVE_SIZES.single;
  const cemeteryData = CEMETERIES_DATA[cartState.cemetery] || CEMETERIES_DATA.suvorovskoe;

  // 1. Синхронизация кнопок на карточках каталога
  const catalogBtns = document.querySelectorAll('.btn-toggle-cart');
  catalogBtns.forEach(btn => {
    const sId = btn.getAttribute('data-service');
    if (cartState.selectedServices.has(sId)) {
      btn.classList.add('in-cart');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        <span>✓ В корзине</span>
      `;
    } else {
      btn.classList.remove('in-cart');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span>+ В корзину</span>
      `;
    }
  });

  // 2. Синхронизация чекбоксов в калькуляторе
  const calcCheckboxes = document.querySelectorAll('input[name="service_item"]');
  calcCheckboxes.forEach(cb => {
    cb.checked = cartState.selectedServices.has(cb.value);
  });

  // 3. Подсчет стоимости
  let subtotal = 0;
  const itemsList = [];

  cartState.selectedServices.forEach(sId => {
    const sItem = SERVICES_DATA[sId];
    if (sItem) {
      let price = sItem.basePrice;
      if (['cleaning', 'paint_fence', 'herbicides', 'marble_chips'].includes(sId)) {
        price = Math.round(sItem.basePrice * sizeData.multiplier);
      }
      subtotal += price;
      itemsList.push({ id: sId, name: sItem.name, price: price });
    }
  });

  let timingFactor = 1.0;
  let timingLabel = 'Разовый выезд';
  if (cartState.timing === 'twice_year') {
    timingFactor = 0.9;
    timingLabel = '2 раза в год (-10%)';
  } else if (cartState.timing === 'annual') {
    timingFactor = 0.85;
    timingLabel = 'Годовой абонемент (-15%)';
  }

  let grandTotal = (subtotal * timingFactor) + cemeteryData.surcharge;
  grandTotal = Math.round(grandTotal / 500) * 500;
  if (grandTotal < 0) grandTotal = 0;
  cartState.totalAmount = grandTotal;

  // 4. Обновление счетчиков и текстов
  animatePriceCounter(grandTotal);
  renderSummaryItems(itemsList, cemeteryData, timingFactor, timingLabel);
  renderStickyBar(itemsList.length, grandTotal);
  renderHeaderBadge(itemsList.length);
  renderModalItems(itemsList, grandTotal);
  renderWhatsAppPreview();
}

function renderHeaderBadge(count) {
  const badge = document.getElementById('headerCartCount');
  if (badge) badge.textContent = count;
}

function renderStickyBar(count, total) {
  const stickyBar = document.getElementById('stickyCartBar');
  const stickyCount = document.getElementById('stickyCartCount');
  const stickyTotal = document.getElementById('stickyCartTotal');
  const floatingWa = document.querySelector('.floating-wa-widget');

  if (!stickyBar) return;

  if (count > 0) {
    stickyBar.classList.add('visible');
    if (floatingWa) floatingWa.classList.add('hidden-by-cart');
    if (stickyCount) stickyCount.textContent = `${count} ${pluralizeServices(count)}`;
    if (stickyTotal) stickyTotal.textContent = formatCurrency(total);
  } else {
    stickyBar.classList.remove('visible');
    if (floatingWa) floatingWa.classList.remove('hidden-by-cart');
  }
}

function pluralizeServices(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'услуга';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'услуги';
  return 'услуг';
}

function renderSummaryItems(items, cemetery, factor, timingLabel) {
  const container = document.getElementById('summaryItemsList');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="summary-item-row" style="color: var(--text-muted); font-style: italic;">
        Корзина пуста. Добавьте услуги кнопками «+ В корзину» выше!
      </div>
    `;
    return;
  }

  let html = '';
  items.forEach(item => {
    html += `
      <div class="summary-item-row">
        <span class="summary-item-name">${item.name}</span>
        <span class="summary-item-price">${formatCurrency(item.price)}</span>
      </div>
    `;
  });

  if (cemetery.surcharge > 0) {
    html += `
      <div class="summary-item-row" style="color: var(--gold-600); font-weight: 600;">
        <span class="summary-item-name">Выезд (${cemetery.name})</span>
        <span class="summary-item-price">+${formatCurrency(cemetery.surcharge)}</span>
      </div>
    `;
  }

  if (factor < 1.0) {
    html += `
      <div class="summary-item-row" style="color: var(--emerald-600); font-weight: 600;">
        <span class="summary-item-name">Скидка за регулярность</span>
        <span class="summary-item-price">${timingLabel}</span>
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderModalItems(items, total) {
  const container = document.getElementById('cartModalItemsList');
  const modalTotalEl = document.getElementById('cartModalTotalNumber');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px 0; color: var(--text-muted);">
        В корзине пока нет услуг. Выберите их в каталоге!
      </div>
    `;
    if (modalTotalEl) modalTotalEl.textContent = '0 ₸';
    return;
  }

  let html = '';
  items.forEach(item => {
    html += `
      <div class="cart-modal-item">
        <span class="cart-item-title">${item.name}</span>
        <div class="cart-item-right">
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
          <button type="button" class="btn-remove-item" onclick="toggleServiceInCart('${item.id}')" title="Удалить из корзины">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (modalTotalEl) modalTotalEl.textContent = formatCurrency(total);
}

function openCartModal() {
  const modal = document.getElementById('cartModalBackdrop');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  const modal = document.getElementById('cartModalBackdrop');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ГЕНЕРАЦИЯ ШАБЛОНА СООБЩЕНИЯ ДЛЯ WHATSAPP
function compileWhatsAppTemplate() {
  const clientName = cartState.clientName ? cartState.clientName : 'Клиент';
  const cemeteryData = CEMETERIES_DATA[cartState.cemetery] || CEMETERIES_DATA.suvorovskoe;
  const sizeData = GRAVE_SIZES[cartState.graveSize] || GRAVE_SIZES.single;

  const itemsNames = [];
  cartState.selectedServices.forEach(sId => {
    const item = SERVICES_DATA[sId];
    if (item) itemsNames.push(`• ${item.name}`);
  });

  let message = `Здравствуйте! Сформировал(а) заказ на сайте «Память и Забота»:\n\n`;
  message += `👤 Заказчик: ${clientName}\n`;
  message += `📍 Кладбище: ${cemeteryData.name}\n`;
  message += `📐 Участок: ${sizeData.name}\n\n`;
  message += `🛒 Выбранные услуги из корзины (${itemsNames.length}):\n`;
  message += `${itemsNames.join('\n')}\n\n`;
  message += `💰 Общая сумма к оплате: ${formatCurrency(cartState.totalAmount)}\n\n`;
  message += `Пожалуйста, подтвердите заказ и сориентируйте по дате выезда мастера!`;

  return message;
}

function renderWhatsAppPreview() {
  const previewBox = document.getElementById('waPreviewText');
  const modalPreviewBox = document.getElementById('modalWaPreviewText');

  const compiled = compileWhatsAppTemplate();
  if (previewBox) previewBox.textContent = compiled;
  if (modalPreviewBox) modalPreviewBox.textContent = compiled;
}

function handleSendWhatsAppOrder(e) {
  if (e) e.preventDefault();

  if (cartState.selectedServices.size === 0) {
    showToast('Пожалуйста, добавьте хотя бы одну услугу в корзину!');
    return;
  }

  const message = compileWhatsAppTemplate();
  const waUrl = `https://wa.me/77051265477?text=${encodeURIComponent(message)}`;

  showToast('Перенаправляем в WhatsApp (+7 705 126 5477)...');
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 350);
}

// Плавный счетчик цены
let currentDisplayValue = 0;
function animatePriceCounter(targetValue) {
  const el = document.getElementById('calcTotalNumber');
  if (!el) return;

  const startValue = currentDisplayValue;
  const duration = 250;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const val = Math.round(startValue + (targetValue - startValue) * progress);

    el.textContent = formatCurrency(val);
    currentDisplayValue = val;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = formatCurrency(targetValue);
      currentDisplayValue = targetValue;
    }
  }

  requestAnimationFrame(update);
}

function formatCurrency(num) {
  return num.toLocaleString('ru-RU') + ' ₸';
}

/* ==========================================================================
   СЛАЙДЕР «ДО / ПОСЛЕ» С АВТО-ПОКАЗОМ
   ========================================================================== */
const CASES_DATA = {
  weeds_cleaning: {
    title: 'Генеральная уборка и расчистка от бурьяна',
    tag: 'Суворовское кладбище • Павлодар',
    desc: 'Захоронение сильно заросло полынью, репейником и кустарником. Памятник покрылся пылью и следами осадков.',
    time: '4 часа работы',
    scope: 'Выкорчевка бурьяна с корнем, сбор и вывоз 4 мешков мусора, мытье черного гранита био-шампунем, полировка воском, влажная уборка плитки.',
    price: '11 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="daySkyDust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="60%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#f1f5f9"/>
          </linearGradient>
          <linearGradient id="dryEarth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#a89a85"/>
            <stop offset="100%" stop-color="#847663"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#daySkyDust)"/>
        <path d="M 0 330 Q 150 310 300 340 T 600 320 T 800 335 L 800 600 L 0 600 Z" fill="#94a3b8" opacity="0.4"/>
        <rect y="350" width="800" height="250" fill="url(#dryEarth)"/>
        <rect x="330" y="160" width="140" height="230" rx="12" fill="#64748b" stroke="#475569" stroke-width="3"/>
        <path d="M 315 380 L 485 380 L 500 420 L 300 420 Z" fill="#475569"/>
        <circle cx="400" cy="205" r="16" fill="#475569"/>
        <rect x="360" y="235" width="80" height="8" rx="3" fill="#334155"/>
        <rect x="350" y="255" width="100" height="8" rx="3" fill="#334155"/>
        <path d="M 120 340 L 120 480 M 170 350 L 170 490 M 580 340 L 580 480 M 630 350 L 630 490" stroke="#78350f" stroke-width="5"/>
        <path d="M 90 540 Q 130 380 170 470 Q 210 340 250 520" stroke="#4d7c0f" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="400" cy="460" rx="160" ry="35" fill="#71624f"/>
        <path d="M 310 490 Q 340 360 370 470 Q 390 330 410 480" stroke="#4d7c0f" stroke-width="7" fill="none"/>
        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО УБОРКИ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#bae6fd"/>
            <stop offset="60%" stop-color="#e0f2fe"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
          <linearGradient id="jetBlackGranite" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="25%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="pureGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#brightSky)"/>
        <circle cx="700" cy="90" r="45" fill="#fef08a" opacity="0.85"/>
        <rect y="350" width="800" height="250" fill="#334155"/>
        <path d="M 210 410 L 590 410 L 620 465 L 180 465 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="330" y="140" width="140" height="250" rx="14" fill="url(#jetBlackGranite)" stroke="#64748b" stroke-width="2"/>
        <path d="M 315 385 L 485 385 L 500 425 L 300 425 Z" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <ellipse cx="400" cy="195" rx="28" ry="34" fill="#1e293b" stroke="url(#pureGold)" stroke-width="2.5"/>
        <text x="400" y="265" fill="url(#pureGold)" font-family="'Playfair Display', serif" font-weight="700" font-size="14" text-anchor="middle">АЛЕКСАНДРОВ И. В.</text>
        <text x="400" y="286" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="600" font-size="11" text-anchor="middle">1948 — 2018</text>
        <path d="M 120 340 L 120 480 M 170 350 L 170 490 M 580 340 L 580 480" stroke="#0f172a" stroke-width="6"/>
        <rect x="635" y="30" width="135" height="34" rx="17" fill="#16a34a"/>
        <text x="702" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">РЕЗУЛЬТАТ</text>
      </svg>
    `
  },
  fence_painting: {
    title: 'Зачистка от ржавчины и покраска оградки',
    tag: 'Пахомовское кладбище • Павлодар',
    desc: 'Металлическая ограда 2.5 × 2.0 м не красилась более 5 лет. Старая краска потрескалась, металл покрылся коррозией.',
    time: '5 часов работы',
    scope: 'Механическая зачистка щетками до чистого металла, нанесение антикор-грунта, покраска в 2 слоя эмалью Hammerite с золочением пик.',
    price: '16 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e2e8f0"/>
        <rect y="360" width="800" height="240" fill="#94a3b8"/>
        <g stroke="#78350f" stroke-linecap="round">
          <rect x="140" y="160" width="24" height="320" fill="#78350f"/>
          <rect x="640" y="160" width="24" height="320" fill="#78350f"/>
          <rect x="150" y="220" width="500" height="16" fill="#92400e"/>
          <rect x="150" y="420" width="500" height="16" fill="#92400e"/>
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 360 200 L 360 440 M 460 200 L 460 440 M 560 200 L 560 440" stroke="#b45309" stroke-width="8"/>
        </g>
        <circle cx="260" cy="280" r="14" fill="#ea580c" opacity="0.8"/>
        <circle cx="360" cy="340" r="18" fill="#c2410c" opacity="0.9"/>
        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО РАБОТ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#f0fdf4"/>
        <rect y="360" width="800" height="240" fill="#64748b"/>
        <rect x="140" y="160" width="24" height="320" fill="#0f172a"/>
        <circle cx="152" cy="150" r="14" fill="#eab308"/>
        <rect x="640" y="160" width="24" height="320" fill="#0f172a"/>
        <circle cx="652" cy="150" r="14" fill="#eab308"/>
        <rect x="150" y="220" width="500" height="16" fill="#0f172a"/>
        <rect x="150" y="420" width="500" height="16" fill="#0f172a"/>
        <g stroke="#0f172a" stroke-width="9" stroke-linecap="round">
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 360 200 L 360 440 M 460 200 L 460 440 M 560 200 L 560 440"/>
        </g>
        <polygon points="210,180 204,200 216,200" fill="#eab308"/>
        <polygon points="260,180 254,200 266,200" fill="#eab308"/>
        <polygon points="360,180 354,200 366,200" fill="#eab308"/>
        <polygon points="460,180 454,200 466,200" fill="#eab308"/>
        <polygon points="560,180 554,200 566,200" fill="#eab308"/>
        <rect x="635" y="30" width="135" height="34" rx="17" fill="#16a34a"/>
        <text x="702" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ПОКРАШЕНО</text>
      </svg>
    `
  },
  marble_gravel: {
    title: 'Отсыпка мраморной крошкой',
    tag: 'Новое городское кладбище • Павлодар',
    desc: 'После сильных дождей могильный холм размывало, земля превращалась в грязь.',
    time: '6 часов работы',
    scope: 'Выемка грунта, плотный геотекстиль, бордюрный кант, 250 кг белой мраморной крошки.',
    price: '34 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e2e8f0"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#94a3b8"/>
        <ellipse cx="400" cy="450" rx="260" ry="80" fill="#78716c"/>
        <rect x="350" y="200" width="100" height="190" rx="8" fill="#64748b"/>
        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО РАБОТ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e0f2fe"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#94a3b8"/>
        <polygon points="120,490 680,490 620,380 180,380" fill="#334155"/>
        <polygon points="135,480 665,480 610,390 190,390" fill="#ffffff"/>
        <rect x="350" y="170" width="100" height="220" rx="10" fill="#0f172a"/>
        <rect x="635" y="30" width="135" height="34" rx="17" fill="#16a34a"/>
        <text x="702" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">МРАМОР 100%</text>
      </svg>
    `
  }
};

let currentCaseKey = 'weeds_cleaning';
let isDraggingSlider = false;
let autoPlayInterval = null;
let autoPlayDirection = 1;
let autoPlayPos = 50;

function initBeforeAfterSlider() {
  const wrapper = document.getElementById('baSliderWrapper');
  const beforeContainer = document.getElementById('baBeforeImg');
  const afterContainer = document.getElementById('baAfterImg');
  const handle = document.getElementById('baHandle');
  const tabs = document.querySelectorAll('.case-tab-btn');
  const btnAutoPlay = document.getElementById('btnAutoPlay');

  if (!wrapper || !beforeContainer || !afterContainer || !handle) return;

  renderCurrentCase();

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCaseKey = tab.getAttribute('data-case');
      renderCurrentCase();
      setSliderPosition(50);
    });
  });

  if (btnAutoPlay) {
    btnAutoPlay.addEventListener('click', () => {
      if (autoPlayInterval) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  function startAutoPlay() {
    if (btnAutoPlay) {
      btnAutoPlay.classList.add('playing');
      btnAutoPlay.querySelector('span').textContent = 'Пауза показа';
    }
    autoPlayInterval = setInterval(() => {
      autoPlayPos += autoPlayDirection * 0.75;
      if (autoPlayPos >= 85) autoPlayDirection = -1;
      else if (autoPlayPos <= 15) autoPlayDirection = 1;
      setSliderPosition(autoPlayPos);
    }, 25);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    if (btnAutoPlay) {
      btnAutoPlay.classList.remove('playing');
      btnAutoPlay.querySelector('span').textContent = '▶ Авто-показ';
    }
  }

  function onMove(clientX) {
    stopAutoPlay();
    const rect = wrapper.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let pct = (offsetX / rect.width) * 100;
    if (pct < 2) pct = 2;
    if (pct > 98) pct = 98;
    setSliderPosition(pct);
  }

  function setSliderPosition(percentage) {
    afterContainer.style.width = percentage + '%';
    handle.style.left = percentage + '%';

    const afterSvgWrap = afterContainer.querySelector('.ba-svg-wrapper');
    if (afterSvgWrap && wrapper.offsetWidth > 0) {
      afterSvgWrap.style.width = wrapper.offsetWidth + 'px';
    }
  }

  wrapper.addEventListener('mousedown', (e) => {
    isDraggingSlider = true;
    onMove(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingSlider) return;
    onMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDraggingSlider = false;
  });

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDraggingSlider = true;
      onMove(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingSlider || e.touches.length !== 1) return;
    onMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDraggingSlider = false;
  });

  window.addEventListener('resize', () => {
    const currentPct = parseFloat(handle.style.left) || 50;
    setSliderPosition(currentPct);
  });

  setTimeout(() => setSliderPosition(50), 100);
}

function renderCurrentCase() {
  const caseItem = CASES_DATA[currentCaseKey];
  if (!caseItem) return;

  const beforeContainer = document.getElementById('baBeforeImg');
  const afterContainer = document.getElementById('baAfterImg');

  beforeContainer.innerHTML = caseItem.svgBefore;
  afterContainer.innerHTML = `<div class="ba-svg-wrapper">${caseItem.svgAfter}</div>`;

  document.getElementById('caseTag').textContent = caseItem.tag;
  document.getElementById('caseTitle').textContent = caseItem.title;
  document.getElementById('caseDesc').textContent = caseItem.desc;
  document.getElementById('caseTime').textContent = caseItem.time;
  document.getElementById('caseScope').textContent = caseItem.scope;
  document.getElementById('casePrice').textContent = caseItem.price;

  const btnOrder = document.getElementById('btnOrderThisCase');
  if (btnOrder) {
    const waText = encodeURIComponent(
      `Здравствуйте! Хочу заказать услугу по примеру кейса «${caseItem.title}» (${caseItem.tag}).\n` +
      `Ориентир стоимости: ${caseItem.price}.\n` +
      `Подскажите, когда возможен выезд мастера?`
    );
    btnOrder.href = `https://wa.me/77051265477?text=${waText}`;
  }
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

function initMobileNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('systemToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'systemToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3800);
}

function initHeroMiniSlider() {
  const slider = document.getElementById('heroMiniSlider');
  const afterImg = document.getElementById('heroMiniAfter');
  const divider = document.getElementById('heroMiniDivider');
  if (!slider || !afterImg || !divider) return;

  let isDown = false;

  const setPos = (x) => {
    const rect = slider.getBoundingClientRect();
    let percent = ((x - rect.left) / rect.width) * 100;
    if (percent < 5) percent = 5;
    if (percent > 95) percent = 95;
    afterImg.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    divider.style.left = `${percent}%`;
  };

  slider.addEventListener('mousedown', (e) => { isDown = true; setPos(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (isDown) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { isDown = false; });

  slider.addEventListener('touchstart', (e) => { isDown = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDown) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { isDown = false; });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

