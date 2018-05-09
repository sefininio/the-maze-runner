module.exports = {
    test: (main, chai) => {
        const array = main(5);
        const array = main(5);
        return chai.expect(main(5)).to.equal([0, 1, 1, 2, 3]) && 
                chai.expect(main(5, [5])).to.equal([0, 5, 5, 10, 15]) &&
                chai.expect(main(5, [4, 5])).to.equal([4, 5, 9, 14, 23]);
    },
};
