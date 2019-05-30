import Toast from './responseHandler';

const splitPath = path => {
  let array1;
  // eslint-disable-next-line
  const regExp = /(?<root>^\w+)\/?(?<bip>\d+)'?\/?(?<coin>\d+)'?\/?(?<chain>\d+)?'?\/?(?<account>.+$)/;
  const matcher = RegExp(regExp, 'g');
  if ((array1 = matcher.exec(path)) !== null) {
    return array1;
  }
  return null;
};

const checkCustomPath = path => {
  path = path.trim();
  try {
    let array1;
    if ((array1 = splitPath(path)) !== null) {
      let assembledPath = '';
      if (array1[1]) {
        if (array1[1] !== 'm') return false;
        assembledPath = assembledPath.concat(array1[1]);
      } else {
        return false;
      }

      if (array1[2]) assembledPath = assembledPath.concat('/', array1[2], "'");
      if (array1[3]) assembledPath = assembledPath.concat('/', array1[3], "'");
      if (array1[4] && !/'/.test(array1[4]))
        assembledPath = assembledPath.concat('/', array1[4], "'");
      if (array1[5] && !/'/.test(array1[5]))
        assembledPath = assembledPath.concat('/', array1[5]);
      console.log(assembledPath); // todo remove dev item
      return assembledPath;
    }
    return false;
  } catch (e) {
    Toast.responseHandler(e, Toast.ERROR);
    return false;
  }
};

const pathHelper = {
  splitPath,
  checkCustomPath
};

export default pathHelper;
