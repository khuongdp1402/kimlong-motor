import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { put } from '@vercel/blob';
import { requireAuth } from '../middleware/auth.js';

const ALLOWED_CATEGORIES = new Set(['products', 'news', 'hero', 'testimonials']);
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT_BY_MIME = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function slugify(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}

// Memory storage — we forward the buffer straight to Vercel Blob instead of
// writing to local disk (which doesn't persist across serverless invocations
// anyway).
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME.has(file.mimetype)) {
            return cb(new Error('Chỉ chấp nhận file ảnh JPG, PNG, WEBP hoặc GIF.'));
        }
        cb(null, true);
    },
});

const router = Router();

router.post('/', requireAuth, (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            const message = err instanceof multer.MulterError
                ? (err.code === 'LIMIT_FILE_SIZE' ? 'File quá lớn (tối đa 5MB).' : err.message)
                : err.message;
            return res.status(400).json({ error: message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file được tải lên.' });
        }
        const category = ALLOWED_CATEGORIES.has(req.body.category) ? req.body.category : 'products';
        const ext = EXT_BY_MIME[req.file.mimetype] || path.extname(req.file.originalname) || '';
        const base = slugify(path.basename(req.file.originalname, path.extname(req.file.originalname))) || 'image';
        const unique = crypto.randomBytes(4).toString('hex');
        const pathname = `${category}/${Date.now()}-${base}-${unique}${ext}`;

        try {
            const blob = await put(pathname, req.file.buffer, {
                access: 'public',
                contentType: req.file.mimetype,
            });
            res.status(201).json({ path: blob.url });
        } catch (uploadErr) {
            console.error('Blob upload failed:', uploadErr);
            res.status(500).json({ error: 'Tải ảnh lên thất bại. Vui lòng thử lại.' });
        }
    });
});

export default router;
