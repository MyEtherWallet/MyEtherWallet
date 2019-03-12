import { haveIcon } from '../partnersConfig';

const hasIcon = currency => {
  if (haveIcon.includes(currency)) {
    return currency;
  } else if (haveIcon.includes(`${currency}-alt`)) {
    return `${currency}-alt`;
  }
  return '';
};

export default hasIcon;
