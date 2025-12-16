export const newsCategories = [
  { id: 'tin-tuc', name: 'Tin tức', slug: 'tin-tuc' },
  { id: 'kien-thuc', name: 'Kiến thức', slug: 'kien-thuc' },
  { id: 'khuyen-mai', name: 'Khuyến mãi', slug: 'khuyen-mai' },
  { id: 'su-kien', name: 'Sự kiện', slug: 'su-kien' },
];

import { scrapedNews } from './scraped-data.js';
// Helper to clean dates if needed
const cleanDate = (dateStr) => {
  // Basic cleanup or keeping as is if it's already a valid format
  return dateStr.replace(/\s+/g, ' ').trim();
};

export const newsArticles = scrapedNews.map(article => ({
  ...article,
  date: cleanDate(article.date),
  // Ensure category exists in our categories list, default to 'tin-tuc'
  category: ['tin-tuc', 'kien-thuc', 'khuyen-mai', 'su-kien'].includes(article.category) ? article.category : 'tin-tuc'
}));


export const getNewsById = (id) => {
  return newsArticles.find(n => n.id === parseInt(id));
};

export const getNewsBySlug = (slug) => {
  return newsArticles.find(n => n.slug === slug);
};

export const getNewsByCategory = (categoryId) => {
  return newsArticles.filter(n => n.category === categoryId);
};

export const getFeaturedNews = () => {
  return newsArticles.filter(n => n.featured);
};

export const getLatestNews = (limit = 3) => {
  return newsArticles.slice(0, limit);
};
