// Tiny .env loader (no dependency on the `dotenv` package). Reads server/.env
// (or repo-root .env as a fallback) and applies KEY=VALUE lines to process.env
// without overwriting variables already set in the real environment.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadEnv() {
    const candidates = [
        path.join(__dirname, '.env'),
        path.join(__dirname, '..', '.env'),
    ];

    for (const file of candidates) {
        if (!fs.existsSync(file)) continue;
        const lines = fs.readFileSync(file, 'utf-8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            let value = trimmed.slice(eqIdx + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            if (!(key in process.env)) {
                process.env[key] = value;
            }
        }
        break; // only load the first candidate found
    }
}
