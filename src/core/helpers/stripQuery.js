import xss from 'xss';

export default function (queryObj) {
  const newObj = {};
  Object.keys(queryObj).forEach(key => {
    newObj[key] = xss(queryObj[key]);
  });
  return newObj;
}
