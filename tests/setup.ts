// Test setup file
import { beforeAll, afterAll } from 'vitest';

// Mock environment variables for testing
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.OPENAI_API_KEY = 'sk-test-key';
  process.env.PERPLEXITY_API_KEY = 'pplx-test-key';
  process.env.SESSION_SECRET = 'test-session-secret-for-testing-only';
  process.env.GOOGLE_PLAY_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmKpOadSgXepj4WaAAOJN
74JyhQPeMopiZJchIikVfzOGkGhR6fFR5X8WGk0VLaKk1rJgFp2+ej6fjCkf/Nq5
GOOdgwHhdj11eUJxkC8rOyiHc6EJGDD5byeL976DH89r8RcPmCNnglG/LCJzsI/o
JhoTXaDkMJB43EI8gsCS/UKC4Uu5naJvkujY4YhRIgoe36Hb/NjPrChgxRG/m1/F
dyBjdbQFFZzkH6UBzWkOQrOtMFvWjHqJk2XlmxxwDXlwK+eQ8MCRmfVBUGOKmU9t
qqLjpspqfjzfUsFiwu9G3K8FOyKku9DrVRKaoG4q5XJ+09CX2nLUGUB21OW/9aU6
mwIDAQAB
-----END PUBLIC KEY-----`;
});

afterAll(() => {
  // Cleanup if needed
});