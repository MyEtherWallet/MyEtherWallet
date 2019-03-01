const ConcatAddr = function(value) {
  if (!value) return '';
  return `${value.substr(0, 8)}...${value.substr(value.length - 6)}`;
};

export default ConcatAddr;
