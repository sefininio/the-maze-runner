module.exports = {
    test: (main, chai) => {
        const expected = [
            'Index: 4, element: undefined',
            'Index: 4, element: undefined',
            'Index: 4, element: undefined',
            'Index: 4, element: undefined',
        ];
        const result = main();
        return chai.expect(result).to.deep.equal(expected);
    },
};
