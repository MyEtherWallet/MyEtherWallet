const checkCustomPath = (path: string): boolean => {
  path = path.trim();
  if (

    /^m(((\/[0-9]+h)+|(\/[0-9]+H)+|(\/[0-9]+')*)((\/[0-9]+)*))$/.test(path) &&
    (path[path.length - 1] === "'" ||
      /^[0-9]/.test(path[path.length - 1])
    )) return true;
  return false;
};

export { checkCustomPath };
