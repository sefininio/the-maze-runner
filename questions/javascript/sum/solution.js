module.exports = {
    fn: (x, y) => {
        if (y !== undefined) {
            return x + y;
        } else {
            return function(y) {
                return x + y;
            };
        }
    },
};
