// Thin fetch wrapper for the Express API. In dev, Vite proxies /api -> the
// Express server (see vite.config.js); in prod both are typically served
// behind the same origin/reverse proxy, so relative paths work either way.
const BASE = '/api';

function authHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
            ...(options.headers || {}),
        },
    });
    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            if (body?.error) message = body.error;
        } catch {
            // ignore
        }
        throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
}

// ---- Auth ----
export const login = (password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });

// ---- Products ----
export const getProducts = () => request('/products');
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (data) => request('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
export const setProductFeatured = (id, featured) => request(`/products/${id}/featured`, { method: 'PATCH', body: JSON.stringify({ featured }) });

// ---- Articles ----
export const getArticles = () => request('/articles');
export const getArticle = (id) => request(`/articles/${id}`);
export const createArticle = (data) => request('/articles', { method: 'POST', body: JSON.stringify(data) });
export const updateArticle = (id, data) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteArticle = (id) => request(`/articles/${id}`, { method: 'DELETE' });
export const setArticleFeatured = (id, featured) => request(`/articles/${id}/featured`, { method: 'PATCH', body: JSON.stringify({ featured }) });

// ---- Testimonials ----
export const getTestimonials = () => request('/testimonials');
export const createTestimonial = (data) => request('/testimonials', { method: 'POST', body: JSON.stringify(data) });
export const updateTestimonial = (id, data) => request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTestimonial = (id) => request(`/testimonials/${id}`, { method: 'DELETE' });

// ---- Uploads ----
export async function uploadImage(file, category) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    const res = await fetch(`${BASE}/upload`, {
        method: 'POST',
        headers: { ...authHeaders() }, // no Content-Type: browser sets multipart boundary
        body: formData,
    });
    if (!res.ok) {
        let message = `Tải ảnh thất bại (${res.status})`;
        try {
            const body = await res.json();
            if (body?.error) message = body.error;
        } catch {
            // ignore
        }
        throw new Error(message);
    }
    return res.json();
}

// ---- Misc content ----
export const getAbout = () => request('/about');
export const getContact = () => request('/contact');

// ---- Leads (contact form submissions) ----
export const createLead = (data) => request('/leads', { method: 'POST', body: JSON.stringify(data) });
export const getLeads = () => request('/leads');

// ---- Homepage / site content blocks ----
export const getHeroSlides = () => request('/heroSlides');
export const getCategoryTiles = () => request('/categoryTiles');
export const getWhyChooseUs = () => request('/whyChooseUs');
export const getServiceSteps = () => request('/serviceSteps');
export const getPhotoStrip = () => request('/photoStrip');
export const getShowroom = () => request('/showroom');
export const getFooterContent = () => request('/footer');
export const getHomepageProductSections = () => request('/homepageProductSections');
