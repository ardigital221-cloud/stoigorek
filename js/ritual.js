/**
 * ПАМЯТЬ И ЗАБОТА • ПАВЛОДАР — АВТОМАТИЗИРОВАННЫЙ ИНТЕРФЕЙС (СВЕТЛАЯ ТЕМА)
 * 1. Интерактивный слайдер «До / После» с автоматическим демонстрационным режимом (Auto-Play)
 * 2. Автоматический онлайн-калькулятор с готовыми пакетами в 1 клик
 * 3. Живой предпросмотр сообщения WhatsApp в реальном времени
 * 4. Прямая отправка в WhatsApp (+7 705 126 5477)
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initCalculator();
  initFaqAccordion();
  initMobileNavigation();
});

/* ==========================================================================
   1. ИНТЕРАКТИВНЫЙ СЛАЙДЕР «ДО / ПОСЛЕ» В СВЕТЛЫХ ЕСТЕСТВЕННЫХ ТОНАХ
   ========================================================================== */

const CASES_DATA = {
  weeds_cleaning: {
    title: 'Генеральная уборка и расчистка от бурьяна',
    tag: 'Суворовское кладбище • Павлодар',
    desc: 'Захоронение сильно заросло полынью, репейником и кустарником. Памятник покрылся пылью и следами осадков.',
    time: '4 часа работы',
    scope: 'Выкорчевка бурьяна с корнем, сбор и вывоз 4 мешков мусора, мытье черного гранита био-шампунем, полировка воском, влажная уборка плитки.',
    price: '11 000 ₸',
    // СВЕТЛЫЙ ДНЕВНОЙ SVG ДЛЯ «ДО»
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
        <!-- Естественное дневное небо -->
        <rect width="800" height="600" fill="url(#daySkyDust)"/>
        
        <!-- Деревья на горизонте -->
        <path d="M 0 330 Q 150 310 300 340 T 600 320 T 800 335 L 800 600 L 0 600 Z" fill="#94a3b8" opacity="0.4"/>
        <path d="M 60 260 Q 80 180 110 260 T 160 270" stroke="#64748b" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.5"/>
        <path d="M 700 240 Q 720 160 750 250" stroke="#64748b" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.5"/>

        <!-- Сухая серо-коричневая земля с сорняками -->
        <rect y="350" width="800" height="250" fill="url(#dryEarth)"/>

        <!-- Запыленный тусклый серый памятник с разводами -->
        <rect x="330" y="160" width="140" height="230" rx="12" fill="#64748b" stroke="#475569" stroke-width="3"/>
        <path d="M 315 380 L 485 380 L 500 420 L 300 420 Z" fill="#475569"/>
        <!-- Потускневшая надпись -->
        <circle cx="400" cy="205" r="16" fill="#475569"/>
        <rect x="360" y="235" width="80" height="8" rx="3" fill="#334155"/>
        <rect x="350" y="255" width="100" height="8" rx="3" fill="#334155"/>
        <rect x="375" y="278" width="50" height="6" rx="3" fill="#334155"/>

        <!-- Ржавая старая ограда на среднем плане -->
        <path d="M 120 340 L 120 480 M 170 350 L 170 490 M 220 340 L 220 480 M 580 340 L 580 480 M 630 350 L 630 490 M 680 340 L 680 480" stroke="#78350f" stroke-width="5"/>
        <path d="M 100 380 L 240 380 M 560 380 L 700 380" stroke="#92400e" stroke-width="6"/>

        <!-- Густые дикие сорняки, колючки и бурьян -->
        <path d="M 90 540 Q 130 380 170 470 Q 210 340 250 520 Q 280 370 320 510" stroke="#4d7c0f" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 120 550 Q 160 410 200 490 Q 240 390 280 540" stroke="#65a30d" stroke-width="5" fill="none"/>
        <path d="M 70 540 Q 120 420 150 530 Q 180 390 220 550" stroke="#3f6212" stroke-width="8" fill="none"/>

        <!-- Заросший холмик по центру перед памятником -->
        <ellipse cx="400" cy="460" rx="160" ry="35" fill="#71624f"/>
        <path d="M 310 490 Q 340 360 370 470 Q 390 330 410 480 Q 440 360 470 490" stroke="#4d7c0f" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 330 510 Q 360 380 390 490 Q 420 350 450 500" stroke="#3f6212" stroke-width="8" fill="none"/>
        <path d="M 280 520 Q 350 410 410 510 Q 470 420 510 530" stroke="#84cc16" stroke-width="4" fill="none"/>

        <!-- Правая сторона зарослей -->
        <path d="M 520 530 Q 560 370 600 480 Q 640 330 680 520" stroke="#4d7c0f" stroke-width="8" fill="none"/>
        <path d="M 550 550 Q 600 400 650 500 Q 690 380 730 550" stroke="#65a30d" stroke-width="6" fill="none"/>

        <!-- Метка ДО -->
        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО УБОРКИ</text>
      </svg>
    `,
    // СВЕТЛЫЙ ДНЕВНОЙ SVG ДЛЯ «ПОСЛЕ»
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
            <stop offset="45%" stop-color="#475569"/>
            <stop offset="55%" stop-color="#020617"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="pureGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <linearGradient id="cleanLawnGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>
        <!-- Чистое голубое дневное небо с солнцем -->
        <rect width="800" height="600" fill="url(#brightSky)"/>
        <circle cx="700" cy="90" r="45" fill="#fef08a" opacity="0.85"/>
        <circle cx="700" cy="90" r="75" fill="#fef9c3" opacity="0.4" filter="blur(15px)"/>

        <!-- Аккуратный фон: зеленые деревья -->
        <path d="M 0 330 Q 150 310 300 340 T 600 320 T 800 335 L 800 600 L 0 600 Z" fill="#bbf7d0" opacity="0.6"/>

        <!-- Идеально расчищенный, выровненный гранитный цоколь и тротуар -->
        <rect y="350" width="800" height="250" fill="url(#cleanLawnGround)"/>
        <!-- Гранитная плита-основание -->
        <path d="M 210 410 L 590 410 L 620 465 L 180 465 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="220" y="465" width="360" height="40" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>

        <!-- Зеркальный сияющий на солнце черный гранитный памятник -->
        <rect x="330" y="140" width="140" height="250" rx="14" fill="url(#jetBlackGranite)" stroke="#64748b" stroke-width="2"/>
        <path d="M 315 385 L 485 385 L 500 425 L 300 425 Z" fill="#0f172a" stroke="#475569" stroke-width="2"/>

        <!-- Солнечный блик на граните -->
        <line x1="340" y1="150" x2="355" y2="370" stroke="#ffffff" stroke-width="3" opacity="0.5" stroke-linecap="round"/>

        <!-- Портретный овал с золотым орнаментом -->
        <ellipse cx="400" cy="195" rx="28" ry="34" fill="#1e293b" stroke="url(#pureGold)" stroke-width="2.5"/>
        <circle cx="400" cy="190" r="16" fill="#334155"/>

        <!-- Золотые яркие четкие надписи -->
        <text x="400" y="265" fill="url(#pureGold)" font-family="'Playfair Display', serif" font-weight="700" font-size="14" text-anchor="middle" letter-spacing="1">АЛЕКСАНДРОВ И. В.</text>
        <text x="400" y="286" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="600" font-size="11" text-anchor="middle">1948 — 2018</text>
        <text x="400" y="318" fill="url(#pureGold)" font-family="'Playfair Display', serif" font-style="italic" font-size="11" text-anchor="middle">Помним, любим, скорбим</text>

        <!-- Покрашенная чистая ограда -->
        <path d="M 120 340 L 120 480 M 170 350 L 170 490 M 220 340 L 220 480 M 580 340 L 580 480 M 630 350 L 630 490 M 680 340 L 680 480" stroke="#0f172a" stroke-width="6"/>
        <path d="M 100 380 L 240 380 M 560 380 L 700 380" stroke="#1e293b" stroke-width="7"/>

        <!-- Гранитная ваза с живыми красными гвоздиками -->
        <path d="M 490 420 Q 505 400 495 380 L 515 380 Q 505 400 520 420 Z" fill="url(#jetBlackGranite)" stroke="#475569" stroke-width="1.5"/>
        <path d="M 505 380 Q 485 340 475 330" stroke="#16a34a" stroke-width="2.5" fill="none"/>
        <circle cx="475" cy="330" r="10" fill="#dc2626"/>
        <path d="M 505 380 Q 505 335 505 320" stroke="#16a34a" stroke-width="2.5" fill="none"/>
        <circle cx="505" cy="320" r="11" fill="#ef4444"/>
        <path d="M 505 380 Q 525 340 535 332" stroke="#16a34a" stroke-width="2.5" fill="none"/>
        <circle cx="535" cy="332" r="10" fill="#dc2626"/>

        <!-- Лампада -->
        <rect x="270" y="388" width="22" height="30" rx="4" fill="#b91c1c" stroke="#f59e0b" stroke-width="1.5"/>
        <circle cx="281" cy="403" r="5" fill="#fef08a"/>

        <!-- Метка ПОСЛЕ -->
        <rect x="635" y="30" width="135" height="34" rx="17" fill="#16a34a"/>
        <text x="702" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">РЕЗУЛЬТАТ</text>
      </svg>
    `
  },

  fence_painting: {
    title: 'Зачистка от ржавчины и покраска оградки',
    tag: 'Пахомовское кладбище • Павлодар',
    desc: 'Металлическая ограда 2.5 × 2.0 м не красилась более 5 лет. Старая краска потрескалась и отслоилась хлопьями, металл покрылся коррозией.',
    time: '5 часов работы',
    scope: 'Механическая зачистка щетками и насадками до чистого металла, удаление пыли, нанесение антикоррозийного грунта, покраска в 2 слоя эмалью Hammerite с золочением пик.',
    price: '16 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e2e8f0"/>
        <rect y="360" width="800" height="240" fill="#94a3b8"/>
        
        <!-- Ржавая ограда крупно -->
        <g stroke="#78350f" stroke-linecap="round">
          <rect x="140" y="160" width="24" height="320" fill="#78350f" stroke="#451a03" stroke-width="2"/>
          <rect x="640" y="160" width="24" height="320" fill="#78350f" stroke="#451a03" stroke-width="2"/>
          <rect x="150" y="220" width="500" height="16" fill="#92400e" stroke="#451a03" stroke-width="2"/>
          <rect x="150" y="420" width="500" height="16" fill="#92400e" stroke="#451a03" stroke-width="2"/>
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 310 200 L 310 440 M 360 200 L 360 440 M 410 200 L 410 440 M 460 200 L 460 440 M 510 200 L 510 440 M 560 200 L 560 440 M 600 200 L 600 440" stroke="#b45309" stroke-width="8"/>
        </g>
        
        <!-- Следы ржавчины и коррозии -->
        <circle cx="260" cy="280" r="14" fill="#ea580c" opacity="0.8"/>
        <circle cx="360" cy="340" r="18" fill="#c2410c" opacity="0.9"/>
        <circle cx="460" cy="260" r="16" fill="#9a3412" opacity="0.85"/>
        <path d="M 180 230 Q 300 240 450 225" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6" fill="none"/>

        <rect x="340" y="440" width="120" height="15" rx="3" fill="#78350f"/>
        <rect x="390" y="455" width="16" height="85" fill="#451a03"/>

        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО РАБОТ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glossBlackDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="50%" stop-color="#020617"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="goldTipDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="60%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#f0fdf4"/>
        <rect y="360" width="800" height="240" fill="#64748b"/>

        <!-- Свежеокрашенная ограда глубокий черный глянец -->
        <rect x="140" y="160" width="24" height="320" fill="url(#glossBlackDay)" stroke="#475569" stroke-width="2"/>
        <circle cx="152" cy="150" r="14" fill="url(#goldTipDay)"/>
        <rect x="640" y="160" width="24" height="320" fill="url(#glossBlackDay)" stroke="#475569" stroke-width="2"/>
        <circle cx="652" cy="150" r="14" fill="url(#goldTipDay)"/>

        <rect x="150" y="220" width="500" height="16" fill="url(#glossBlackDay)" stroke="#334155" stroke-width="2"/>
        <rect x="150" y="420" width="500" height="16" fill="url(#glossBlackDay)" stroke="#334155" stroke-width="2"/>

        <g stroke="url(#glossBlackDay)" stroke-width="9" stroke-linecap="round">
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 310 200 L 310 440 M 360 200 L 360 440 M 410 200 L 410 440 M 460 200 L 460 440 M 510 200 L 510 440 M 560 200 L 560 440 M 600 200 L 600 440"/>
        </g>
        <!-- Золотые пики -->
        <polygon points="210,180 204,200 216,200" fill="url(#goldTipDay)"/>
        <polygon points="260,180 254,200 266,200" fill="url(#goldTipDay)"/>
        <polygon points="310,180 304,200 316,200" fill="url(#goldTipDay)"/>
        <polygon points="360,180 354,200 366,200" fill="url(#goldTipDay)"/>
        <polygon points="410,180 404,200 416,200" fill="url(#goldTipDay)"/>
        <polygon points="460,180 454,200 466,200" fill="url(#goldTipDay)"/>
        <polygon points="510,180 504,200 516,200" fill="url(#goldTipDay)"/>
        <polygon points="560,180 554,200 566,200" fill="url(#goldTipDay)"/>
        <polygon points="600,180 594,200 606,200" fill="url(#goldTipDay)"/>

        <!-- Обновленный стол -->
        <rect x="335" y="440" width="130" height="16" rx="4" fill="#b45309" stroke="#d97706" stroke-width="1.5"/>
        <rect x="392" y="456" width="16" height="84" fill="url(#glossBlackDay)" stroke="#334155" stroke-width="1"/>

        <rect x="635" y="30" width="135" height="34" rx="17" fill="#16a34a"/>
        <text x="702" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ПОКРАШЕНО</text>
      </svg>
    `
  },

  marble_gravel: {
    title: 'Отсыпка белой мраморной крошкой с геотекстилем',
    tag: 'Новое городское кладбище • Павлодар',
    desc: 'После сильных дождей могильный холм размывало, земля превращалась в грязь, прорастала сорная трава.',
    time: '6 часов работы',
    scope: 'Выемка верхнего грунта на 10 см, утрамбовка, установка бордюрного полимерного канта по периметру 2×2.5 м, настил сверхплотного геотекстиля (150 г/м²), засыпка 250 кг отборной белой мраморной крошки фракции 10-20 мм.',
    price: '34 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e2e8f0"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#94a3b8"/>
        
        <!-- Грязевой размытый холм -->
        <ellipse cx="400" cy="450" rx="260" ry="80" fill="#78716c"/>
        <path d="M 200 460 Q 350 490 600 450 Q 420 420 200 460 Z" fill="#57534e"/>
        <path d="M 280 430 Q 290 390 310 420 M 480 440 Q 500 400 520 450 M 380 470 Q 390 430 410 460" stroke="#65a30d" stroke-width="5" stroke-linecap="round"/>

        <rect x="350" y="200" width="100" height="190" rx="8" fill="#64748b" stroke="#475569" stroke-width="2"/>
        <ellipse cx="400" cy="400" rx="70" ry="14" fill="#475569"/>

        <rect x="30" y="30" width="130" height="34" rx="17" fill="#ef4444"/>
        <text x="95" y="52" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="14" text-anchor="middle">ДО РАБОТ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#e0f2fe"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#94a3b8"/>

        <!-- Цоколь с бордюром -->
        <polygon points="120,490 680,490 620,380 180,380" fill="#334155" stroke="#1e293b" stroke-width="4"/>

        <!-- Белоснежная мраморная крошка -->
        <polygon points="135,480 665,480 610,390 190,390" fill="#ffffff"/>
        
        <!-- Текстура мраморной крошки -->
        <g fill="#e2e8f0">
          <circle cx="200" cy="440" r="5"/><circle cx="225" cy="460" r="4"/><circle cx="260" cy="430" r="6"/><circle cx="300" cy="455" r="5"/>
          <circle cx="340" cy="425" r="4"/><circle cx="380" cy="465" r="6"/><circle cx="430" cy="435" r="5"/><circle cx="480" cy="460" r="6"/>
          <circle cx="530" cy="420" r="5"/><circle cx="570" cy="455" r="6"/><circle cx="610" cy="440" r="4"/><circle cx="635" cy="465" r="5"/>
          <circle cx="230" cy="410" r="4"/><circle cx="310" cy="405" r="5"/><circle cx="450" cy="405" r="5"/><circle cx="560" cy="405" r="4"/>
          <circle cx="280" cy="470" r="5"/><circle cx="410" cy="475" r="6"/><circle cx="500" cy="470" r="5"/><circle cx="360" cy="450" r="5"/>
        </g>

        <!-- Чистый черный памятник -->
        <rect x="350" y="170" width="100" height="220" rx="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <rect x="330" y="380" width="140" height="24" rx="4" fill="#1e293b"/>
        <text x="400" y="275" fill="#f8fafc" font-family="'Playfair Display', serif" font-weight="700" font-size="15" text-anchor="middle">ПАМЯТЬ</text>
        <circle cx="400" cy="225" r="14" fill="#eab308"/>

        <!-- Ваза с цветами -->
        <rect x="514" y="380" width="12" height="30" fill="#1e293b" rx="3"/>
        <circle cx="510" cy="370" r="8" fill="#ef4444"/>
        <circle cx="530" cy="372" r="8" fill="#f59e0b"/>

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

  // Переключение табов
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCaseKey = tab.getAttribute('data-case');
      renderCurrentCase();
      setSliderPosition(50);
    });
  });

  // Авто-показ (Автоматизация движения ползунка)
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
      if (autoPlayPos >= 85) {
        autoPlayDirection = -1;
      } else if (autoPlayPos <= 15) {
        autoPlayDirection = 1;
      }
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

  setTimeout(() => {
    setSliderPosition(50);
  }, 100);
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

/* ==========================================================================
   2. АВТОМАТИЗИРОВАННЫЙ ОНЛАЙН-КАЛЬКУЛЯТОР
   ========================================================================== */

const CALC_CONFIG = {
  graveSizes: {
    single: { multiplier: 1.0, label: 'Одиночное (до 5 м²)' },
    double: { multiplier: 1.6, label: 'Двойное (до 10 м²)' },
    family: { multiplier: 2.3, label: 'Семейное (3-4 места)' }
  },
  services: {
    cleaning: { basePrice: 8000, label: 'Разовая уборка и сбор мусора' },
    stone_wash: { basePrice: 4000, label: 'Мытье надгробия + полировка камня' },
    paint_fence: { basePrice: 14000, label: 'Зачистка + покраска оградки Hammerite' },
    paint_table: { basePrice: 5000, label: 'Покраска столика и лавочки' },
    paint_cross: { basePrice: 4500, label: 'Покраска креста / обновление букв' },
    herbicides: { basePrice: 5000, label: 'Обработка гербицидами от сорняков' },
    marble_chips: { basePrice: 28000, label: 'Геотекстиль + мраморная крошка' },
    fresh_flowers: { basePrice: 6000, label: 'Возложение живых цветов + лампада' }
  },
  cemeteries: {
    suvorovskoe: { surcharge: 0, label: 'Суворовское кладбище' },
    pahomovskoe: { surcharge: 0, label: 'Пахомовское кладбище' },
    muslim: { surcharge: 0, label: 'Мусульманское городское кладбище' },
    usolskoe: { surcharge: 0, label: 'Усольское кладбище' },
    leninsky: { surcharge: 2500, label: 'Кладбище пос. Ленинский (+2500 ₸)' },
    new_cemetery: { surcharge: 2000, label: 'Новое кладбище (+2000 ₸)' },
    other_region: { surcharge: 4500, label: 'Другое в Павлодарской обл. (+4500 ₸)' }
  },
  timing: {
    standard: { factor: 1.0, discountText: 'Разово (без скидки)' },
    twice_year: { factor: 0.9, discountText: '2 раза в год (-10% скидка)' },
    annual: { factor: 0.85, discountText: 'Годовой абонемент (-15% скидка)' }
  },
  presets: {
    clean: ['cleaning', 'stone_wash'],
    paint: ['cleaning', 'paint_fence', 'paint_table'],
    all_inclusive: ['cleaning', 'stone_wash', 'paint_fence', 'paint_table', 'herbicides', 'fresh_flowers'],
    marble: ['cleaning', 'marble_chips', 'paint_fence', 'stone_wash']
  }
};

let currentCalculatedTotal = 0;

function initCalculator() {
  const calcForm = document.getElementById('calcForm');
  if (!calcForm) return;

  calcForm.addEventListener('change', calculateTotal);

  // Автоматические пакеты услуг в 1 клик
  const presetChips = document.querySelectorAll('.preset-chip-btn');
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      applyPreset(presetKey);
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  const btnSubmitWa = document.getElementById('btnSubmitCalcWa');
  if (btnSubmitWa) {
    btnSubmitWa.addEventListener('click', handleSendWhatsAppCalculation);
  }

  // Обновление предпросмотра при вводе имени
  const nameInput = document.getElementById('clientName');
  if (nameInput) {
    nameInput.addEventListener('input', updateWhatsAppLivePreview);
  }

  calculateTotal();
}

function applyPreset(presetKey) {
  const servicesToSelect = CALC_CONFIG.presets[presetKey] || [];
  const serviceCheckboxes = document.querySelectorAll('input[name="service_item"]');
  serviceCheckboxes.forEach(cb => {
    cb.checked = servicesToSelect.includes(cb.value);
  });
  calculateTotal();
}

function calculateTotal() {
  const sizeRadio = document.querySelector('input[name="grave_size"]:checked');
  const sizeKey = sizeRadio ? sizeRadio.value : 'single';
  const sizeData = CALC_CONFIG.graveSizes[sizeKey] || CALC_CONFIG.graveSizes.single;

  const cemeterySelect = document.getElementById('cemeterySelect');
  const cemeteryKey = cemeterySelect ? cemeterySelect.value : 'suvorovskoe';
  const cemeteryData = CALC_CONFIG.cemeteries[cemeteryKey] || CALC_CONFIG.cemeteries.suvorovskoe;

  const checkedServices = [];
  let servicesSubtotal = 0;

  const serviceCheckboxes = document.querySelectorAll('input[name="service_item"]:checked');
  serviceCheckboxes.forEach(cb => {
    const serviceKey = cb.value;
    const servItem = CALC_CONFIG.services[serviceKey];
    if (servItem) {
      let calculatedPrice = servItem.basePrice;
      if (['cleaning', 'paint_fence', 'herbicides', 'marble_chips'].includes(serviceKey)) {
        calculatedPrice = Math.round(servItem.basePrice * sizeData.multiplier);
      }
      servicesSubtotal += calculatedPrice;
      checkedServices.push({
        name: servItem.label,
        price: calculatedPrice
      });
    }
  });

  const timingRadio = document.querySelector('input[name="timing_option"]:checked');
  const timingKey = timingRadio ? timingRadio.value : 'standard';
  const timingData = CALC_CONFIG.timing[timingKey] || CALC_CONFIG.timing.standard;

  let grandTotal = (servicesSubtotal * timingData.factor) + cemeteryData.surcharge;
  grandTotal = Math.round(grandTotal / 500) * 500;

  if (grandTotal < 0) grandTotal = 0;
  currentCalculatedTotal = grandTotal;

  animatePriceCounter(grandTotal);
  renderSummaryItems(checkedServices, cemeteryData, timingData);
  updateWhatsAppLivePreview();
}

let currentDisplayValue = 0;
function animatePriceCounter(targetValue) {
  const el = document.getElementById('calcTotalNumber');
  if (!el) return;

  const startValue = currentDisplayValue;
  const duration = 300;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = progress * (2 - progress);
    const val = Math.round(startValue + (targetValue - startValue) * easeOutQuad);

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

function formatCurrency(number) {
  return number.toLocaleString('ru-RU') + ' ₸';
}

function renderSummaryItems(services, cemetery, timing) {
  const container = document.getElementById('summaryItemsList');
  if (!container) return;

  if (services.length === 0) {
    container.innerHTML = `
      <div class="summary-item-row" style="color: var(--text-muted); font-style: italic;">
        Отметьте услуги или нажмите готовый пакет выше
      </div>
    `;
    return;
  }

  let html = '';
  services.forEach(serv => {
    html += `
      <div class="summary-item-row">
        <span class="summary-item-name">${serv.name}</span>
        <span class="summary-item-price">${formatCurrency(serv.price)}</span>
      </div>
    `;
  });

  if (cemetery.surcharge > 0) {
    html += `
      <div class="summary-item-row" style="color: var(--gold-600); font-weight: 600;">
        <span class="summary-item-name">Выезд (${cemetery.label})</span>
        <span class="summary-item-price">+${formatCurrency(cemetery.surcharge)}</span>
      </div>
    `;
  }

  if (timing.factor < 1.0) {
    html += `
      <div class="summary-item-row" style="color: var(--emerald-600); font-weight: 600;">
        <span class="summary-item-name">Скидка за регулярность</span>
        <span class="summary-item-price">${timing.discountText}</span>
      </div>
    `;
  }

  container.innerHTML = html;
}

// Автоматический живой предпросмотр сообщения WhatsApp
function updateWhatsAppLivePreview() {
  const previewBox = document.getElementById('waPreviewText');
  if (!previewBox) return;

  const nameInput = document.getElementById('clientName');
  const cemeterySelect = document.getElementById('cemeterySelect');
  const sizeRadio = document.querySelector('input[name="grave_size"]:checked');
  const timingRadio = document.querySelector('input[name="timing_option"]:checked');

  const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Клиент';
  const sizeKey = sizeRadio ? sizeRadio.value : 'single';
  const sizeData = CALC_CONFIG.graveSizes[sizeKey];

  const cemeteryKey = cemeterySelect ? cemeterySelect.value : 'suvorovskoe';
  const cemeteryData = CALC_CONFIG.cemeteries[cemeteryKey];

  const timingKey = timingRadio ? timingRadio.value : 'standard';
  const timingData = CALC_CONFIG.timing[timingKey];

  const chosenServices = [];
  document.querySelectorAll('input[name="service_item"]:checked').forEach(cb => {
    const item = CALC_CONFIG.services[cb.value];
    if (item) chosenServices.push(`• ${item.label}`);
  });

  let previewText = `Здравствуйте! Меня зовут ${clientName}.\nРассчитал(а) стоимость ухода за захоронением:\n`;
  previewText += `📍 ${cemeteryData.label} (${sizeData.label})\n`;
  previewText += `🛠 Выбранные услуги: ${chosenServices.length} поз.\n`;
  previewText += `💰 Сумма: ${formatCurrency(currentCalculatedTotal)}`;

  previewBox.textContent = previewText;
}

/* ==========================================================================
   3. ОТПРАВКА В WHATSAPP (+7 705 126 5477)
   ========================================================================== */
function handleSendWhatsAppCalculation(e) {
  if (e) e.preventDefault();

  const nameInput = document.getElementById('clientName');
  const cemeterySelect = document.getElementById('cemeterySelect');
  const sizeRadio = document.querySelector('input[name="grave_size"]:checked');
  const timingRadio = document.querySelector('input[name="timing_option"]:checked');

  const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Клиент';
  const sizeKey = sizeRadio ? sizeRadio.value : 'single';
  const sizeData = CALC_CONFIG.graveSizes[sizeKey];

  const cemeteryKey = cemeterySelect ? cemeterySelect.value : 'suvorovskoe';
  const cemeteryData = CALC_CONFIG.cemeteries[cemeteryKey];

  const timingKey = timingRadio ? timingRadio.value : 'standard';
  const timingData = CALC_CONFIG.timing[timingKey];

  const chosenServices = [];
  document.querySelectorAll('input[name="service_item"]:checked').forEach(cb => {
    const item = CALC_CONFIG.services[cb.value];
    if (item) chosenServices.push(`• ${item.label}`);
  });

  if (chosenServices.length === 0) {
    showToast('Выберите хотя бы одну услугу или готовый пакет!');
    return;
  }

  let message = `Здравствуйте! Меня зовут ${clientName}.\n\n`;
  message += `Я рассчитал(а) стоимость ухода за захоронением на сайте:\n`;
  message += `📍 Кладбище: ${cemeteryData.label}\n`;
  message += `📐 Участок: ${sizeData.label}\n`;
  message += `📅 Регулярность: ${timingData.discountText}\n\n`;
  message += `🛠 Выбранные работы:\n`;
  message += `${chosenServices.join('\n')}\n\n`;
  message += `💰 Предварительная стоимость: ${formatCurrency(currentCalculatedTotal)}\n\n`;
  message += `Сориентируйте, пожалуйста, когда возможен осмотр и выезд мастера?`;

  const waUrl = `https://wa.me/77051265477?text=${encodeURIComponent(message)}`;

  showToast('Переходим в WhatsApp... Расчет скопирован в сообщение.');
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 350);
}

/* ==========================================================================
   4. АККОРДЕОН FAQ И ДОПОЛНИТЕЛЬНЫЕ ИНТЕРФЕЙСЫ
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
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

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
