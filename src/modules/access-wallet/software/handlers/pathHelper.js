const checkCustomPath = path => {
  path = path.trim();
  if (
    // eslint-disable-next-line
    /^m(((\/[0-9]+h)+|(\/[0-9]+H)+|(\/[0-9]+')*)((\/[0-9]+)*))$/.test(path) &&
    path[path.length - 1] === "'"
  )
    return path;
  return false;
};

export { checkCustomPath };
