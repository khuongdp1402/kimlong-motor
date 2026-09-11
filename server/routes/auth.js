import { Router } from 'express';
import { login } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
    const { password } = req.body || {};
    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
    }
    const token = login(password);
    if (!token) {
        return res.status(401).json({ error: 'Incorrect password.' });
    }
    res.json({ token });
});

export default router;
