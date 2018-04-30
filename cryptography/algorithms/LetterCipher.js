

class LetterCipher {

    constructor(alphabet) {
        this.alphabet = alphabet;
    }

    encrypt(message) {

        return message.split('')
            .filter(letter => this.alphabet.contains(letter))
            .map((letter, index) => this.encryptSymbol(letter, index))
            .join('');

    }

    decrypt(message) {

        return message.split('')
            .filter(letter => this.alphabet.contains(letter))
            .map((letter, index) => this.decryptSymbol(letter, index))
            .join('');
    }

    encryptSymbol(symbol, index) {
        throw new Error('Not implemented abstract method');
    }

    decryptSymbol(symbol, index) {
        throw new Error('Not implemented abstract method');
    }
}

module.exports = LetterCipher;