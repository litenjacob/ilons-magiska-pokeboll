import inquirer from 'inquirer';
import fs from 'fs';

const prompt = inquirer.createPromptModule();
const csv = fs.readFileSync('./pokemons.csv', 'utf8').split('\n');
const questions = csv.shift().split(',').slice(1);
const pokemons = Object.fromEntries(
  csv
    .map((line) => {
      const [pokemon, color, type1, type2, ...boolStrings] = line.split(',');

      return [
        pokemon,
        Object.fromEntries(
          [
            [`Är den mest ${color}?`, true],
            [`Är den av ${type1}-typ?`, true],
            type2 && [`Är den av ${type2}-typ?`, true],
            [`Är den av två olika typer?`, !!type1 && !!type2],
            ...boolStrings.map((boolString, boolQuestionIndex) => [
              questions[boolQuestionIndex + 3],
              boolString === 'TRUE',
            ]),
          ].filter(Boolean)
        ),
      ];
    })
    .filter(([pokemon]) => !!pokemon)
);

const allQuestions = Array.from(
  new Set(
    Object.values(pokemons)
      .map((questions) => Object.keys(questions))
      .flat()
  )
);
const filteredQuestions = allQuestions.filter(
  (question) =>
    new Set(Object.values(pokemons).map((answers) => answers[question])).size >
    1
);

const questionsToAsk = shuffle(filteredQuestions);
console.log({ questionsToAsk });

// console.log('hello', { allQuestions, questions, filteredQuestions, pokemons });

function shuffle(arr) {
  let i = arr.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
  }
  return arr;
}
