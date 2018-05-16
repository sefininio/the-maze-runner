module.exports = {
    fn: function* iterateRandom(originalArray) {
        let array = originalArray.slice(0);
        while (array.length > 0) {
            index = Math.floor(Math.random() * array.length);
            yield array[index];
            array.splice(index, 1);
        }
    }
};
