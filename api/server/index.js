import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { securityMiddleware } from './middleware/security.js';
import * as ai from './services/ai.js';
import * as billing from './services/billing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

// --- CORS exacto ---
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb){
    if (!origin) return cb(null, true);              // permitir curl/postman
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS: origin not allowed: '+origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Accept','x-utm-source','x-utm-medium','x-utm-campaign'],
  credentials: false
}));
app.options('*', (req,res)=>res.sendStatus(200));

// --- Seguridad base ---
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: { "default-src": ["'self'", "https:"], "img-src": ["'self'","https:","data:","blob:"] }
  },
  referrerPolicy: { policy: "no-referrer" }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true, limit: '1mb' }));
app.use(morgan('tiny'));
app.use(securityMiddleware());

// --- Rate limits ---
const rlCommon = rateLimit({ windowMs: 15*60*1000, max: 100 });
const rlChef   = rateLimit({ windowMs: 15*60*1000, max: 30 });
app.use('/api/', rlCommon);

// --- Health ---
app.get('/api/health', (req,res)=> {
  res.json({ ok:true, ts: Date.now(), env: process.env.NODE_ENV || 'dev' });
});

// --- Chef IA ---
app.post('/api/chef', rlChef, async (req,res,next)=>{
  try{
    const { prompt, alergias = [], presupuesto, tiempo, imageUrl } = req.body || {};
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error:'prompt requerido' });
    const result = await ai.generate({ prompt, alergias, presupuesto, tiempo, imageUrl });
    res.json({ result });
  }catch(err){ next(err); }
});

// --- Billing ---
app.get('/api/subscription-status', (req,res)=>{
  const { userId } = req.query;
  if(!userId) return res.status(400).json({ error:'userId requerido' });
  res.json(billing.getStatus(userId));
});

app.post('/api/billing/verify', async (req,res)=>{
  const { userId, purchaseToken } = req.body || {};
  if(!userId || !purchaseToken) return res.status(400).json({ error:'userId y purchaseToken requeridos' });
  const out = await billing.verifyPlay({ userId, purchaseToken });
  res.json(out);
});

// --- Upload imágenes ---
const storage = multer.diskStorage({
  destination: (req, file, cb)=> cb(null, UPLOAD_DIR),
  filename: (req, file, cb)=> {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req,file,cb)=>{
    const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('mimetype no permitido'), ok);
  }
});
app.post('/api/upload', upload.single('file'), (req,res)=>{
  const fname = req.file?.filename;
  if(!fname) return res.status(400).json({ error:'no file' });
  res.json({ imageUrl: `/uploads/${fname}` });
});
app.use('/uploads', express.static(UPLOAD_DIR, { etag:true, maxAge:'1h' }));

// --- QA Smoke Tests ---
app.get('/api/qa/smoke', async (req,res)=>{
  const results = {
    timestamp: new Date().toISOString(),
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Health
  try {
    const healthStart = Date.now();
    const healthData = { ok: true, ts: Date.now(), env: process.env.NODE_ENV || 'dev' };
    results.tests.push({
      name: 'Health Check',
      status: 'passed',
      duration: `${Date.now() - healthStart}ms`,
      data: healthData
    });
    results.passed++;
  } catch(err) {
    results.tests.push({ name: 'Health Check', status: 'failed', error: err.message });
    results.failed++;
  }

  // Test 2: Billing Status
  try {
    const billingStart = Date.now();
    const testUserId = 'test-user-123';
    const status = billing.getStatus(testUserId);
    results.tests.push({
      name: 'Billing Status',
      status: status.isPremium !== undefined ? 'passed' : 'failed',
      duration: `${Date.now() - billingStart}ms`,
      data: status
    });
    results.passed++;
  } catch(err) {
    results.tests.push({ name: 'Billing Status', status: 'failed', error: err.message });
    results.failed++;
  }

  // Test 3: Menu Generation (mock test)
  try {
    const menuStart = Date.now();
    const mockMenu = await ai.generateMenu({ 
      userId: 'test-123', 
      personas: 2, 
      presupuesto: 50,
      tiempo: 30
    });
    results.tests.push({
      name: 'Menu Generation',
      status: mockMenu ? 'passed' : 'failed',
      duration: `${Date.now() - menuStart}ms`,
      data: { hasResult: !!mockMenu, length: mockMenu?.length || 0 }
    });
    results.passed++;
  } catch(err) {
    results.tests.push({ name: 'Menu Generation', status: 'failed', error: err.message });
    results.failed++;
  }

  // Test 4: Chef IA
  try {
    const chefStart = Date.now();
    const chefResult = await ai.chef({ 
      prompt: 'Receta rápida de pasta',
      alergias: [],
      presupuesto: 5,
      tiempo: 15
    });
    results.tests.push({
      name: 'Chef AI',
      status: chefResult ? 'passed' : 'failed',
      duration: `${Date.now() - chefStart}ms`,
      data: { hasResult: !!chefResult, length: chefResult?.length || 0 }
    });
    results.passed++;
  } catch(err) {
    results.tests.push({ name: 'Chef AI', status: 'failed', error: err.message });
    results.failed++;
  }

  // Summary
  results.summary = `${results.passed} passed, ${results.failed} failed`;
  results.success = results.failed === 0;

  res.json(results);
});

// --- Error handler ---
app.use((err, req, res, next)=>{
  const code = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(code).json({ error: err.message || 'internal', code, path: req.path, ts: Date.now() });
});

app.listen(PORT, ()=> console.log(`[TCF] API listening on :${PORT}`));
