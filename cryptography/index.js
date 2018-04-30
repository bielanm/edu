const FirstSolution = require('./FirstSolution'),
    chalk = require('chalk');

async function run(firstSolution) {


    console.log(chalk.bold.magentaBright('Caeser cipher:'));
    console.log(chalk.underline.magentaBright('Name ecryption:'));
    firstSolution.encryptAndDecryptNameWithCaeser();
    console.log(chalk.underline.magentaBright('File ecryption:'));
    await firstSolution.encryptAndDecryptFileWithCaeser('data/nothing_else_matters.txt');

    console.log(chalk.bold.magentaBright('Vigenere cipher:'));
    console.log(chalk.underline.magentaBright('File ecryption:'));
    await firstSolution.encryptAndDecryptFileWithVigenere('data/nothing_else_matters.txt');

}

run(new FirstSolution(6, 'Mykhailo Bielan'))
    .catch(console.error.bind(console));

