module.exports = {
  fn: arr =>
    arr.sort((a, b) => {
      if (a.age > b.age) {
        return -1;
      }
      if (a.age < b.age) {
        return 1;
      }
      return 0;
    }),
};
