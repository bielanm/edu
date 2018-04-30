const DictionaryAlphabet = require('./DictionaryAlphabet');

class EnglishFrequencyAnalysis {

    constructor(alphabet) {
        this.alphabet = new DictionaryAlphabet(alphabet);
    }

    decrypt(message) {
        const symbols = message.split('');
        this.frequency = symbols.reduce((acc, letter) => {
            if(letter in acc)
                acc[letter] += 1;
            else
                acc[letter] = 0;

            return acc;
        }, {});

        const mostFrequent = Object.keys(this.frequency)
            .reduce((acc, key) => (this.frequency[acc] > this.frequency[key]) ? acc : key, message[0]);

        const shift = this.alphabet.index('e') - this.alphabet.index(mostFrequent);
        return symbols.map(letter => this.alphabet.letter(this.alphabet.index(letter) + shift)).join('');
    }

    toString() {
        return 'Frequency analysis decoder'
    }

}

module.exports = EnglishFrequencyAnalysis;