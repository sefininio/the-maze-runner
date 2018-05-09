module.exports = {
  test: (main, chai) => {
    const array = [
      {
        name: 'bob',
        age: 28,
      },
      {
        name: 'john',
        age: 22,
      },
      {
        name: 'bill',
        age: 26,
      },
    ];
    const expected = [
      {
        name: 'bob',
        age: 28,
      },
      {
        name: 'bill',
        age: 26,
      },
      {
        name: 'john',
        age: 22,
      },
    ];
    const newArray = main(array);
    return chai.expect(newArray).to.deep.equal(expected);
  },
};
