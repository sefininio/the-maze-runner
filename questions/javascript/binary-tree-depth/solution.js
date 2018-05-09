module.exports = {
  fn: tree => {
    let counter = 0;
    const iterate = (obj, depth) => {
      if (obj === null || obj === undefined) {
        return;
      }
      counter = depth;
      iterate(obj.yes, depth + 1);
      iterate(obj.no, depth + 1);
    };
    iterate(tree, 0);
    return counter;
  },
};
