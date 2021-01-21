import url from 'url';
const capitalize = value => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.substr(1, value.length);
};

const getService = parsableUrl => {
  const parsedUrl = url.parse(parsableUrl).hostname;
  const splitUrl = parsedUrl.split('.');
  if (splitUrl.length > 2)
    // eslint-disable-next-line
    return capitalize(`${splitUrl[1]}.${splitUrl[2]}`);
  return capitalize(splitUrl.join('.'));
};

export default getService;
