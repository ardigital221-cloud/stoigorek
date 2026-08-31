// СТО «МАРКООБРАЗНЫЕ» — Specialized Mark II / Chaser / Cresta / Crown Service
// Direct WhatsApp & Phone: +7 (705) 607-72-89

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initModals();
  initFaq();
  initMobileNav();
});

// Specialized JDM & Markoobraznye Calculator Data (STRICTLY SUSPENSION & ENGINE ONLY)
const calcServices = [
  // Ходовая часть / Подвеска
  { id: 'susp_levers', category: 'susp', name: 'Замена косых / передних рычагов (Mark II/Chaser/Cresta)', price: 3000 },
  { id: 'susp_bushings', category: 'susp', name: 'Замена плавающих сайлентблоков цапфы', price: 4000 },
  { id: 'susp_coilovers', category: 'susp', name: 'Установка и настройка койловеров (винтовой подвески)', price: 6000 },
  { id: 'susp_ball', category: 'susp', name: 'Замена нижней / верхней шаровой опоры', price: 2500 },
  { id: 'susp_gear', category: 'susp', name: 'Замена / обслуживание редуктора и приводов', price: 5000 },
  { id: 'susp_full', category: 'susp', name: 'Комплексный осмотр и диагностика ходовой части Марка', price: 1000 },

  // Двигатель / ДВС (1JZ / 2JZ / 1G Beams)
  { id: 'eng_cap', category: 'eng', name: 'Капитальный ремонт ДВС (1JZ-GE / 1JZ-GTE / 2JZ / 1G)', price: 35000 },
  { id: 'eng_gasket', category: 'eng', name: 'Замена прокладки ГБЦ / сальников клапанов', price: 12000 },
  { id: 'eng_timing', category: 'eng', name: 'Замена ремня ГРМ + помпа + ролики (1JZ/2JZ/1G)', price: 7000 },
  { id: 'eng_oil', category: 'eng', name: 'Замена масла ДВС + фильтры', price: 1500 },
  { id: 'eng_turbo', category: 'eng', name: 'Диагностика и замена турбины (1JZ-GTE VVTi)', price: 10000 }
];

let selectedServices = new Set(['susp_levers', 'eng_timing']);

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
          <span>${service.price.toLocaleString('ru-RU')} ₸</span>
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

    if (totalSubtotalEl) totalSubtotalEl.textContent = `${subtotal.toLocaleString('ru-RU')} ₸`;
    if (totalDiscountEl) totalDiscountEl.textContent = `-${discount.toLocaleString('ru-RU')} ₸`;
    if (totalFinalEl) totalFinalEl.textContent = `${final.toLocaleString('ru-RU')} ₸`;
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

  // Handle forms & direct WhatsApp submission
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const modelInput = form.querySelector('select') || form.querySelectorAll('input[type="text"]')[1];
      
      const name = nameInput ? nameInput.value : 'Клиент';
      const phone = phoneInput ? phoneInput.value : '';
      const model = modelInput ? modelInput.value : 'Маркообразный авто';

      // Build WhatsApp message
      const text = encodeURIComponent(`Здравствуйте! Хочу записаться на сервис для Маркообразного авто:\n\nИмя: ${name}\nТелефон: ${phone}\nМодель: ${model}\nНомер мастерам: +77056077289`);
      const waUrl = `https://wa.me/77056077289?text=${text}`;
      
      modalOverlays.forEach(m => m.classList.remove('active'));
      showToast('Заявка создана! Переправляем в WhatsApp мастера...');
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

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
