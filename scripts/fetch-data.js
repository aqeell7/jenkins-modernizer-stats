// scripts/fetch-data.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../src/data');

// The GitHub Tree API lets us see the entire folder structure in one request
const TREE_API_URL = 'https://api.github.com/repos/jenkins-infra/metadata-plugin-modernizer/git/trees/main?recursive=1';

async function fetchJenkinsData() {
  console.log('🌳 Scanning Jenkins repository tree...');
  
  if (!fs.existsSync(DATA_DIR)){
      fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  try {
    const treeResponse = await fetch(TREE_API_URL);
    if (!treeResponse.ok) throw new Error(`Tree fetch failed: ${treeResponse.status}`);
    
    const treeData = await treeResponse.json();
    
    // Filter out everything except the specific report files
    const reportFiles = treeData.tree.filter(file => 
      file.path.endsWith('reports/aggregated_migrations.json')
    );

    console.log(`Found ${reportFiles.length} plugin reports. Fetching a sample of 10 to respect API limits...`);
    
    // Limit to 10 for the prototype
    const sampleFiles = reportFiles.slice(0, 10);
    const masterDataset = [];

    // Fetch the raw JSON for each of our sampled plugins
    for (const file of sampleFiles) {
      const rawUrl = `https://raw.githubusercontent.com/jenkins-infra/metadata-plugin-modernizer/main/${file.path}`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        const pluginData = await res.json();
        masterDataset.push(pluginData);
      }
    }

    // Save our combined master file!
    fs.writeFileSync(
      path.join(DATA_DIR, 'aggregated_migrations.json'), 
      JSON.stringify(masterDataset, null, 2)
    );
    
    console.log(`✅ Successfully compiled master dataset from ${masterDataset.length} plugins.`);
    
  } catch (error) {
    console.error('Critical failure in data fetcher:', error);
    process.exit(1);
  }
}

fetchJenkinsData();