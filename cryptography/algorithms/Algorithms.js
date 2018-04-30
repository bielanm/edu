

class Algorithms {

    nod(N, M) {
        if ((N == 1) || (M == 1))
            return 1;

        while(N != M) {
            if (N > M)
                N = N - M;
            else
                M = M - N;
        }

        return N;
    }

    max(array) {
        return Array.prototype.apply(array, Math.max)
    }

}

module.exports = new Algorithms();