// СТО «ИГОРЕК» — Specialized Mark II / Chaser / Cresta / Crown Service
// Direct WhatsApp & Phone: +7 (705) 607-72-89

document.addEventListener('DOMContentLoaded', () => {
  disableGestureZoom();
  initCalculator();
  initFormsAutomation();
  initFaq();
});

// Disable iOS Safari pinch zoom and gesture zooming
function disableGestureZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  document.addEventListener('gestureend', (e) => e.preventDefault());
}

// Specialized JDM & Markoobraznye Calculator Data (ALL SUSPENSION FROM 5000 ₸, ALL ENGINE REPAIRS ASSESSED ON SITE)
const calcServices = [
  // Ходовая часть / Подвеска (Работы от 5 000 ₸)
  { id: 'susp_levers', category: 'susp', name: 'Замена передних косых / нижних рычагов (Mark II/Chaser)', price: 5000, note: 'от 5 000 ₸' },
  { id: 'susp_bushings', category: 'susp', name: 'Замена плавающих сайлентблоков цапфы', price: 5000, note: 'от 5 000 ₸' },
  { id: 'susp_coilovers', category: 'susp', name: 'Установка и настройка койловеров (винтов)', price: 6000, note: 'от 6 000 ₸' },
  { id: 'susp_ball', category: 'susp', name: 'Замена нижней / верхней шаровой опоры', price: 5000, note: 'от 5 000 ₸' },
  { id: 'susp_gear', category: 'susp', name: 'Замена / обслуживание редуктора и приводов', price: 5000, note: 'от 5 000 ₸' },

  // Двигатель / ДВС (ВСЕ работы по моторам рассматриваются на месте!)
  { id: 'eng_cap', category: 'eng', name: 'Капитальный ремонт ДВС (1JZ / 2JZ / 1G Beams)', price: 0, note: 'Оценка на месте' },
  { id: 'eng_gasket', category: 'eng', name: 'Замена прокладки ГБЦ / сальников клапанов', price: 0, note: 'Оценка на месте' },
  { id: 'eng_timing', category: 'eng', name: 'Замена ремня ГРМ + помпа + ролики (1JZ/2JZ/1G)', price: 0, note: 'Оценка на месте' },
  { id: 'eng_oil', category: 'eng', name: 'Замена масла ДВС + комплектующие', price: 5000, note: 'от 5 000 ₸' },
  { id: 'eng_turbo', category: 'eng', name: 'Диагностика и замена турбины (1JZ-GTE VVTi)', price: 0, note: 'Оценка на месте' }
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
      
      const priceDisplay = service.price > 0 
        ? `от ${service.price.toLocaleString('ru-RU')} ₸` 
        : 'Оценка на месте';

      itemEl.innerHTML = `
        <div class="calc-item-info">
          <strong>${service.name}</strong>
          <span style="${service.price === 0 ? 'color: var(--jdm-yellow);' : ''}">${priceDisplay}</span>
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
    let hasOnSiteItems = false;

    calcServices.forEach(s => {
      if (selectedServices.has(s.id)) {
        if (s.price > 0) {
          subtotal += s.price;
        } else {
          hasOnSiteItems = true;
        }
      }
    });

    const discount = Math.round(subtotal * 0.10);
    const final = subtotal - discount;

    if (totalSubtotalEl) {
      totalSubtotalEl.textContent = subtotal > 0 
        ? `от ${subtotal.toLocaleString('ru-RU')} ₸` 
        : 'Рассматривается на месте';
    }

    if (totalDiscountEl) {
      totalDiscountEl.textContent = discount > 0 
        ? `-${discount.toLocaleString('ru-RU')} ₸` 
        : 'Скидка 10%';
    }

    if (totalFinalEl) {
      if (subtotal > 0) {
        totalFinalEl.textContent = hasOnSiteItems 
          ? `от ${final.toLocaleString('ru-RU')} ₸ + Оценка ДВС на месте` 
          : `от ${final.toLocaleString('ru-RU')} ₸`;
      } else {
        totalFinalEl.textContent = 'Рассматривается на месте';
      }
    }
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

function initFormsAutomation() {
  const masterPhone = '77056077289';

  // Express Mobile Booking Form
  const expressForm = document.getElementById('express-mobile-form');
  if (expressForm) {
    expressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = expressForm.querySelectorAll('input');
      const selects = expressForm.querySelectorAll('select');
      
      const name = inputs[0] ? inputs[0].value.trim() : 'Не указано';
      const phone = inputs[1] ? inputs[1].value.trim() : 'Не указан';
      const model = selects[0] ? selects[0].value : 'Mark II';
      const service = selects[1] ? selects[1].value : 'Ремонт ходовой части';

      const messageText = `🏎️ ЗАЯВКА НА РЕМОНТ (СТО ИГОРЕК)\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🚘 Модель авто: ${model}\n🛠️ Необходимые работы: ${service}\n\n💡 Цены от 5 000 ₸ (зависят от сложности). Работы по ДВС и ГРМ рассматриваются на месте.\n\n📍 Прошу перезвонить для согласования времени осмотра.`;
      
      sendToWhatsApp(masterPhone, messageText);
      expressForm.reset();
    });
  }

  // Calculator Submit Form
  const calcForm = document.getElementById('calc-submit-form');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const phoneInput = calcForm.querySelector('input[type="tel"]');
      const phone = phoneInput ? phoneInput.value.trim() : 'Не указан';
      
      let subtotal = 0;
      let servicesListText = '';
      let hasOnSite = false;
      
      calcServices.forEach(s => {
        if (selectedServices.has(s.id)) {
          if (s.price > 0) {
            subtotal += s.price;
            servicesListText += `• ${s.name} (от ${s.price.toLocaleString('ru-RU')} ₸)\n`;
          } else {
            hasOnSite = true;
            servicesListText += `• ${s.name} (Оценка на месте)\n`;
          }
        }
      });

      if (!servicesListText) {
        servicesListText = '• Вид работ будет уточнен при осмотре\n';
      }

      const discount = Math.round(subtotal * 0.10);
      const finalPrice = subtotal - discount;

      let resultText = subtotal > 0 
        ? `💰 Предварительный расчет: от ${subtotal.toLocaleString('ru-RU')} ₸\n🎁 Скидка за онлайн-запись (10%): -${discount.toLocaleString('ru-RU')} ₸\n✅ Итого к оплате: от ${finalPrice.toLocaleString('ru-RU')} ₸`
        : `✅ Расчет стоимости: Рассматривается на месте после осмотра`;

      if (hasOnSite && subtotal > 0) {
        resultText += ` (+ Оценка работ по ДВС/ГРМ на месте)`;
      }

      const messageText = `📋 РАСЧЕТ СМЕТЫ С САЙТА (СТО ИГОРЕК)\n\n📞 Телефон клиента: ${phone}\n\n🛠️ Выбранные работы:\n${servicesListText}\n${resultText}\n\n💡 Цены от 5 000 ₸. Работы по ДВС и ГРМ рассматриваются на месте.\n\nПрошу записать на осмотр и ремонт.`;
      
      sendToWhatsApp(masterPhone, messageText);
      calcForm.reset();
    });
  }
}

function sendToWhatsApp(phone, message) {
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phone}?text=${encodedText}`;

  showToast('Открываем WhatsApp для отправки шаблона...');

  // Safe background link creation (prevents current page from unloading / breaking CSS)
  const link = document.createElement('a');
  link.href = waUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);

  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
  }, 400);
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
    <div style="font-size: 1.4rem;">💬</div>
    <div>
      <strong style="display: block; font-size: 0.95rem;">WhatsApp Автоматизация</strong>
      <span style="font-size: 0.82rem; color: #8E9BAE;">${message}</span>
    </div>
  `;
  
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}
