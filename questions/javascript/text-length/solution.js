module.exports = {
    fn: (text, minWordLength) => {
        return text
            .replace(/[^\w\s]/gi, '')
            .match(/[\w]+/g)
            .filter(word => word.length < minWordLength)
            .map(word => word.length)
            .reduce((acc, length) => acc + length, 0);
    },
};
