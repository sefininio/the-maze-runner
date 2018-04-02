module.exports = {
    fn: arr => {
        return arr.reduce((agg, cur) => {
            Object.keys(cur).forEach(key => {
                if (agg[key] === undefined) {
                    agg[key] = cur[key];
                } else {
                    agg[key] += cur[key];
                }
            });
            return agg;
        }, {});
    },
};
