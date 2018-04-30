

class DictionaryAlphabet {

    constructor(letters) {
        this.letters = letters;
        this.size = letters.length;

        this.dictionary = letters.reduce((acc, letter, index) => {
            acc[letter] = index;
            return acc;
        }, {});
    }

    index(letter) {
        return this.dictionary[letter]
    }

    letter(index) {
        return this.letters[index]
    }

    contains(letter) {
        const index = this.dictionary[letter];
        return index || index === 0;
    }

}

module.exports = DictionaryAlphabet;