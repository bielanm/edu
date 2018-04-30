const LetterCipher = require('./LetterCipher'),
    DictionaryAlphabet = require('./DictionaryAlphabet');



class CaesarCipher extends LetterCipher {

    constructor(alphabet, key) {
        super(new DictionaryAlphabet(alphabet));
        this.key = key;
    }

    encryptSymbol(symbol) {
        const index =  this.alphabet.index(symbol),
            mappedIndex = (index + this.key) % this.alphabet.size;

        return this.alphabet.letter(mappedIndex);
    }

    decryptSymbol(symbol) {
        const index =  this.alphabet.index(symbol),
            mappedIndex = (this.alphabet.size + index - this.key) % this.alphabet.size;

        return this.alphabet.letter(mappedIndex);
    }

}

module.exports = CaesarCipher;