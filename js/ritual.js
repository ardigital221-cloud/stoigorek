/**
 * ПАМЯТЬ И ЗАБОТА • ПАВЛОДАР
 * Интерактивный функционал:
 * 1. Интерактивный сплит-слайдер «До / После» (touch + drag) с переключением кейсов
 * 2. Онлайн-калькулятор стоимости в тенге (₸) с моментальным пересчетом
 * 3. Формирование и отправка структурированной заявки в WhatsApp (+7 705 126 5477)
 * 4. FAQ аккордеон, тосты и мобильная навигация
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initCalculator();
  initFaqAccordion();
  initMobileNavigation();
});

/* ==========================================================================
   1. ИНТЕРАКТИВНЫЙ СЛАЙДЕР «ДО / ПОСЛЕ»
   ========================================================================== */

// Векторные художественные визуализации для кейсов
const CASES_DATA = {
  weeds_cleaning: {
    title: 'Генеральная уборка и расчистка от бурьяна',
    tag: 'Суворовское кладбище • Павлодар',
    desc: 'Захоронение не посещалось более 2 лет. Участок зарос полынью, репейником и кустарником. Памятник покрылся пылью и следами осадков.',
    time: '4 часа работы',
    scope: 'Выкорчевка бурьяна с корнем, сбор и вывоз 4 мешков мусора, мытье черного гранита био-шампунем, полировка воском, влажная уборка плитки.',
    price: '11 000 ₸',
    // SVG для ДО
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyDust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2a332d"/>
            <stop offset="60%" stop-color="#1f2723"/>
            <stop offset="100%" stop-color="#18201c"/>
          </linearGradient>
          <linearGradient id="groundWeed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#222d25"/>
            <stop offset="100%" stop-color="#141c17"/>
          </linearGradient>
        </defs>
        <!-- Небо и фон -->
        <rect width="800" height="600" fill="url(#skyDust)"/>
        
        <!-- Задний план: силуэты деревьев и других оград -->
        <path d="M 0 320 Q 150 300 300 330 T 600 310 T 800 325 L 800 600 L 0 600 Z" fill="#131c17"/>
        <path d="M 40 260 Q 60 180 90 260 T 140 270" stroke="#1d2821" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M 710 240 Q 730 160 760 250" stroke="#1d2821" stroke-width="10" stroke-linecap="round" fill="none"/>
        
        <!-- Земля (сухая, заросшая) -->
        <rect y="340" width="800" height="260" fill="url(#groundWeed)"/>
        
        <!-- Тусклый, запыленный памятник -->
        <rect x="330" y="160" width="140" height="230" rx="12" fill="#2d3430" stroke="#3d4741" stroke-width="3"/>
        <path d="M 320 380 L 480 380 L 495 420 L 305 420 Z" fill="#242b26"/>
        <!-- Потускневшая надпись -->
        <rect x="360" y="210" width="80" height="8" rx="3" fill="#47524b"/>
        <rect x="350" y="235" width="100" height="8" rx="3" fill="#47524b"/>
        <rect x="375" y="260" width="50" height="6" rx="3" fill="#47524b"/>
        <circle cx="400" cy="188" r="14" fill="#38433c"/>

        <!-- Ржавые прутья ограды на переднем плане -->
        <path d="M 120 330 L 120 480 M 170 340 L 170 490 M 220 330 L 220 480 M 580 330 L 580 480 M 630 340 L 630 490 M 680 330 L 680 480" stroke="#5c4033" stroke-width="5"/>
        <path d="M 100 370 L 240 370 M 560 370 L 700 370" stroke="#4a3525" stroke-width="6"/>

        <!-- Густые дикие заросли, полынь и сорняки -->
        <!-- Левый куст -->
        <path d="M 100 520 Q 140 380 180 450 Q 220 350 250 510 Q 270 380 310 500" stroke="#3b4d3f" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 120 540 Q 150 410 200 480 Q 240 390 280 530" stroke="#4d6152" stroke-width="5" fill="none"/>
        <path d="M 80 530 Q 130 430 160 520 Q 190 400 230 540" stroke="#2e3d32" stroke-width="8" fill="none"/>
        
        <!-- Центр перед памятником (заросший холмик) -->
        <ellipse cx="400" cy="460" rx="160" ry="35" fill="#1b241e"/>
        <path d="M 310 480 Q 340 360 370 460 Q 390 340 410 470 Q 440 370 470 480" stroke="#586e5c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M 330 500 Q 360 390 390 480 Q 420 370 450 490" stroke="#38493d" stroke-width="8" fill="none"/>
        <path d="M 280 510 Q 350 420 410 500 Q 470 430 510 520" stroke="#687e6d" stroke-width="4" fill="none"/>

        <!-- Правая сторона зарослей и сухие ветки -->
        <path d="M 520 520 Q 560 370 600 470 Q 640 340 680 510" stroke="#3b4d3f" stroke-width="8" fill="none"/>
        <path d="M 550 540 Q 600 410 650 490 Q 690 390 730 540" stroke="#4d6152" stroke-width="6" fill="none"/>
        <path d="M 480 530 L 520 490 L 560 510" stroke="#524339" stroke-width="5" stroke-linecap="round" fill="none"/>

        <!-- Текст пометки -->
        <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(0,0,0,0.7)"/>
        <text x="95" y="52" fill="#f87171" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">ДО УБОРКИ</text>
      </svg>
    `,
    // SVG для ПОСЛЕ
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#14211b"/>
            <stop offset="60%" stop-color="#1a2d24"/>
            <stop offset="100%" stop-color="#101d17"/>
          </linearGradient>
          <linearGradient id="graniteShiny" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#242c28"/>
            <stop offset="35%" stop-color="#151b17"/>
            <stop offset="50%" stop-color="#4a5a51"/>
            <stop offset="65%" stop-color="#0f1411"/>
            <stop offset="100%" stop-color="#18201c"/>
          </linearGradient>
          <linearGradient id="goldTextGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#fdf4be"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#aa8420"/>
          </linearGradient>
          <linearGradient id="groundClean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a261f"/>
            <stop offset="100%" stop-color="#0d1410"/>
          </linearGradient>
        </defs>
        <!-- Чистое небо с благородным светом -->
        <rect width="800" height="600" fill="url(#skyClean)"/>
        <circle cx="400" cy="180" r="280" fill="rgba(212, 175, 55, 0.08)" filter="blur(40px)"/>

        <!-- Аккуратный фон -->
        <path d="M 0 320 Q 150 300 300 330 T 600 310 T 800 325 L 800 600 L 0 600 Z" fill="#0c1410"/>

        <!-- Идеально расчищенный, выровненный грунт с тротуарным бордюром -->
        <rect y="350" width="800" height="250" fill="url(#groundClean)"/>
        <!-- Гранитный цоколь/плита -->
        <path d="M 220 420 L 580 420 L 610 470 L 190 470 Z" fill="#1b241f" stroke="#2f3f35" stroke-width="2"/>
        <rect x="230" y="470" width="340" height="40" fill="#121a15" stroke="#25332a" stroke-width="1.5"/>

        <!-- Глубокий зеркальный черный гранитный памятник с фаской -->
        <rect x="330" y="140" width="140" height="250" rx="14" fill="url(#graniteShiny)" stroke="#536a5c" stroke-width="2.5"/>
        <path d="M 315 385 L 485 385 L 500 425 L 300 425 Z" fill="#111713" stroke="#36473d" stroke-width="2"/>

        <!-- Портретный овал с золотой каймой -->
        <ellipse cx="400" cy="200" rx="28" ry="34" fill="#1b241f" stroke="url(#goldTextGrad)" stroke-width="2.5"/>
        <circle cx="400" cy="195" r="16" fill="#2d3a32"/>

        <!-- Золотые четкие надписи «Помним, любим, скорбим» -->
        <text x="400" y="270" fill="url(#goldTextGrad)" font-family="'Playfair Display', serif" font-weight="700" font-size="14" text-anchor="middle" letter-spacing="1">АЛЕКСАНДРОВ И. В.</text>
        <text x="400" y="292" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="500" font-size="11" text-anchor="middle">1948 — 2018</text>
        <text x="400" y="325" fill="url(#goldTextGrad)" font-family="'Playfair Display', serif" font-style="italic" font-size="11" text-anchor="middle">Помним, любим, скорбим</text>

        <!-- Чистые ограждения: свежевыкрашенные прутья -->
        <path d="M 120 330 L 120 480 M 170 340 L 170 490 M 220 330 L 220 480 M 580 330 L 580 480 M 630 340 L 630 490 M 680 330 L 680 480" stroke="#111814" stroke-width="6"/>
        <path d="M 100 370 L 240 370 M 560 370 L 700 370" stroke="#18221c" stroke-width="7"/>

        <!-- Элегантная гранитная ваза с живыми алыми гвоздиками -->
        <!-- Ваза -->
        <path d="M 490 420 Q 505 400 495 380 L 515 380 Q 505 400 520 420 Z" fill="url(#graniteShiny)" stroke="#4a5e52" stroke-width="1.5"/>
        <!-- Цветы -->
        <path d="M 505 380 Q 485 340 475 330" stroke="#22c55e" stroke-width="2.5" fill="none"/>
        <circle cx="475" cy="330" r="10" fill="#ef4444"/>
        <path d="M 505 380 Q 505 335 505 320" stroke="#22c55e" stroke-width="2.5" fill="none"/>
        <circle cx="505" cy="320" r="11" fill="#dc2626"/>
        <path d="M 505 380 Q 525 340 535 332" stroke="#22c55e" stroke-width="2.5" fill="none"/>
        <circle cx="535" cy="332" r="10" fill="#ef4444"/>

        <!-- Лампада с теплым огоньком -->
        <rect x="270" y="390" width="22" height="30" rx="4" fill="#991b1b" stroke="#f59e0b" stroke-width="1.5"/>
        <circle cx="281" cy="405" r="5" fill="#fbbf24"/>
        <circle cx="281" cy="405" r="12" fill="rgba(251, 191, 36, 0.3)" filter="blur(3px)"/>

        <!-- Текст пометки -->
        <rect x="635" y="30" width="135" height="34" rx="17" fill="rgba(14,21,18,0.85)" stroke="#d4af37" stroke-width="1"/>
        <text x="702" y="52" fill="#f5df88" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">РЕЗУЛЬТАТ</text>
      </svg>
    `
  },

  fence_painting: {
    title: 'Зачистка от ржавчины и покраска оградки',
    tag: 'Пахомовское кладбище • Павлодар',
    desc: 'Металлическая ограда 2.5 × 2.0 м не красилась более 5 лет. Старая краска потрескалась и отслоилась хлопьями, металл покрылся коррозией.',
    time: '5 часов работы',
    scope: 'Механическая зачистка щетками и насадками до чистого металла, удаление пыли, нанесение антикоррозийного грунта, покраска в 2 слоя молотковой эмалью Hammerite с золочением пик.',
    price: '16 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#18201a"/>
        <rect y="360" width="800" height="240" fill="#141a15"/>
        
        <!-- Ржавые потрескавшиеся ворота/ограда крупно -->
        <g stroke="#78350f" stroke-linecap="round">
          <!-- Столбы -->
          <rect x="140" y="160" width="24" height="320" fill="#592c10" stroke="#3b1905" stroke-width="2"/>
          <rect x="640" y="160" width="24" height="320" fill="#592c10" stroke="#3b1905" stroke-width="2"/>
          <!-- Поперечины -->
          <rect x="150" y="220" width="500" height="16" fill="#6b3414" stroke="#451e09" stroke-width="2"/>
          <rect x="150" y="420" width="500" height="16" fill="#6b3414" stroke="#451e09" stroke-width="2"/>
          <!-- Вертикальные прутья с кривыми пиками -->
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 310 200 L 310 440 M 360 200 L 360 440 M 410 200 L 410 440 M 460 200 L 460 440 M 510 200 L 510 440 M 560 200 L 560 440 M 600 200 L 600 440" stroke="#854d0e" stroke-width="8"/>
        </g>
        
        <!-- Пятна облупившейся краски и ржавчины -->
        <circle cx="260" cy="280" r="14" fill="#a16207" opacity="0.8"/>
        <circle cx="360" cy="340" r="18" fill="#9a3412" opacity="0.9"/>
        <circle cx="460" cy="260" r="16" fill="#78350f" opacity="0.85"/>
        <path d="M 180 230 Q 300 240 450 225" stroke="#ca8a04" stroke-width="3" stroke-dasharray="8 6" fill="none"/>
        <path d="M 220 430 Q 380 435 550 425" stroke="#b45309" stroke-width="4" stroke-dasharray="12 8" fill="none"/>

        <!-- Старый столик с облезшей краской -->
        <rect x="340" y="440" width="120" height="15" rx="3" fill="#543c2c"/>
        <rect x="390" y="455" width="16" height="85" fill="#3d2a1d"/>

        <!-- Метка ДО -->
        <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(0,0,0,0.7)"/>
        <text x="95" y="52" fill="#f87171" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">ДО РАБОТ</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blackGloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2a3830"/>
            <stop offset="30%" stop-color="#0f1612"/>
            <stop offset="70%" stop-color="#1f2d25"/>
            <stop offset="100%" stop-color="#090e0c"/>
          </linearGradient>
          <linearGradient id="goldTip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff2a8"/>
            <stop offset="60%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#8c6810"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#0c1410"/>
        <circle cx="400" cy="220" r="260" fill="rgba(212, 175, 55, 0.09)" filter="blur(50px)"/>
        <rect y="360" width="800" height="240" fill="#080e0a"/>

        <!-- Идеально окрашенная глянцевая ограда Hammerite -->
        <!-- Столбы с золотыми шарами наверху -->
        <rect x="140" y="160" width="24" height="320" fill="url(#blackGloss)" stroke="#3d5244" stroke-width="2"/>
        <circle cx="152" cy="150" r="14" fill="url(#goldTip)"/>
        <rect x="640" y="160" width="24" height="320" fill="url(#blackGloss)" stroke="#3d5244" stroke-width="2"/>
        <circle cx="652" cy="150" r="14" fill="url(#goldTip)"/>

        <!-- Поперечины -->
        <rect x="150" y="220" width="500" height="16" fill="url(#blackGloss)" stroke="#314538" stroke-width="2"/>
        <rect x="150" y="420" width="500" height="16" fill="url(#blackGloss)" stroke="#314538" stroke-width="2"/>

        <!-- Прутья с золочеными коваными пиками -->
        <g stroke="url(#blackGloss)" stroke-width="9" stroke-linecap="round">
          <path d="M 210 200 L 210 440 M 260 200 L 260 440 M 310 200 L 310 440 M 360 200 L 360 440 M 410 200 L 410 440 M 460 200 L 460 440 M 510 200 L 510 440 M 560 200 L 560 440 M 600 200 L 600 440"/>
        </g>
        <!-- Золотые пики на каждом пруте -->
        <polygon points="210,180 204,200 216,200" fill="url(#goldTip)"/>
        <polygon points="260,180 254,200 266,200" fill="url(#goldTip)"/>
        <polygon points="310,180 304,200 316,200" fill="url(#goldTip)"/>
        <polygon points="360,180 354,200 366,200" fill="url(#goldTip)"/>
        <polygon points="410,180 404,200 416,200" fill="url(#goldTip)"/>
        <polygon points="460,180 454,200 466,200" fill="url(#goldTip)"/>
        <polygon points="510,180 504,200 516,200" fill="url(#goldTip)"/>
        <polygon points="560,180 554,200 566,200" fill="url(#goldTip)"/>
        <polygon points="600,180 594,200 606,200" fill="url(#goldTip)"/>

        <!-- Обновленный стол: лакированное дерево и черный металл -->
        <rect x="335" y="440" width="130" height="16" rx="4" fill="#854d0e" stroke="#ca8a04" stroke-width="1.5"/>
        <rect x="392" y="456" width="16" height="84" fill="url(#blackGloss)" stroke="#2b3b31" stroke-width="1"/>

        <!-- Метка ПОСЛЕ -->
        <rect x="635" y="30" width="135" height="34" rx="17" fill="rgba(14,21,18,0.85)" stroke="#d4af37" stroke-width="1"/>
        <text x="702" y="52" fill="#f5df88" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">ПОСЛЕ ПОКРАСКИ</text>
      </svg>
    `
  },

  marble_gravel: {
    title: 'Отсыпка белой мраморной крошкой с геотекстилем',
    tag: 'Новое городское кладбище • Павлодар',
    desc: 'После сильных дождей и ветров могильный холм размывало, земля превращалась в грязь, прорастала сорная трава.',
    time: '6 часов работы',
    scope: 'Выемка верхнего грунта на 10 см, утрамбовка, установка бордюрного полимерного канта по периметру 2×2.5 м, настил сверхплотного геотекстиля (150 г/м²), засыпка 250 кг отборной белой мраморной крошки фракции 10-20 мм.',
    price: '34 000 ₸',
    svgBefore: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#1b231e"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#151c17"/>
        
        <!-- Неровный глиняный грязевой холм с колеями -->
        <ellipse cx="400" cy="450" rx="260" ry="80" fill="#2d2218"/>
        <path d="M 200 460 Q 350 490 600 450 Q 420 420 200 460 Z" fill="#1f160e"/>
        <!-- Проросшие сорняки пучками -->
        <path d="M 280 430 Q 290 390 310 420 M 480 440 Q 500 400 520 450 M 380 470 Q 390 430 410 460" stroke="#4d6152" stroke-width="5" stroke-linecap="round"/>

        <!-- Памятник в грязных брызгах -->
        <rect x="350" y="200" width="100" height="190" rx="8" fill="#26312a" stroke="#37453c" stroke-width="2"/>
        <ellipse cx="400" cy="400" rx="70" ry="14" fill="#1c241f"/>

        <!-- Метка ДО -->
        <rect x="30" y="30" width="130" height="34" rx="17" fill="rgba(0,0,0,0.7)"/>
        <text x="95" y="52" fill="#f87171" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">ДО БЛАГОУСТРОЙСТВА</text>
      </svg>
    `,
    svgAfter: `
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="marbleGlitter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="60%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="#0c1410"/>
        <path d="M 0 320 Q 300 300 800 340 L 800 600 L 0 600 Z" fill="#080e0a"/>

        <!-- Идеальный прямоугольный цоколь с бордюром -->
        <polygon points="120,490 680,490 620,380 180,380" fill="#18231c" stroke="#2c3e32" stroke-width="4"/>

        <!-- Сплошной слой белоснежной мраморной крошки -->
        <polygon points="135,480 665,480 610,390 190,390" fill="#f1f5f9"/>
        
        <!-- Текстура и блеск камней крошки -->
        <g fill="#cbd5e1">
          <circle cx="200" cy="440" r="5"/><circle cx="225" cy="460" r="4"/><circle cx="260" cy="430" r="6"/><circle cx="300" cy="455" r="5"/>
          <circle cx="340" cy="425" r="4"/><circle cx="380" cy="465" r="6"/><circle cx="430" cy="435" r="5"/><circle cx="480" cy="460" r="6"/>
          <circle cx="530" cy="420" r="5"/><circle cx="570" cy="455" r="6"/><circle cx="610" cy="440" r="4"/><circle cx="635" cy="465" r="5"/>
          <circle cx="230" cy="410" r="4"/><circle cx="310" cy="405" r="5"/><circle cx="450" cy="405" r="5"/><circle cx="560" cy="405" r="4"/>
          <circle cx="280" cy="470" r="5"/><circle cx="410" cy="475" r="6"/><circle cx="500" cy="470" r="5"/><circle cx="360" cy="450" r="5"/>
        </g>
        <!-- Белые искры/блики на чистом мраморе -->
        <g fill="#ffffff">
          <circle cx="215" cy="435" r="2.5"/><circle cx="270" cy="450" r="3"/><circle cx="395" cy="430" r="3"/>
          <circle cx="465" cy="450" r="2.5"/><circle cx="545" cy="440" r="3"/><circle cx="620" cy="450" r="2"/>
        </g>

        <!-- Чистый полированный черный монумент -->
        <rect x="350" y="170" width="100" height="220" rx="10" fill="#141c17" stroke="#4a5f51" stroke-width="2"/>
        <rect x="330" y="380" width="140" height="24" rx="4" fill="#1e2b23"/>
        <text x="400" y="275" fill="#f8fafc" font-family="'Playfair Display', serif" font-weight="700" font-size="15" text-anchor="middle">ПАМЯТЬ</text>
        <circle cx="400" cy="225" r="14" fill="#d4af37" opacity="0.8"/>

        <!-- Ваза с цветами на белоснежном мраморе -->
        <ellipse cx="520" cy="410" rx="12" ry="6" fill="#141c17"/>
        <rect x="514" y="380" width="12" height="30" fill="#1e2b23" rx="3"/>
        <circle cx="510" cy="370" r="8" fill="#ef4444"/>
        <circle cx="530" cy="372" r="8" fill="#f59e0b"/>

        <!-- Метка ПОСЛЕ -->
        <rect x="635" y="30" width="135" height="34" rx="17" fill="rgba(14,21,18,0.85)" stroke="#d4af37" stroke-width="1"/>
        <text x="702" y="52" fill="#f5df88" font-family="'Inter', sans-serif" font-weight="700" font-size="14" text-anchor="middle">МРАМОР 100%</text>
      </svg>
    `
  }
};

