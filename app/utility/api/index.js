export function getNews(q = "bitcoin") {
  return fetch(
    `https://newsapi.org/v2/everything?q=${q}&apiKey=${process.env.NEWS_API_KEY}`
  );
}

export function getNewsHeadline(q = "in") {
  return fetch(
    `https://newsapi.org/v2/top-headlines?country=${q}&apiKey=${process.env.NEWS_API_KEY}`
  );
}
