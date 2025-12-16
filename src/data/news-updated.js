// Updated news data from scraping
import { mergedNews } from './merged-data.js';
import { newsArticles as existingNews } from './news.js';

export const newsCategories = [
    { id: 'tin-tuc', name: 'Tin tức', slug: 'tin-tuc' },
    { id: 'kien-thuc', name: 'Kiến thức', slug: 'kien-thuc' },
    { id: 'khuyen-mai', name: 'Khuyến mãi', slug: 'khuyen-mai' },
    { id: 'su-kien', name: 'Sự kiện', slug: 'su-kien' },
];

// Clean và merge news data
const cleanedScrapedNews = mergedNews
    .filter((article, index, self) => {
        // Remove duplicates
        const firstIndex = self.findIndex(a => a.title === article.title);
        return index === firstIndex;
    })
    .filter(article => {
        // Remove invalid articles
        return article.title && 
               article.title.length > 5 && 
               !article.image.startsWith('data:');
    })
    .slice(0, 12) // Limit to 12 articles
    .map((article, index) => ({
        id: index + 1,
        title: article.title.trim(),
        slug: article.slug || article.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        category: article.category || 'tin-tuc',
        image: article.image && !article.image.startsWith('data:') 
            ? article.image 
            : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069',
        excerpt: article.excerpt || article.title,
        content: article.content || `<p>${article.excerpt || article.title}</p>`,
        author: article.author || 'Kim Long Motor',
        date: article.date.replace(/\s+/g, ' ').trim() || new Date().toISOString().split('T')[0],
        featured: article.featured || index < 3,
    }));

// Merge với existing news (ưu tiên existing nếu có)
const existingNewsMap = new Map(existingNews.map(n => [n.slug, n]));

export const newsArticles = [
    ...existingNews, // Keep existing news first
    ...cleanedScrapedNews.filter(scraped => !existingNewsMap.has(scraped.slug))
].slice(0, 20); // Limit total to 20

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

