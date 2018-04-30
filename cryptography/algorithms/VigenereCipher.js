const LetterCipher = require('./LetterCipher'),
    DictionaryAlphabet = require('./DictionaryAlphabet');

class VigenereCipher extends LetterCipher {

    constructor(alphabet, secret) {
        super(new DictionaryAlphabet(alphabet));
        this.secret = secret.toLowerCase().split('').filter((letter) => this.alphabet.contains(letter)).join('');

        if(this.secret.length > 256)
            throw new Error('Key contain more than 256 symbols...')
    }

    encryptSymbol(symbol, index) {
        const letterIndex = this.alphabet.index(symbol),
            secretIndex = this.alphabet.index(this.secret.charAt(index % this.secret.length)),
            mappedIndex = (letterIndex + secretIndex) % this.alphabet.size;

        return this.alphabet.letter(mappedIndex);
    }

    decryptSymbol(symbol, index) {
        const letterIndex = this.alphabet.index(symbol),
            secretIndex = this.alphabet.index(this.secret.charAt(index % this.secret.length)),
            mappedIndex = (this.alphabet.size + letterIndex - secretIndex) % this.alphabet.size;

        return this.alphabet.letter(mappedIndex);
    }

}

module.exports = VigenereCipher;