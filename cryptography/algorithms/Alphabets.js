const AZLower = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
        'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ],
    AZUpper = AZLower.map(letter => letter.toUpperCase()),
    AZ = [...AZLower, ...AZUpper];

module.exports = { AZLower, AZUpper, AZ };