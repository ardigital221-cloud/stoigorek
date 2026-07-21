/**
 * Series Universe Configuration
 * Defines static metadata, database, stats metrics, and achievements for the Series Universe tracker.
 */

const CONFIG = {
  name: "Series Universe",
  title: "Вселенная сериалов",
  heroTitle: "Твоя личная вселенная сериалов",
  heroDesc: "Учет просмотренного, личная статистика, цифровые карточки, энциклопедия миров и календарь новых серий.",
  itemLabel: "Сериал",
  itemLabelPlural: "сериалов",
  creatorLabel: "Студия / Режиссер",
  creatorPlaceholder: "например, HBO, Netflix",
  typeLabel: "Жанр",
  typePlaceholder: "например, Детектив, Фантастика, Драма",
  progressLabel: "Количество сезонов / серий",
  progressPlaceholder: "например, 5 сезонов, 12 серий",
  progressUnit: "серий",
  actionButtonText: "Добавить сериал",
  
  statuses: [
    { id: "watching", label: "Смотрю", color: "#2563eb" },
    { id: "completed", label: "Завершено", color: "#16a34a" },
    { id: "want_to_watch", label: "Хочу посмотреть", color: "#9333ea" }, // Replaced planned with want_to_watch
    { id: "dropped", label: "Брошено", color: "#dc2626" }
  ],

  stats: [
    { id: "time", title: "Потрачено времени", unit: "часов", calc: (items) => items.reduce((acc, item) => acc + (item.progressValue * 0.75) + ((item.rating || 0) * 2.2), 0).toFixed(0) },
    { id: "favoriteType", title: "Любимый жанр", unit: "", calc: (items) => getMostFrequent(items.map(i => i.type)) },
    { id: "completedCount", title: "Завершено", unit: "сериалов", calc: (items) => items.filter(i => i.status === "completed").length }
  ],

  achievements: [
    { id: "detective_fan", title: "Шерлок Холмс", desc: "Посмотреть 3 детектива", check: (items) => items.filter(i => i.status === "completed" && i.type.toLowerCase().includes("детектив")).length >= 3, points: 100 },
    { id: "speedrun", title: "Марафонец", desc: "Оценить сериал на 10 баллов", check: (items) => items.some(i => i.rating === 10), points: 150 },
    { id: "collector_50", title: "Сериаломан", desc: "Добавить 5 сериалов", check: (items) => items.length >= 5, points: 200 }
  ],

  calendarEvents: [
    { date: "2026-07-08", title: "Очень странные дела", subtitle: "Премьера 5 сезона, 1 серия" },
    { date: "2026-07-12", title: "Пацаны (The Boys)", subtitle: "Выходит 6 серия 5 сезона" },
    { date: "2026-07-18", title: "Дюна: Сестринство", subtitle: "Премьера нового сезона" },
    { date: "2026-07-25", title: "Дом Дракона", subtitle: "Финал сезона" }
  ],

  // Mock Encyclopedia Data
  encyclopedia: [
    {
      seriesId: 1,
      title: "Очень странные дела",
      characters: ["Одиннадцатая", "Майк Уилер", "Дастин Хендерсон", "Уилл Байерс", "Лукас Синклер", "Джим Хоппер"],
      locations: ["Хоукинс", "Изнанка", "Лаборатория Хоукинса", "Старкорт Молл"],
      organizations: ["Правительство США", "Русские ученые"],
      theories: ["Векна был с самого начала", "Одиннадцатая создала Изнанку"]
    },
    {
      seriesId: 7,
      title: "Игра престолов",
      characters: ["Джон Сноу", "Дейенерис Таргариен", "Тирион Ланнистер", "Арья Старк", "Серсея Ланнистер"],
      locations: ["Вестерос", "Эссос", "Королевская Гавань", "Винтерфелл", "Стена"],
      organizations: ["Ночной Дозор", "Безликие", "Золотые Мечи"],
      theories: ["Азор Ахай это Джон", "Бран все подстроил"]
    }
  ],

  database: [
    { id: 1, title: "Очень странные дела", type: "Фантастика, Детектив", creator: "Netflix", progress: "4 сезона, 34 серии", desc: "Группа детей сталкивается со сверхъестественными силами...", rating: 9.2 },
    { id: 2, title: "Во все тяжкие", type: "Криминал, Драма", creator: "AMC", progress: "5 сезонов, 62 серии", desc: "Учитель химии решает заняться производством метамфетамина...", rating: 9.5 },
    { id: 7, title: "Игра престолов", type: "Фэнтези, Драма", creator: "HBO", progress: "8 сезонов, 73 серии", desc: "Эпическая борьба за Железный трон Семи Королевств...", rating: 9.3 }
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
