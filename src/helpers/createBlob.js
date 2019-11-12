export default (str, mime) => {
  const string = typeof str === 'object' ? JSON.stringify(str) : str;
  if (string === null) return '';
  const blob = new Blob([string], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
};
