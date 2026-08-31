// СТО ИГОРЕК / PROAUTO - Interactive Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initModals();
  initFaq();
  initMobileNav();
  initTimer();
});

// Calculator Data
const calcServices = [
  { id: 'diag_comp', category: 'diag', name: 'Компьютерная диагностика всех систем', price: 1000 },
  { id: 'diag_road', category: 'diag', name: 'Выездная диагностика перед покупкой', price: 2500 },
  { id: 'diag_smoke', category: 'diag', name: 'Поиск подсоса воздуха дымогенератором', price: 1500 },
  
  { id: 'susp_break', category: 'susp', name: 'Замена тормозных колодок (ось)', price: 1200 },
  { id: 'susp_shock', category: 'susp', name: 'Замена амортизаторов (пары)', price: 3000 },
  { id: 'susp_lever', category: 'susp', name: 'Замена рычагов / сайлентблоков', price: 2000 },
  { id: 'susp_full', category: 'susp', name: 'Комплексный осмотр ходовой части', price: 800 },
  
  { id: 'elec_jump', category: 'elec', name: 'Прикурить АКБ / запуск (Выезд 24/7)', price: 1500 },
  { id: 'elec_battery', category: 'elec', name: 'Замена аккумулятора с доставкой', price: 1000 },
  { id: 'elec_starter', category: 'elec', name: 'Ремонт стартера / генератора', price: 3500 },
  { id: 'elec_search', category: 'elec', name: 'Поиск утечки тока / короткого замыкания', price: 2000 },
  
  { id: 'eng_oil', category: 'eng', name: 'Замена масла ДВС + фильтры', price: 1000 },
  { id: 'eng_timing', category: 'eng', name: 'Замена ремня / цепи ГРМ', price: 6000 },
  { id: 'eng_gasket', category: 'eng', name: 'Замена прокладки ГБЦ / клапанной крышки', price: 4000 },
  { id: 'eng_diesel', category: 'eng', name: 'Диагностика и ремонт форсунок (дизель)', price: 4500 },
  
  { id: 'road_unlock', category: 'road', name: 'Вскрытие авто без повреждений 24/7', price: 2500 },
  { id: 'road_fuel', category: 'road', name: 'Подвоз топлива (до 20 литров)', price: 1500 },
  { id: 'road_wheel', category: 'road', name: 'Замена колеса на запаску / ремонт прокола', price: 1500 },
  { id: 'road_tow', category: 'road', name: 'Эвакуация / буксировка до СТО', price: 3000 }
];

let selectedServices = new Set(['diag_comp']);

function initCalculator() {
  const tabs = document.querySelectorAll('.calc-tab');
  const itemsContainer = document.getElementById('calc-items');
  const totalSubtotalEl = document.getElementById('calc-subtotal');
  const totalDiscountEl = document.getElementById('calc-discount');
  const totalFinalEl = document.getElementById('calc-final');
  
  if (!itemsContainer) return;

  function renderItems(category = 'all') {
    itemsContainer.innerHTML = '';
    const filtered = category === 'all' 
      ? calcServices 
      : calcServices.filter(s => s.category === category);

    filtered.forEach(service => {
      const isSelected = selectedServices.has(service.id);
      const itemEl = document.createElement('div');
      itemEl.className = `calc-item ${isSelected ? 'selected' : ''}`;
      itemEl.innerHTML = `
        <div class="calc-item-info">
          <strong>${service.name}</strong>
          <span>${service.price.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div class="calc-checkbox">${isSelected ? '✓' : ''}</div>
      `;
      itemEl.addEventListener('click', () => {
        if (selectedServices.has(service.id)) {
          selectedServices.delete(service.id);
        } else {
          selectedServices.add(service.id);
        }
        renderItems(category);
        updateTotals();
      });
      itemsContainer.appendChild(itemEl);
    });
  }

  function updateTotals() {
    let subtotal = 0;
    calcServices.forEach(s => {
      if (selectedServices.has(s.id)) subtotal += s.price;
    });

    const discount = Math.round(subtotal * 0.10);
    const final = subtotal - discount;

    if (totalSubtotalEl) totalSubtotalEl.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    if (totalDiscountEl) totalDiscountEl.textContent = `-${discount.toLocaleString('ru-RU')} ₽`;
    if (totalFinalEl) totalFinalEl.textContent = `${final.toLocaleString('ru-RU')} ₽`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderItems(tab.dataset.category);
    });
  });

  renderItems('all');
  updateTotals();
}

function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const openButtons = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('.modal-close');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.add('active');
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlays.forEach(m => m.classList.remove('active'));
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Handle all lead form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modalOverlays.forEach(m => m.classList.remove('active'));
      showToast('Ваша заявка успешно отправлена! Мастер свяжется с вами через 2-3 минуты.');
      form.reset();
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <div style="font-size: 1.4rem;">✅</div>
    <div>
      <strong style="display: block; font-size: 0.95rem;">Успешно!</strong>
      <span style="font-size: 0.85rem; color: #94A3B8;">${message}</span>
    </div>
  `;
  
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }
}

function initTimer() {
  const timerEl = document.getElementById('arrival-timer');
  if (!timerEl) return;
  
  let minutes = 24;
  let seconds = 38;

  setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 15) minutes = 35;
    }
    timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} мин`;
  }, 1000);
}
