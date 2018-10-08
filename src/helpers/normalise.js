import * as uts46 from 'idna-uts46';

const normalise = function(str) {
  return uts46.toUnicode(str, {
    useStd3ASCII: true,
    transitional: false
  });
};

export default normalise;
