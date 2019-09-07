const ConcatAddr = function(value) {
  if (!value) return '';
  if (value.length > 10)
    return `${value.substr(0, 15)}...${value.substr(value.length - 6)}`;
  if (value.length > 6)
    return `${value.substr(0, 6)}...${value.substr(value.length - 6)}`;
  return value;
};

export default ConcatAddr;
