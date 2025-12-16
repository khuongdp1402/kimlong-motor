// Updated products with scraped data and local images
// This file merges existing product data with scraped images

import { products as existingProducts, productCategories as existingCategories } from './products.js';
import { scrapedProducts, scrapedCategories } from './scraped-data.js';

// Use scraped categories as the source of truth
export const productCategories = scrapedCategories.map(scrapedCat => {
    // Try to find existing category to enrich description e.g.
    const existing = existingCategories.find(c => c.id === scrapedCat.id || c.slug === scrapedCat.slug);
    return {
        ...scrapedCat,
        // Keep description if scraped is empty but existing has one
        description: scrapedCat.description || (existing ? existing.description : ''),
        // Use scraped image if available, else fallback to existing (though user said delete excess, for images we prefer local scraped)
        image: (scrapedCat.image && scrapedCat.image.startsWith('/images/')) ? scrapedCat.image : (existing?.image || '')
    };
});

// Use scraped products as the source of truth
export const products = scrapedProducts.map(scrapedProduct => {
    // Find corresponding existing product to enrich specs/features
    const existingProduct = existingProducts.find(p =>
        p.name.toLowerCase() === scrapedProduct.name.toLowerCase() ||
        p.name.replace(/\s+/g, ' ') === scrapedProduct.name.replace(/\s+/g, ' ') ||
        // Try fuzzy match
        p.name.includes(scrapedProduct.name) ||
        scrapedProduct.name.includes(p.name)
    );

    return {
        ...scrapedProduct,
        // Enrich with existing data if available and scraped data is missing
        description: scrapedProduct.description || (existingProduct ? existingProduct.description : ''),
        specs: (scrapedProduct.specs && scrapedProduct.specs.length > 0) ? scrapedProduct.specs : (existingProduct ? existingProduct.specs : []),
        features: (scrapedProduct.features && scrapedProduct.features.length > 0) ? scrapedProduct.features : (existingProduct ? existingProduct.features : []),
        // Ensure price is from scrape if available
        price: scrapedProduct.price !== 'Liên hệ' ? scrapedProduct.price : (existingProduct?.price || 'Liên hệ'),
        // Images are already set correctly in scraped data
    };
});

// Helper functions
export const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
};

export const getProductBySlug = (slug) => {
    return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category === categoryId);
};

export const getCategoryBySlug = (slug) => {
    return productCategories.find(c => c.slug === slug);
};

