import fs from 'fs/promises';
import path from 'path';

async function loadFile(dataSetPath) {
  // Resolve the file path
  const filePath = path.resolve(dataSetPath);
  // Load file into the text variable
  const text = await fs.readFile(filePath, 'utf8');
  // Return the text file
  return text;
}

function returnWordsArr(text) {
  // Split the text on every new line or every carriage return using a regular expression
  const sentencesArr = text.split(/\r?\n/);
  // console.log(sentences);
  // Split each sentence on every space character and combine every array created into one array using .flat()
  const wordsArr = sentencesArr.map((sentence) => sentence.split(' ')).flat();
  // console.log(words);
  return wordsArr;
}

//  Main execution of the code. Required in order to use async functions
async function main() {
  try {
    // 
    const dataSet = '../data/testSet.text';
    const wordsArr = returnWordsArr(await loadFile(dataSet));
    console.log(wordsArr);
  } catch (error) {
    console.error('An error occurred in main:', error);
  }
}

main();
