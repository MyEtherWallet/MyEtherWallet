function checkCustomPath(path) {
  try {
    let array1;
    // const regExp = /(?<root>^\w+\/)(?<bip>\d+'?\/)(?<coin>\d+'?\/)(?<chain>\d+'?\/)(?<account>.+$)/;
    console.log(path); // todo remove dev item
    const regExp = /(?<root>^\w+)\/(?<bip>\d+)'?\/(?<coin>\d+)'?\/?(?<chain>\d+)?'?\/?(?<account>.+$)?/;
    const matcher = RegExp(regExp, 'g');
    if ((array1 = matcher.exec(path)) !== null) {
      let assembledPath = '';
      if (array1.groups.root)
        assembledPath = assembledPath.concat(array1.groups.root);
      if (array1.groups.bip)
        assembledPath = assembledPath.concat('/', array1.groups.bip, '`');
      if (array1.groups.coin)
        assembledPath = assembledPath.concat('/', array1.groups.coin, '`');
      if (array1.groups.chain)
        assembledPath = assembledPath.concat('/', array1.groups.chain, '`');
      if (array1.groups.account)
        assembledPath = assembledPath.concat('/', array1.groups.account);

      return assembledPath;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default checkCustomPath;
