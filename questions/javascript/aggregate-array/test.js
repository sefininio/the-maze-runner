module.exports = {
    test: (main, chai) => {
        const array = [{ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }];
        const newArray = main(array);
        return chai.expect(newArray).to.deep.equal({ a: 4, b: 8, c: 12 });
    },
};
