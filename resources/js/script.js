// const data = require("../data/testSet.text");
// console.log(data);

import fs from 'fs/promises';
import path from 'path';

// Resolve the file path
const filePath = path.resolve('../data/testSet.text');

try {
  // Read the file content
  const text = await fs.readFile(filePath, 'utf8');
  console.log(text);
} catch (error) {
  console.error('Error:', error); 
}

