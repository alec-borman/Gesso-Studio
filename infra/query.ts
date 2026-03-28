import fs from 'fs';
import path from 'path';

interface CodeChunk {
  id: string;
  file: string;
  name: string;
  type: string;
  content: string;
  startLine: number;
  endLine: number;
  criticality: string;
  domain: string;
  version: string;
}

const INDEX_FILE = './codebase_index.json';

function search(query: string) {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error(`❌ Index file not found at ${INDEX_FILE}. Run 'npm run index' first.`);
    process.exit(1);
  }

  const index: CodeChunk[] = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  const results = index.filter(chunk => 
    chunk.name.toLowerCase().includes(query.toLowerCase()) ||
    chunk.content.toLowerCase().includes(query.toLowerCase()) ||
    chunk.domain.toLowerCase().includes(query.toLowerCase())
  );

  console.log(`🔍 Found ${results.length} results for query: "${query}"\n`);

  results.forEach((res, i) => {
    console.log(`[${i + 1}] ${res.name} (${res.type})`);
    console.log(`    File: ${res.file}:${res.startLine}`);
    console.log(`    Domain: ${res.domain} | Criticality: ${res.criticality}`);
    console.log(`    ---`);
    // Print first 3 lines of content
    const lines = res.content.split('\n');
    console.log(lines.slice(0, 3).map(l => `    ${l}`).join('\n'));
    if (lines.length > 3) console.log(`    ...`);
    console.log(`\n`);
  });
}

const query = process.argv[2];
if (!query) {
  console.log('Usage: npm run search <query>');
  process.exit(1);
}

search(query);
