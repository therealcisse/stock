export default function intersperse(a, delim) {
  let first = true;
  const ret = [];
  for (const x of a) {
    if (x) {
      if (!first) ret.push(delim);
      first = false;
      ret.push(x);
    }
  }

  return ret;
}
