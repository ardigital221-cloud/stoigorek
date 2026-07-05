/**
 * Niche Configurator
 * Defines dynamic metadata, databases, stats metrics, and achievements for the 4 scalable niches.
 */

const NICHES = {
  shows: {
    id: "shows",
    name: "CineTrack",
    title: "КиноТрекер",
    heroTitle: "Личный трекер сериалов и кино",
    heroDesc: "Учет просмотренного, ведение личной статистики и календарь выхода новых серий. Всё в одном месте, без лишней воды.",
    itemLabel: "Сериал / Фильм",
    itemLabelPlural: "сериалов и фильмов",
    creatorLabel: "Студия / Режиссер",
    creatorPlaceholder: "например, HBO, Netflix, Кристофер Нолан",
    typeLabel: "Жанр",
    typePlaceholder: "например, Детектив, Фантастика, Драма",
    progressLabel: "Количество сезонов / серий",
    progressPlaceholder: "например, 5 сезонов, 12 серий или 1 фильм",
    progressUnit: "серий",
    actionButtonText: "Добавить сериал",
    feedbackPrompt: "Не нашли сериал или фильм в базе? Напишите нам, и мы добавим его! За добавление начисляется 50 очков.",
    feedbackLabel: "Не нашли фильм или сериал?",
    cpaLabel: "Где посмотреть?",
    cpaPartner: "Кинопоиск (CPA реферал)",
    
    statuses: [
      { id: "watching", label: "Смотрю сейчас", icon: "📺", color: "#3b82f6" },
      { id: "completed", label: "Просмотрено", icon: "✅", color: "#10b981" },
      { id: "planned", label: "В планах", icon: "⏳", color: "#eab308" },
      { id: "dropped", label: "Бросил", icon: "❌", color: "#ef4444" }
    ],

    stats: [
      { id: "time", title: "Потрачено времени", unit: "часов", calc: (items) => items.reduce((acc, item) => acc + (item.progressValue * 0.7) + (item.rating * 2), 0).toFixed(0) },
      { id: "favoriteType", title: "Любимый жанр", unit: "", calc: (items) => getMostFrequent(items.map(i => i.type)) },
      { id: "completedCount", title: "Просмотрено", unit: "фильмов/сериалов", calc: (items) => items.filter(i => i.status === "completed").length }
    ],

    achievements: [
      { id: "detective_fan", title: "Шерлок Холмс", desc: "Добавить в просмотренное 3 детектива", check: (items) => items.filter(i => i.status === "completed" && i.type.toLowerCase().includes("детектив")).length >= 3, points: 100, icon: "🕵️‍♂️" },
      { id: "speedrun", title: "Марафонец", desc: "Оценить сериал на 10 баллов", check: (items) => items.some(i => i.rating === 10), points: 150, icon: "🏃" },
      { id: "collector_50", title: "Киноман", desc: "Добавить 5 любых элементов в список", check: (items) => items.length >= 5, points: 200, icon: "🍿" }
    ],

    cpaLinks: [
      { name: "Смотреть на Кинопоиск HD", url: "https://www.kinopoisk.ru/?utm_source=cinetrack_cpa&partner=1023" },
      { name: "Смотреть на Иви", url: "https://www.ivi.ru/?utm_source=cinetrack_cpa&partner=1023" }
    ],

    calendarEvents: [
      { date: "2026-07-08", title: "Очень странные дела", subtitle: "Премьера 5 сезона, 1 серия" },
      { date: "2026-07-12", title: "Пацаны (The Boys)", subtitle: "Выходит 6 серия 5 сезона" },
      { date: "2026-07-18", title: "Дюна: Сестринство", subtitle: "Премьера нового сезона" },
      { date: "2026-07-25", title: "Дом Дракона", subtitle: "Финал сезона" }
    ],

    database: [
      { id: 1, title: "Очень странные дела", type: "Фантастика, Детектив", creator: "Netflix", progress: "4 сезона, 34 серии", desc: "Группа детей сталкивается со сверхъестественными силами и секретными правительственными экспериментами в тихом городке.", rating: 9.2 },
      { id: 2, title: "Во все тяжкие", type: "Криминал, Драма", creator: "AMC", progress: "5 сезонов, 62 серии", desc: "Учитель химии, узнав о смертельной болезни, решает заняться производством метамфетамина ради обеспечения семьи.", rating: 9.5 },
      { id: 3, title: "Шерлок", type: "Детектив, Триллер", creator: "BBC", progress: "4 сезона, 13 серий", desc: "Современная адаптация знаменитых детективных историй Артура Конан Дойла в Лондоне XXI века.", rating: 9.1 },
      { id: 4, title: "Дом Дракона", type: "Фэнтези, Драма", creator: "HBO", progress: "2 сезона, 18 серий", desc: "История расцвета и начала заката правления дома Таргариенов в Вестеросе.", rating: 8.4 },
      { id: 5, title: "Начало", type: "Фантастика, Экшен", creator: "Кристофер Нолан", progress: "1 фильм", desc: "Профессиональный вор крадет секреты из глубин подсознания во время сна.", rating: 8.8 }
    ]
  },

  perfumes: {
    id: "perfumes",
    name: "ScentNote",
    title: "ПарфюмГид",
    heroTitle: "Личный парфюмерный дневник и трекер ароматов",
    heroDesc: "Учет вашей коллекции ароматов, разбор по нотам, статистика брендов и календарь выхода новинок парфюмерии.",
    itemLabel: "Аромат",
    itemLabelPlural: "ароматов",
    creatorLabel: "Парфюмерный дом (Бренд)",
    creatorPlaceholder: "например, Chanel, Tom Ford, Creed",
    typeLabel: "Семейство ароматов",
    typePlaceholder: "например, Древесный, Цветочный, Восточный",
    progressLabel: "Ноты (Верхние, средние, база)",
    progressPlaceholder: "например, Бергамот, Роза, Ветивер, Мускус",
    progressUnit: "нот",
    actionButtonText: "Добавить аромат",
    feedbackPrompt: "Не нашли ваш любимый парфюм? Напишите нам бренд и название, мы внесем в базу и начислим 50 очков парфюмера!",
    feedbackLabel: "Не нашли аромат?",
    cpaLabel: "Где купить?",
    cpaPartner: "Золотое Яблоко (CPA реферал)",

    statuses: [
      { id: "watching", label: "В коллекции", icon: "🧴", color: "#10b981" },
      { id: "completed", label: "Использован", icon: "🗑️", color: "#9ca3af" },
      { id: "planned", label: "Хочу попробовать", icon: "🛍️", color: "#eab308" },
      { id: "dropped", label: "Любимый (Signature)", icon: "💖", color: "#ec4899" }
    ],

    stats: [
      { id: "time", title: "Всего нот изучено", unit: "ингредиентов", calc: (items) => items.reduce((acc, item) => acc + (item.progressValue > 0 ? item.progressValue : 5), 0).toFixed(0) },
      { id: "favoriteType", title: "Любимое семейство", unit: "", calc: (items) => getMostFrequent(items.map(i => i.type)) },
      { id: "completedCount", title: "В коллекции", unit: "ароматов", calc: (items) => items.filter(i => i.status === "watching").length }
    ],

    achievements: [
      { id: "woody_fan", title: "Лесной Эстет", desc: "Добавить 3 древесных аромата", check: (items) => items.filter(i => i.type.toLowerCase().includes("древес")).length >= 3, points: 100, icon: "🌲" },
      { id: "signature_choice", title: "Идеальный вкус", desc: "Оценить аромат на 10 баллов", check: (items) => items.some(i => i.rating === 10), points: 150, icon: "✨" },
      { id: "collector_50", title: "Парфюмерный Коллекционер", desc: "Добавить 5 любых ароматов в списки", check: (items) => items.length >= 5, points: 200, icon: "🔮" }
    ],

    cpaLinks: [
      { name: "Купить в Золотом Яблоке", url: "https://goldapple.ru/?utm_source=scentnote_cpa&partner=405" },
      { name: "Купить в Лэтуаль", url: "https://letu.ru/?utm_source=scentnote_cpa&partner=405" }
    ],

    calendarEvents: [
      { date: "2026-07-08", title: "Tom Ford Cherry Smoke Intense", subtitle: "Мировой релиз нового фланкера" },
      { date: "2026-07-15", title: "Byredo Desert Dawn", subtitle: "Старт продаж эксклюзивно в РФ" },
      { date: "2026-07-22", title: "Chanel Chance Eau Fraiche Parfum", subtitle: "Выпуск лимитированной серии" }
    ],

    database: [
      { id: 1, title: "Lost Cherry", type: "Восточные, Гурманские", creator: "Tom Ford", progress: "Вишня, Горький миндаль, Ликер, Роза, Сандал, Бобы тонка", desc: "Аромат контрастов: сладкий соблазн спелой вишни сочетается со знойным теплом миндаля и древесных нот.", rating: 9.0 },
      { id: 2, title: "Baccarat Rouge 540", type: "Восточные, Цветочные", creator: "Maison Francis Kurkdjian", progress: "Шафран, Жасмин, Серая амбра, Кедр, Еловая смола", desc: "Уникальный алхимический шедевр с яркими нотами смолы, карамели, жасмина и благородного шафрана.", rating: 8.7 },
      { id: 3, title: "Gypsy Water", type: "Древесные", creator: "Byredo", progress: "Можжевельник, Лимон, Перец, Иглы сосны, Ладан, Амбра", desc: "Ода свободе цыганской жизни. Пахнет свежей землей, сосновыми лесами, костром и сандалом.", rating: 8.9 },
      { id: 4, title: "Bleu de Chanel", type: "Древесные, Фужерные", creator: "Chanel", progress: "Грейпфрут, Мята, Розовый перец, Имбирь, Ладан, Пачули", desc: "Классический мужественный и элегантный аромат со свежим цитрусовым стартом и глубокой древесной базой.", rating: 9.3 }
    ]
  },

  botanics: {
    id: "botanics",
    name: "FloraCare",
    title: "Домашний ботаник",
    heroTitle: "Дневник полива и ухода за комнатными растениями",
    heroDesc: "Систематизируйте уход за домашней оранжереей. Календарь полива, рекомендации по освещенности и геймификация садоводства.",
    itemLabel: "Растение",
    itemLabelPlural: "растений",
    creatorLabel: "Вид растения",
    creatorPlaceholder: "например, Монстера, Суккулент, Фикус",
    typeLabel: "Освещенность / Уход",
    typePlaceholder: "например, Полутень, Яркий свет, Легкий уход",
    progressLabel: "Режим полива (дней между поливами)",
    progressPlaceholder: "например, каждые 7 дней летом, 14 дней зимой",
    progressUnit: "дней",
    actionButtonText: "Добавить растение",
    feedbackPrompt: "У вас дома редкий цветок, которого нет в нашей базе знаний? Напишите нам, мы добавим его и подарим вам 50 семян!",
    feedbackLabel: "Не нашли растение?",
    cpaLabel: "Где купить семена и уход?",
    cpaPartner: "Озон Садоводство (CPA реферал)",

    statuses: [
      { id: "watching", label: "Растёт у меня", icon: "🌱", color: "#10b981" },
      { id: "completed", label: "Реанимировано", icon: "🏥", color: "#3b82f6" },
      { id: "planned", label: "Хочу завести", icon: "🛒", color: "#eab308" },
      { id: "dropped", label: "Погибло / Потеряно", icon: "🍂", color: "#ef4444" }
    ],

    stats: [
      { id: "time", title: "Растений полито за неделю", unit: "раз", calc: (items) => (items.filter(i => i.status === "watching").length * 1.5).toFixed(0) },
      { id: "favoriteType", title: "Самый частый уход", unit: "", calc: (items) => getMostFrequent(items.map(i => i.type)) },
      { id: "completedCount", title: "Растёт дома", unit: "растений", calc: (items) => items.filter(i => i.status === "watching").length }
    ],

    achievements: [
      { id: "succulent_fan", title: "Пустынный Рейнджер", desc: "Завести 3 суккулента / кактуса", check: (items) => items.filter(i => i.creator.toLowerCase().includes("суккулент") || i.title.toLowerCase().includes("кактус")).length >= 3, points: 100, icon: "🌵" },
      { id: "perfect_care", title: "Зеленый палец", desc: "Дать растению оценку здоровья 10 баллов", check: (items) => items.some(i => i.rating === 10), points: 150, icon: "🍀" },
      { id: "collector_50", title: "Оранжерея", desc: "Добавить 5 любых растений в списки", check: (items) => items.length >= 5, points: 200, icon: "🏡" }
    ],

    cpaLinks: [
      { name: "Купить грунты и семена на OZON", url: "https://www.ozon.ru/category/dom-i-sad-14500/?utm_source=floracore_cpa" },
      { name: "Стимуляторы роста на Яндекс Маркет", url: "https://market.yandex.ru/?utm_source=floracore_cpa" }
    ],

    calendarEvents: [
      { date: "2026-07-07", title: "Монстера Деликатесная", subtitle: "Время полива и опрыскивания" },
      { date: "2026-07-10", title: "Фикус Бенджамина", subtitle: "Пора внести комплексное удобрение" },
      { date: "2026-07-15", title: "Суккуленты на подоконнике", subtitle: "Летний полив по расписанию" }
    ],

    database: [
      { id: 1, title: "Монстера Деликатесная", type: "Яркий рассеянный свет, Полутень", creator: "Монстера лиана", progress: "Полив каждые 7-10 дней, опрыскивание", desc: "Популярное комнатное растение с огромными резными листьями. Любит влажность и умеренное тепло.", rating: 9.4 },
      { id: 2, title: "Фикус Эластика (Каучуконосный)", type: "Яркий свет, Умеренный полив", creator: "Фикус дерево", progress: "Полив каждые 7 дней", desc: "Элегантное дерево с блестящими плотными темно-зелеными листьями. Очищает воздух в помещении.", rating: 8.8 },
      { id: 3, title: "Сансевиерия (Тещин язык)", type: "Любой свет, Редкий полив", creator: "Сансевиерия", progress: "Полив каждые 14-20 дней", desc: "Почти неубиваемое растение. Идеально для новичков. Переживет засуху и тень.", rating: 9.0 },
      { id: 4, title: "Кактус Эхинокактус Грузони", type: "Прямое солнце, Сухость", creator: "Суккулент / Кактус", progress: "Полив раз в 15-20 дней летом, зимой раз в месяц", desc: "Большой колючий шар золотистого цвета. Требует минимум ухода и максимум солнца.", rating: 8.5 }
    ]
  },

  recipes: {
    id: "recipes",
    name: "RecipeBook",
    title: "Книга рецептов и заготовок",
    heroTitle: "Интерактивный блокнот рецептов и сезонных закруток",
    heroDesc: "Записывайте рецепты, ведите календарь заготовок на зиму, делитесь опытом и анализируйте разнообразие вашего меню.",
    itemLabel: "Рецепт / Блюдо",
    itemLabelPlural: "рецептов и заготовок",
    creatorLabel: "Категория блюда",
    creatorPlaceholder: "например, Консервация, Выпечка, Десерты",
    typeLabel: "Сложность приготовления",
    typePlaceholder: "например, Легко, Средне, Шеф-повар",
    progressLabel: "Время готовки / Ингредиенты",
    progressPlaceholder: "например, 45 мин, Помидоры, Чеснок, Укроп",
    progressUnit: "мин",
    actionButtonText: "Добавить рецепт",
    feedbackPrompt: "У вас есть уникальный бабушкин рецепт закруток? Отправьте нам, мы добавим его в общий каталог, а вам начислим 50 поварских колпаков!",
    feedbackLabel: "Не нашли рецепт?",
    cpaLabel: "Заказать продукты?",
    cpaPartner: "Самокат Доставка (CPA реферал)",

    statuses: [
      { id: "watching", label: "Готовил (Проверено)", icon: "🥘", color: "#10b981" },
      { id: "completed", label: "В банках (Заготовки)", icon: "🥫", color: "#ec4899" },
      { id: "planned", label: "В планах приготовить", icon: "⏳", color: "#eab308" },
      { id: "dropped", label: "Коронное блюдо", icon: "👑", color: "#3b82f6" }
    ],

    stats: [
      { id: "time", title: "Проведено за готовкой", unit: "минут", calc: (items) => items.reduce((acc, item) => acc + (item.progressValue > 0 ? item.progressValue : 30), 0).toFixed(0) },
      { id: "favoriteType", title: "Любимая сложность", unit: "", calc: (items) => getMostFrequent(items.map(i => i.type)) },
      { id: "completedCount", title: "Закатано банок", unit: "штук", calc: (items) => items.filter(i => i.status === "completed").length * 5 }
    ],

    achievements: [
      { id: "canning_fan", title: "Мастер закаток", desc: "Добавить 3 рецепта консервации", check: (items) => items.filter(i => i.creator.toLowerCase().includes("консерв") || i.status === "completed").length >= 3, points: 100, icon: "🍅" },
      { id: "chef_star", title: "Мишленовский повар", desc: "Поставить рецепту оценку 10 баллов", check: (items) => items.some(i => i.rating === 10), points: 150, icon: "👨‍🍳" },
      { id: "collector_50", title: "Сытый дом", desc: "Добавить 5 рецептов в свою книгу", check: (items) => items.length >= 5, points: 200, icon: "🍕" }
    ],

    cpaLinks: [
      { name: "Заказать ингредиенты в Самокате", url: "https://samokat.ru/?utm_source=recipebook_cpa" },
      { name: "Свежие овощие во ВкусВилл", url: "https://vkusvill.ru/?utm_source=recipebook_cpa" }
    ],

    calendarEvents: [
      { date: "2026-07-09", title: "Маринованные огурчики", subtitle: "Сезон сбора огурцов: пора делать закатку" },
      { date: "2026-07-14", title: "Вишневый джем", subtitle: "Закрываем лето в банки" },
      { date: "2026-07-20", title: "Кабачковая икра", subtitle: "Сбор урожая кабачков" }
    ],

    database: [
      { id: 1, title: "Маринованные томаты с чесноком", type: "Средне", creator: "Консервация", progress: "45 минут, Томаты, Чеснок, Уксус, Укроп", desc: "Классический рецепт хрустящих пикантных помидоров на зиму. Банки стерилизуются 15 минут.", rating: 9.3 },
      { id: 2, title: "Паста Карбонара", type: "Легко", creator: "Вторые блюда", progress: "20 минут, Спагетти, Бекон, Желтки, Пармезан", desc: "Классическое итальянское сытное блюдо без использования сливок. Готовится очень быстро.", rating: 9.1 },
      { id: 3, title: "Яблочный пирог (Шарлотка)", type: "Легко", creator: "Выпечка", progress: "40 минут, Яблоки, Мука, Яйца, Сахар", desc: "Самый простой и нежный пирог к чаю. Всего 4 ингредиента, которые всегда есть дома.", rating: 8.9 },
      { id: 4, title: "Клубничное варенье-пятиминутка", type: "Легко", creator: "Консервация", progress: "30 минут, Клубника, Сахар, Лимонный сок", desc: "Быстрый способ сварить ароматное варенье, сохранив форму и пользу лесных ягод.", rating: 9.6 }
    ]
  }
};

/**
 * Helper function to find the most frequent item in an array
 */
function getMostFrequent(arr) {
  if (arr.length === 0) return "Нет данных";
  const counts = {};
  let maxCount = 0;
  let mostFrequent = arr[0];
  
  for (const item of arr) {
    if (!item) continue;
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      mostFrequent = item;
    }
  }
  return mostFrequent;
}
