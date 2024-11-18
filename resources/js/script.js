import fs from 'fs/promises';
import path from 'path';

// An asyncronous function that loads the text file into a variable and returns the varilable.
const loadFile = async (dataSetPath) => {
  // Resolve the file path
  const filePath = path.resolve(dataSetPath);
  // Load file into the text variable
  const text = await fs.readFile(filePath, 'utf8');
  // Return the text file
  return text;
}

// A function that takes in a text file and returns an array with the text file split on every word.
const returnWordsArr = (text) => {
  // Split the text on every new line or every carriage return using a regular expression
  const sentencesArr = text.split(/\r?\n/);
  // console.log(sentences);
  // Split each sentence on every space character and combine every array created into one array using .flat()
  let wordsArr = sentencesArr.map((sentence) => sentence.split(' ')).flat();
  wordsArr = wordsArr.map((word) => word.toLowerCase());
  // console.log(words);
  return wordsArr;
}

// Create a mapping of words to the possible next words with their frequencies in an dictionary/object.
const buildMatrix = (words) => {
  // Create an empty dictionary to be returned
  let matrix = {};
  // loop through the given array with a for loop.
  for (let currentWord = 0; currentWord < words.length; currentWord++) {
    // Define what the next word looks like: one index higher than current word
    let nextWord = currentWord + 1;
    // if the current word is in the matrix object:
    if (words[currentWord] in matrix) {
      // and if the next word in the words array is in the currnt words object
      if (words[nextWord] in matrix[words[currentWord]]) {
        // add one to the frequency value of the next word in the current word object martix { currentWord : {nextWord : increment this value}}
        matrix[words[currentWord]][words[nextWord]]++;
      } else {
        // if the next word in the words array is not in the current words object, use Object.assign to add a new object with the next word with the frequeney value of 1 to the current words object. This combines two objects and sets the value of current word to the newly combined object.
        Object.assign(matrix[words[currentWord]], { [words[nextWord]]: 1 });
      }
    } else {
      // else, the current word is not in the matrix object, so add current word as a key and create an object with the next word with the frequency value of 1 as its value.
      matrix[words[currentWord]] = {
        [words[nextWord]]: 1,
      };
    }
  }
  return matrix;
}

//  Main execution of the code. Required in order to use async functions
const main = async () => {
  try {
    // create a varilable to store the file path to the data we want to use
    const dataSet = '../data/vivian.txt';
    // create a variable to store the array of words from the data and use await keyword in order to wait for data to load.
    const wordsArr = returnWordsArr(await loadFile(dataSet));
    // console.log(wordsArr);
    const matrix = buildMatrix(wordsArr);
    console.log(matrix);
  } catch (error) {
    console.error('An error occurred in main:', error);
  }
}

main();
