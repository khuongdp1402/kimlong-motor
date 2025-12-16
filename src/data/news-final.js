// Final news data - merged from scraping
import { mergedNews } from './merged-data.js';

export const newsCategories = [
    { id: 'tin-tuc', name: 'Tin tức', slug: 'tin-tuc' },
    { id: 'kien-thuc', name: 'Kiến thức', slug: 'kien-thuc' },
    { id: 'khuyen-mai', name: 'Khuyến mãi', slug: 'khuyen-mai' },
    { id: 'su-kien', name: 'Sự kiện', slug: 'su-kien' },
];

// Clean và format news data
export const newsArticles = mergedNews
    .filter((article, index, self) => 
        // Remove duplicates
        index === self.findIndex(a => a.title === article.title)
    )
    .map((article, index) => ({
        ...article,
        id: index + 1,
        // Clean date
        date: article.date.replace(/\s+/g, ' ').trim() || new Date().toISOString().split('T')[0],
        // Clean image - remove data URIs
        image: article.image && article.image.startsWith('data:') 
            ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069'
            : article.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069',
        // Clean content
        content: article.content || `<p>${article.excerpt}</p>`,
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

