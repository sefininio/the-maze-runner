module.exports = {
  test: (main, chai) => {
    const expected = [1, 2, 3, 4, 5];
    const result = main([2, 1, 2, 4, , 3, 3, 4, 5]);
    return chai.expect(result).to.deep.equal(expected);
  },
};
