module.exports = {
    fn: (arr) => {
        arr.sort(function (a, b) { return a - b });
        return arr.reduce((acc, num, idx) => {
            if (idx === 0) return acc;
            return Math.min(acc, Math.abs(arr[idx - 1] - num));
        }, Number.MAX_VALUE);
    },
};