let currentCaseKey = 'weeds_cleaning';
let isDraggingSlider = false;

function initBeforeAfterSlider() {
  const wrapper = document.getElementById('baSliderWrapper');
  const beforeContainer = document.getElementById('baBeforeImg');
  const afterContainer = document.getElementById('baAfterImg');
  const handle = document.getElementById('baHandle');
  const tabs = document.querySelectorAll('.case-tab-btn');

  if (!wrapper || !beforeContainer || !afterContainer || !handle) return;

  // Отрисовка исходного кейса
  renderCurrentCase();

  // Обработка переключения табов кейсов
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCaseKey = tab.getAttribute('data-case');
      renderCurrentCase();
      // Сброс положения слайдера на 50%
      setSliderPosition(50);
    });
  });

  // Логика перемещения ползунка (Mouse + Touch)
  function onMove(clientX) {
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

    // Масштабирование контента внутри afterContainer для идеального совмещения
    const afterSvgWrap = afterContainer.querySelector('.ba-svg-wrapper');
    if (afterSvgWrap && wrapper.offsetWidth > 0) {
      afterSvgWrap.style.width = wrapper.offsetWidth + 'px';
    }
  }

  // Mouse Events
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

  // Touch Events (для телефонов и планшетов)
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

  // Подстройка ширины SVG при ресайзе окна
  window.addEventListener('resize', () => {
    const currentPct = parseFloat(handle.style.left) || 50;
    setSliderPosition(currentPct);
  });

  // Инициализация стартовой позиции 50%
  setTimeout(() => {
    setSliderPosition(50);
  }, 100);
}

