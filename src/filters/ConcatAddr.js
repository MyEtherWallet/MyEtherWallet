const ConcatAddr = function(value) {
  if (!value) return '';
  return `${value.substr(0, 7)}...${value.substr(value.length - 3)}`;
};

export default ConcatAddr;
