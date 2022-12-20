const checkCustomPath = path => {
  path = path.trim();
  if (
    // eslint-disable-next-line
    /^m(((\/[0-9]+h)+|(\/[0-9]+H)+|(\/[0-9]+')*)((\/[0-9]+)*))$/.test(path) &&
    /^[0-9]/.test(parseInt(path[path.length - 1])) // makes sure the end is numeric and not an apostrophe
  )
    return path;
  return false;
};

export { checkCustomPath };
