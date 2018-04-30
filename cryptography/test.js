const FirstSolution = require('./FirstSolution'),
    Alphabets = require('./algorithms/Alphabets'),
    CaesarCipher = require('./algorithms/CaesarCipher'),
    VigenereCipher = require('./algorithms/VigenereCipher'),
    KasiskiExamination = require('./algorithms/KasiskiExamination'),
    EnglishFrequencyAnalysis = require('./algorithms/EnglishFrequencyAnalysis'),
    fs = require('fs'),
    { promisify } = require('util'),
    readFile = promisify(fs.readFile);

async function run(firstSolution) {


    const customAlphabet = Alphabets.AZ,
        vigenereCipher = new VigenereCipher(customAlphabet, 'Bielan Mykhailo Serhiyovych'),
        file = await readFile('data/hp#7.txt'),
        body = file.toString(),

        encrypted = vigenereCipher.encrypt(body),
        kasiskiExamination = new KasiskiExamination(customAlphabet),
        decrypted = await kasiskiExamination.decrypt(encrypted);

    console.log(decrypted)
        //kasiskiExamination = new KasiskiExamination(encrypted),
        //key = await kasiskiExamination.decrypt();

}

run(new FirstSolution(6, 'Misha Bielan'))
    .catch((error) => console.error(error));

