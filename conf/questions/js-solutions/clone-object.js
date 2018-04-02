module.exports = {
    fn: obj => {
        return JSON.parse(JSON.stringify(obj));
    },
};
