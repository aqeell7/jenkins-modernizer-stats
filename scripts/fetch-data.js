import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
// This is where GitHub Actions will clone the massive Jenkins data repository
const EXTERNAL_REPO_DIR = path.join(__dirname, '../../metadata-plugin-modernizer');

const mockData = [
  {
    pluginName: "mock-plugin-local-dev",
    migrations: [
      { migrationName: "Setup Jenkinsfile", migrationStatus: "success" },
      { migrationName: "Migrate To JUnit5", migrationStatus: "fail" }
    ]
  }
];

// Recursively scans directories to find all aggregated_migrations.json files
function findMigrationFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findMigrationFiles(filePath, fileList);
    } else if (filePath.endsWith('reports/aggregated_migrations.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function compileLocalData() {
  console.log('🚀 Starting Zero-API Data Aggregation...');

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Fallback for local development if the massive repo isn't cloned on your machine
  if (!fs.existsSync(EXTERNAL_REPO_DIR)) {
    console.warn(`⚠️ External repo not found at ${EXTERNAL_REPO_DIR}.`);
    console.log('🔄 Using local mock data. (Real data will build on GitHub Actions).');
    fs.writeFileSync(path.join(DATA_DIR, 'aggregated_migrations.json'), JSON.stringify(mockData, null, 2));
    return;
  }

  try {
    const reportPaths = findMigrationFiles(EXTERNAL_REPO_DIR);
    console.log(`Found ${reportPaths.length} plugin reports locally. Compiling...`);

    const masterDataset = reportPaths.map(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    });

    fs.writeFileSync(path.join(DATA_DIR, 'aggregated_migrations.json'), JSON.stringify(masterDataset, null, 2));
    console.log(`✅ Master dataset successfully compiled in milliseconds.`);

  } catch (error) {
    console.error('Critical failure in data compilation:', error);
    process.exit(1);
  }
}

compileLocalData();