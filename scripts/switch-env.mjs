import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetEnv = process.argv[2];

if (!targetEnv || !['dev', 'prod'].includes(targetEnv.toLowerCase())) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Please specify the target environment: "dev" or "prod"');
  console.log('\nUsage:');
  console.log('  npm run env:dev   (Switch to DEV Database)');
  console.log('  npm run env:prod  (Switch to PROD Database)');
  console.log('  npm run dev:prod  (Switch to PROD and run dev server)\n');
  process.exit(1);
}

const envMode = targetEnv.toLowerCase();
const sourceFile = path.join(rootDir, `.env.${envMode}`);
const destinationFile = path.join(rootDir, '.env.local');

if (!fs.existsSync(sourceFile)) {
  console.error('\x1b[31m%s\x1b[0m', `❌ File .env.${envMode} not found in project root.`);
  process.exit(1);
}

try {
  fs.copyFileSync(sourceFile, destinationFile);
  
  if (envMode === 'prod') {
    console.log('\n\x1b[41m\x1b[37m%s\x1b[0m', ' ⚠️  WARNING: SWITCHED TO PRODUCTION DATABASE (.env.local)  ');
    console.log('\x1b[33m%s\x1b[0m', '→ All local actions / API calls will now read and write to PRODUCTION!\n');
  } else {
    console.log('\n\x1b[42m\x1b[30m%s\x1b[0m', ' ✔ ACTIVE DATABASE: DEVELOPMENT (.env.local) ');
    console.log('\x1b[32m%s\x1b[0m', '→ Local environment is safely connected to the DEV database.\n');
  }
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', `❌ Failed to copy .env.${envMode} to .env.local: ${error.message}`);
  process.exit(1);
}
