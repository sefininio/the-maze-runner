module.exports = {
    test: (main, chai) => {
        const array = [4, 3, 5, 1];
        const newArray = main(array);
        return chai.expect(newArray).to.deep.equal([1, 3, 4, 5]);
    },
};
