import fs from 'fs';
import path from 'path';

interface CodeChunk {
  id: string;
  file: string;
  name: string;
  type: 'function' | 'interface' | 'class' | 'variable';
  content: string;
  startLine: number;
  endLine: number;
  criticality: 'high' | 'medium' | 'low';
  domain: 'compiler' | 'renderer' | 'ui' | 'infra';
  version: string;
}

const SRC_DIR = './src';
const OUTPUT_FILE = './codebase_index.json';

function getCriticality(name: string): 'high' | 'medium' | 'low' {
  const high = ['parse', 'resolve', 'render', 'eject', 'update', 'hitTest'];
  if (high.some(h => name.toLowerCase().includes(h.toLowerCase()))) return 'high';
  return 'medium';
}

function getDomain(file: string): 'compiler' | 'renderer' | 'ui' | 'infra' {
  if (file.includes('parser') || file.includes('lexer') || file.includes('resolver') || file.includes('eject')) return 'compiler';
  if (file.includes('Renderer')) return 'renderer';
  if (file.includes('App') || file.includes('components')) return 'ui';
  return 'infra';
}

function scanFile(filePath: string): CodeChunk[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const chunks: CodeChunk[] = [];

  // Simple regex-based chunking (simulating AST awareness)
  const patterns = [
    { type: 'function', regex: /export (?:async )?function (\w+)/g },
    { type: 'interface', regex: /export interface (\w+)/g },
    { type: 'class', regex: /export class (\w+)/g },
    { type: 'variable', regex: /export const (\w+)/g },
  ];

  patterns.forEach(({ type, regex }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const name = match[1];
      const startPos = match.index;
      const startLine = content.substring(0, startPos).split('\n').length;
      
      // Find the end of the block (very simple brace counting)
      let endLine = startLine;
      let braceCount = 0;
      let started = false;
      for (let i = startPos; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          started = true;
        } else if (content[i] === '}') {
          braceCount--;
        }
        if (started && braceCount === 0) {
          endLine = content.substring(0, i).split('\n').length;
          break;
        }
      }

      chunks.push({
        id: `${path.basename(filePath)}-${name}`,
        file: filePath,
        name,
        type: type as any,
        content: lines.slice(startLine - 1, endLine).join('\n'),
        startLine,
        endLine,
        criticality: getCriticality(name),
        domain: getDomain(filePath),
        version: '1.0.0'
      });
    }
  });

  return chunks;
}

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

console.log('🚀 Gesso Indexer v1.0.0 starting...');
const files = walk(SRC_DIR);
console.log(`🔍 Found ${files.length} source files.`);

const allChunks: CodeChunk[] = [];
files.forEach(file => {
  const chunks = scanFile(file);
  allChunks.push(...chunks);
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChunks, null, 2));
console.log(`✅ Indexed ${allChunks.length} symbols to ${OUTPUT_FILE}`);
