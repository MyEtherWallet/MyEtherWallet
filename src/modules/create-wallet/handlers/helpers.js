const WALLET_TYPES = ['keystore', 'mnemonic', 'overview'];
const keystoreConfig = {
  kdf: 'scrypt',
  n: 131072
};

const createBlob = (str, mime) => {
  const string = typeof str === 'object' ? JSON.stringify(str) : str;
  if (string === null) return '';
  const blob = new Blob([string], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
};

const generateRandomNumber = max => {
  return Math.floor(Math.random() * max);
};

const knuthShuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export {
  WALLET_TYPES,
  keystoreConfig,
  createBlob,
  generateRandomNumber,
  knuthShuffle
};
