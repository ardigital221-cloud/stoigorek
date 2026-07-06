/**
 * CineTrack Configuration
 * Defines static metadata, database, stats metrics, and achievements for the Movie/Series tracker.
 */

const CONFIG = {
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
};

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
