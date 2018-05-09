module.exports = {
  fn: source => {
    const map = source.reduce((a, c) => {
      a[c] = c;
      return a;
    }, {});
    return Object.values(map).sort();
  },
};
