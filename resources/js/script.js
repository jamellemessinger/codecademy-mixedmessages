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
};

// A function that takes in a text file and returns an array with the text file split on every word.
const returnWordsArr = (text) => {
  // Split the text on every new line or every carriage return using a regular expression
  const sentencesArr = text.split(/\r?\n/);
  // console.log(sentences);
  // Split each sentence on every space character and combine every array created into one array using .flat()
  let wordsArr = sentencesArr.map((sentence) => sentence.split(' ')).flat();
  // Make all words lowercase
  wordsArr = wordsArr.map((word) => word.toLowerCase());
  //remove all '.' characters and replace them with an empty string.
  // wordsArr = wordsArr.map((word) => word.replace('.', ''));
  return wordsArr;
};

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
    // Delete any keys from the current word that are undefined.
    delete matrix[words[currentWord]][undefined];
  }
  return matrix;
};

// return the matrix object where the next word frequencies have been normalized
const normalizeFrequencies = (matrixObj) => {
  // set the value of each key in the matrix object to an index in an array stored and then store it in the variable matrixValues
  const matrixValues = Object.values(matrixObj);
  //iterate over every object (each index) in matrixValues
  for (let obj of matrixValues) {
    // initialize the a count variable that we will use to normalize all the frequencies
    let totalCount = 0;
    //for every value (every word), in each object
    for (let objValue in obj) {
      //add the freqency of every value (word) to the total count variable.
      totalCount += obj[objValue];
    }
    //for every value (every word), in each object
    for (let objValue in obj) {
      //set the freqency of each value (word) to the normalized value by dividing the current freqency by the total freqency in the obj
      obj[objValue] = obj[objValue] / totalCount;
    }
  }
  //return the original matrix that now has normalized frequencies
  return matrixObj;
};

// returns a random word from the keys of the object passed in
const generateFirstWord = (obj) => {
  // create a variable to hold the keys of the object passed in, into an array
  let matrixKeys = Object.keys(obj);
  // use Math.random() to generate a random number from 0-1. Multiply it by the length of the keys array. Floor the value to get a whole number. Pass the value into the keys array to get a random word from the array and then store this value into randomFirstWord
  let randomFirstWord =
    matrixKeys[Math.floor(Math.random() * matrixKeys.length)];
  // return randomFirstWord
  return randomFirstWord;
};

// returns the object associated with the last word generated in the senetence array
const getNextPossibilities = (lastWord, obj) => {
  // return the value of the key lastWord from obj. The returned value is also an object
  return obj[lastWord];
};

// returns the next word to be added to the sentence array
const generateNextWord = (obj) => {
  // stores the objects keys into a variable
  let objKeys = Object.keys(obj);
  // stores the objects values into a variable
  let objValues = Object.values(obj);
  // generate a random number from 0 - 1
  let randomNum = Math.random();
  // sets the value of sum to the first value in the object to avoid unnecesary iteration in the for loop
  let sum = objValues[0];
  // initialize the next word as the first word in the keys obj just in case the for loop doesnt redefine nextWord, it will always return a value
  let nextWord = objKeys[0];
  // loops through the length of the obj.values so we can access every value in the object
  for (let i = 0; i < objValues.length; i++) {
    // if the sum is greater or equal to randomNum then you no longer need to check the other values in the object, set next word to the current object key and break out of the for loop
    if (sum >= randomNum) {
      nextWord = objKeys[i];
      break;
      // if sum is not greater or equal to the randomNum add the current object keys value to sum. This allows us to pick a random value weighted based on how frequent the next word pairs with the current word
    } else {
      sum += objValues[i];
    }
  }
  // return the next word to be added to the end of the sentence array
  return nextWord;
};

// returns a formatted sentence from the array
const formatSentence = (sentenceArr) => {
  // takes the first word of the sentence and replaces it with a string literal that capitalizes the first character of the string and uses slice to add the remaining characters to the end of the uppercase character
  sentenceArr[0] = `${sentenceArr[0][0].toUpperCase()}${sentenceArr[0].slice(
    1
  )}`;
  // takes the last word in the string and repalces it with the last word of the string plus a period and a newline
  sentenceArr[sentenceArr.length - 1] = `${
    sentenceArr[sentenceArr.length - 1]
  }.\n`;
  // adds a newline at the beginning of the array
  sentenceArr.unshift('\n');
  // returns a single string as a result of joining every element in the array with a space character
  return sentenceArr.join(' ');
};

// returns a (somewhat) complete sentence based on the object and stopping length passed
const generateNewSentence = (obj, stoppingLength) => {
  // initialize the sentence variable as an array with the first elemnet generated by the generateFirstWord() function
  let sentence = [generateFirstWord(obj)];
  // a while loop that runs as long as the length of the sentene array is less than the stoppingLength paramater
  while (sentence.length < stoppingLength) {
    // initialize the lastWord variable to the last element in the senetence array
    let lastWord = sentence[sentence.length - 1];
    // initialize the newPosibilities variable to the generateNextPossibilites function with lastWord and the object passed as an argument
    let nextPossibilities = getNextPossibilities(lastWord, obj);
    // initialize the nextWord variable to the generateNextWord() function with nextPosibilities object passed as an argument
    let nextWord = generateNextWord(nextPossibilities);
    // push the nextWord on to the end of the sentence array
    sentence.push(nextWord);
  }
  // reassign the sentence variable to the formatted sentence
  sentence = formatSentence(sentence);
  // return the sentence
  return sentence;
};

// a function to that ties everything together
const mixedMessageMarkovChain = async (filePath, sentenceLength = 20) => {
  // create a variable to store the array of words from the data and use await keyword in order to wait for data to load.
  const wordsArr = returnWordsArr(await loadFile(filePath));
  // create a variable to store the matrix
  const matrix = buildMatrix(wordsArr);
  // create a variable to store the matrix object with normalized frequency values
  const normalizedMatrix = normalizeFrequencies(matrix);
  // create a variable to store the sentence created
  const newSentence = generateNewSentence(normalizedMatrix, sentenceLength);
  return newSentence;
};

//  Main execution of the code. Required in order to use async functions
const main = async () => {
  // a try block to try and run the given code
  try {
    // log the sentence to the console
    console.log(
      await mixedMessageMarkovChain('../data/storyTellersStory.txt', 100)
    );
    // a catch block to catch any errors and display them in the console
  } catch (error) {
    // console.error as an attempt to assist in narrowing down the location of the error
    console.error('An error occurred in main:', error);
  }
};

// runs the main function that stores all the code
main();
