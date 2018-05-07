module.exports = {
    test: (main, chai) => {
        let array = [-2, 2, 4];
        let minAbsDiff = main(array);
        chai.expect(minAbsDiff).to.equal(2);

        array = [4, 2, -2];
        minAbsDiff = main(array);
        chai.expect(minAbsDiff).to.equal(2);

        array = [2, 2, 2];
        minAbsDiff = main(array);
        chai.expect(minAbsDiff).to.equal(0);

    },
};
