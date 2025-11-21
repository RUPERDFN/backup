// Production wrapper for vite.ts to handle path resolution
import { serveStatic as originalServeStatic } from './vite.js';
import express from 'express';
import fs from 'fs';
import path from 'path';

// Override serveStatic function for production
export function serveStatic(app) {
  // Use environment variable or fallback to relative path
  const distPath = process.env.DIST_PATH || path.resolve(process.cwd(), "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Re-export everything else
export * from './vite.js';