const Alg = require('./Algorithms'),
    readline = require('readline'),
    EnglishFrequencyAnalysis = require('./EnglishFrequencyAnalysis');

class KasiskiExamination {

    constructor(alphabet) {
        this.rl = readline.createInterface(process.stdin, process.stdout);
        this.rl.pause();
        this.frequencyAnalysis = new EnglishFrequencyAnalysis(alphabet);
    }

    async decrypt(message) {
        const mgrams = this.findDistances(message, 5),
            ngrams = this.findDistances(message, 7),
            nodes = new Set();

        for(let i = 0; i < mgrams.length; i++) {
            for(let j = 0; j < ngrams.length; j++) {
                nodes.add(Alg.nod(mgrams[i], ngrams[j]));
            }
        }

        const sorted = Array.from(nodes).filter(nod => nod <= 256).sort((a, b) => a - b),
            text = sorted.map((key, i) => `${i + 1}. ${key}`).join('\n');

        this.rl.resume();
        let answer = await new Promise((res, rej) => this.rl.question(`What length of the key to use:\n${text}\n`, res)),
            key = Number(answer);
        while (!Number.isInteger(key) || (0 >= key) || (key > sorted.length)) {
            answer = await new Promise((res, rej) => this.rl.question(`Enter integer between ${1}-${sorted.length}\n`, res));
            key = Number(answer);
        }
        this.rl.pause();
        const keyLength = sorted[key - 1],
            groups = new Array(keyLength).fill(0).map(() => new Array()),
            symbols = message.split('');

        for(let i = 0; i < symbols.length; i++) {
            groups[i%keyLength].push(symbols[i]);
        }

        const encoded = groups.map((group) => this.frequencyAnalysis.decrypt(group.join('')).split('')),
            result = [];
        for(let i = 0; i < symbols.length; i++) {
            result.push(encoded[i % keyLength][Math.trunc(i / keyLength)]);
        }

        return result.join('');

    }

    findDistances(message, length) {
        const distances = [];
        for(let i = 0; i < message.length - length; i++) {
            const str = message.slice(i, i + length),
                next = message.indexOf(str, i + 1);

            if (next > 0)
                distances.push(next - i);
        }
        return distances;
    }

    toString() {
        return 'Kasiski attack decoder'
    }

}

module.exports = KasiskiExamination;