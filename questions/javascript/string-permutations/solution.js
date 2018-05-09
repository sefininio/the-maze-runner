module.exports = {
  fn: src => {
    const arr = [src];

    const f = (i, str) => {
      if (i === src.length) {
        return f(1, str);
      }
      const buff = str.split('');
      const tmp = buff[i];
      buff[i] = buff[i - 1];
      buff[i - 1] = tmp;
      str = buff.join('');
      if (buff.join('') === src) return null;

      arr.push(str);
      f(i + 1, str);
    };

    f(1, src);
    return arr;
  },
};
