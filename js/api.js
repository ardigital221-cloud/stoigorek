const KINOPOISK_API_KEY = "693591e8-adb6-4c06-ba50-efbb54f2be94";

const API = {
  async searchSeries(query) {
    try {
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': KINOPOISK_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.films || [];
    } catch (e) {
      console.error("Ошибка при поиске через API Кинопоиска:", e);
      return [];
    }
  }
};
