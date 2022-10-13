function copyValue(value) {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(value).then(resolve).catch(reject);
  });
}

export default copyValue;
