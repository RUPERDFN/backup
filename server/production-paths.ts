// Production paths configuration for Docker deployment
import path from "path";
import { fileURLToPath } from "url";

// Fix for import.meta.dirname in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export safe dirname that works in all environments
export const serverDir = __dirname;
export const rootDir = path.resolve(__dirname, "..");
export const clientDir = path.resolve(rootDir, "client");
export const distDir = path.resolve(rootDir, "dist", "public");