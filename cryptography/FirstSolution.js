const Alphabets = require('./algorithms/Alphabets'),
    CaesarCipher = require('./algorithms/CaesarCipher'),
    VigenereCipher = require('./algorithms/VigenereCipher'),
    KasiskiExamination = require('./algorithms/KasiskiExamination'),
    EnglishFrequencyAnalysis = require('./algorithms/EnglishFrequencyAnalysis'),
    fs = require('fs'),
    { promisify } = require('util'),
    readFile = promisify(fs.readFile),
    chalk = require('chalk');

class FirstSolution {

    constructor(variant, student) {
        this.variant = variant;
        this.student = student;
        this.caesarCipher = new CaesarCipher(Alphabets.AZ, this.variant);
        this.vigenereCipher = new VigenereCipher(Alphabets.AZ, this.student);

        this.frequencyAnalysis = new EnglishFrequencyAnalysis(Alphabets.AZ);
        this.kasiskiExamination = new KasiskiExamination(Alphabets.AZ);
    }

    encryptAndDecryptName(name, cipher) {
        const encrypted = cipher.encrypt(name),
            decrypted = cipher.decrypt(encrypted);

        console.log(`${chalk.yellow('Message:')}\n\t${name}`);
        console.log(`${chalk.blue('Encrypted:')}\n\t${encrypted}`);
        console.log(`${chalk.cyanBright('Decrypted:')}\n\t${decrypted}`);
    }

    async encryptAndDecryptFile(path, cipher, decoder) {
        const file = await readFile(path),
            body = file.toString(),
            encrypted = cipher.encrypt(body),
            decrypted = cipher.decrypt(encrypted),
            decoded = await decoder.decrypt(encrypted),
            accuracy = 100 * decrypted.split('').reduce((acc, char, i) => acc + Number(char == decoded.charAt(i)), 0) / decrypted.length;

        console.log(`${chalk.yellow('Message:')}\n\t${body.replace(/\n/g, '\n\t')}`);
        console.log(`${chalk.blue('Encrypted:')}\n\t${encrypted.replace(/\n/g, '\n\t')}`);
        console.log(`${chalk.cyanBright('Decrypted:')}\n\t${decrypted.replace(/\n/g, '\n\t')}`);
        console.log(`${chalk.red(`Decoded with ${decoder}:`)}\n\t${decoded}`);
        console.log(chalk.red(`Decoded accuracy: ${accuracy.toPrecision(4)}%`))
    }

    encryptAndDecryptNameWithCaeser() {
        return this.encryptAndDecryptName(this.student, this.caesarCipher);
    }

    async encryptAndDecryptFileWithCaeser(path) {
        return this.encryptAndDecryptFile(path, this.caesarCipher, this.frequencyAnalysis);
    }

    async encryptAndDecryptFileWithVigenere(path) {
        return this.encryptAndDecryptFile(path, this.vigenereCipher, this.kasiskiExamination);
    }
}

module.exports = FirstSolution;