module.exports = {
  test: (main, chai) => {
    const source = 'man';

    const expected = ['man', 'amn', 'anm', 'nam', 'nma', 'mna'];
    const result = main(source);
    return chai.expect(result).to.deep.equal(expected);
  },
};