function renderCurrentCase() {
  const caseItem = CASES_DATA[currentCaseKey];
  if (!caseItem) return;

  const beforeContainer = document.getElementById('baBeforeImg');
  const afterContainer = document.getElementById('baAfterImg');

  // Вставка векторных иллюстраций
  beforeContainer.innerHTML = caseItem.svgBefore;
  afterContainer.innerHTML = `<div class="ba-svg-wrapper">${caseItem.svgAfter}</div>`;

  // Обновление карточки информации справа
  document.getElementById('caseTag').textContent = caseItem.tag;
  document.getElementById('caseTitle').textContent = caseItem.title;
  document.getElementById('caseDesc').textContent = caseItem.desc;
  document.getElementById('caseTime').textContent = caseItem.time;
  document.getElementById('caseScope').textContent = caseItem.scope;
  document.getElementById('casePrice').textContent = caseItem.price;

  // Настройка кнопки прямого заказа в WhatsApp
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
   2. ОНЛАЙН-КАЛЬКУЛЯТОР СТОИМОСТИ (В ТЕНГЕ ₸)
   ========================================================================== */

// Базовые ставки и коэффициенты
const CALC_CONFIG = {
  graveSizes: {
    single: { multiplier: 1.0, label: 'Одиночное (до 5 м²)' },
    double: { multiplier: 1.6, label: 'Двойное (до 10 м²)' },
    family: { multiplier: 2.3, label: 'Семейное (3-4 места)' }
  },
  services: {
    cleaning: { basePrice: 8000, label: 'Разовая генеральная уборка и сбор мусора' },
    stone_wash: { basePrice: 4000, label: 'Мытье надгробия спецраствором + полировка' },
    paint_fence: { basePrice: 14000, label: 'Зачистка + грунтовка + покраска оградки' },
    paint_table: { basePrice: 5000, label: 'Покраска столика и лавочки' },
    paint_cross: { basePrice: 4500, label: 'Покраска креста / обновление надписей' },
    herbicides: { basePrice: 5000, label: 'Обработка гербицидами от сорняков на сезон' },
    marble_chips: { basePrice: 28000, label: 'Геотекстиль + отсыпка мраморной крошкой' },
    fresh_flowers: { basePrice: 6000, label: 'Возложение живых цветов и лампада' },
    perennial_plants: { basePrice: 9000, label: 'Посадка многолетников / вечнозеленых туй' }
  },
  cemeteries: {
    suvorovskoe: { surcharge: 0, label: 'Суворовское кладбище' },
    pahomovskoe: { surcharge: 0, label: 'Пахомовское кладбище' },
    muslim: { surcharge: 0, label: 'Мусульманское кладбище (городское)' },
    usolskoe: { surcharge: 0, label: 'Усольское кладбище' },
    leninsky: { surcharge: 2500, label: 'Кладбище пос. Ленинский (+2500 ₸ за выезд)' },
    new_cemetery: { surcharge: 2000, label: 'Новое кладбище (пригород, +2000 ₸ за выезд)' },
    other_region: { surcharge: 4500, label: 'Другое кладбище в Павлодарской обл.' }
  },
  timing: {
    standard: { factor: 1.0, discountText: 'Стандартно (3-5 дней)' },
    twice_year: { factor: 0.9, discountText: '2 раза в год (-10% скидка)' },
    annual: { factor: 0.85, discountText: 'Годовой абонемент (-15% скидка)' }
  }
};

let currentCalculatedTotal = 0;

function initCalculator() {
  const calcForm = document.getElementById('calcForm');
  if (!calcForm) return;

  // Слушатели изменений во всех полях калькулятора
  calcForm.addEventListener('change', calculateTotal);
  
  // Кнопка отправки расчета в WhatsApp
  const btnSubmitWa = document.getElementById('btnSubmitCalcWa');
  if (btnSubmitWa) {
    btnSubmitWa.addEventListener('click', handleSendWhatsAppCalculation);
  }

  // Первоначальный расчет
  calculateTotal();
}

function calculateTotal() {
  // 1. Тип захоронения
  const sizeRadio = document.querySelector('input[name="grave_size"]:checked');
  const sizeKey = sizeRadio ? sizeRadio.value : 'single';
  const sizeData = CALC_CONFIG.graveSizes[sizeKey] || CALC_CONFIG.graveSizes.single;

  // 2. Кладбище
  const cemeterySelect = document.getElementById('cemeterySelect');
  const cemeteryKey = cemeterySelect ? cemeterySelect.value : 'suvorovskoe';
  const cemeteryData = CALC_CONFIG.cemeteries[cemeteryKey] || CALC_CONFIG.cemeteries.suvorovskoe;

  // 3. Выбранные услуги
  const checkedServices = [];
  let servicesSubtotal = 0;

  const serviceCheckboxes = document.querySelectorAll('input[name="service_item"]:checked');
  serviceCheckboxes.forEach(cb => {
    const serviceKey = cb.value;
    const servItem = CALC_CONFIG.services[serviceKey];
    if (servItem) {
      // Некоторые услуги масштабируются от площади (уборка, покраска, мраморная крошка)
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

  // 4. Регулярность / Скидки
  const timingRadio = document.querySelector('input[name="timing_option"]:checked');
  const timingKey = timingRadio ? timingRadio.value : 'standard';
  const timingData = CALC_CONFIG.timing[timingKey] || CALC_CONFIG.timing.standard;

  // Итоговый расчет с учетом доплаты за выезд и скидки
  let grandTotal = (servicesSubtotal * timingData.factor) + cemeteryData.surcharge;
  grandTotal = Math.round(grandTotal / 500) * 500; // Округление до сотен для аккуратности цен

  if (grandTotal < 0) grandTotal = 0;
  currentCalculatedTotal = grandTotal;

  // Обновление отображения
  animatePriceCounter(grandTotal);
  renderSummaryItems(checkedServices, cemeteryData, timingData);
}

// Плавная анимация счета
let currentDisplayValue = 0;
function animatePriceCounter(targetValue) {
  const el = document.getElementById('calcTotalNumber');
  if (!el) return;

  const startValue = currentDisplayValue;
  const duration = 350;
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
        Выберите хотя бы одну услугу в списке выше
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
      <div class="summary-item-row" style="color: var(--gold-300);">
        <span class="summary-item-name">Выезд (${cemetery.label})</span>
        <span class="summary-item-price">+${formatCurrency(cemetery.surcharge)}</span>
      </div>
    `;
  }

  if (timing.factor < 1.0) {
    html += `
      <div class="summary-item-row" style="color: var(--emerald-400);">
        <span class="summary-item-name">Скидка за регулярность</span>
        <span class="summary-item-price">${timing.discountText}</span>
      </div>
    `;
  }

  container.innerHTML = html;
}

/* ==========================================================================
   3. ОТПРАВКА РАСЧЕТА В WHATSAPP (+7 705 126 5477)
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

  // Сбор названий выбранных услуг
  const chosenServices = [];
  document.querySelectorAll('input[name="service_item"]:checked').forEach(cb => {
    const item = CALC_CONFIG.services[cb.value];
    if (item) chosenServices.push(`• ${item.label}`);
  });

  if (chosenServices.length === 0) {
    showToast('Пожалуйста, отметьте галочками хотя бы одну услугу в калькуляторе!');
    return;
  }

  // Формирование аккуратного сообщения для мастера
  let message = `Здравствуйте! Меня зовут ${clientName}.\n\n`;
  message += `Я рассчитал(а) стоимость ухода за захоронением на сайте:\n`;
  message += `📍 Кладбище: ${cemeteryData.label}\n`;
  message += `📐 Участок: ${sizeData.label}\n`;
  message += `📅 Регулярность: ${timingData.discountText}\n\n`;
  message += `🛠 Выбранные услуги:\n`;
  message += `${chosenServices.join('\n')}\n\n`;
  message += `💰 Предварительная стоимость: ${formatCurrency(currentCalculatedTotal)}\n\n`;
  message += `Сориентируйте, пожалуйста, когда сможете осмотреть место и выполнить работы?`;

  const waUrl = `https://wa.me/77051265477?text=${encodeURIComponent(message)}`;

  showToast('Переходим в WhatsApp для согласования заказа...');
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 400);
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
        // Закрыть другие
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

function initMobileNavigation() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open-mobile');
    });
  }

  // Плавный скролл при клике по ссылкам навигации
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('open-mobile')) {
          nav.classList.remove('open-mobile');
        }
      }
    });
  });
}

// Всплывающие уведомления (Toast)
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
