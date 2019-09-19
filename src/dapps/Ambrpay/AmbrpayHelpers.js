import { Toast } from '@/helpers';

const canBeConvertedToWei = (web3, string, denomination = 'ether') => {
  try {
    web3.utils.toWei(string.toString(), denomination);
  } catch (e) {
    if (
      !e.message.includes('too many decimal places') ||
      !e.message.includes(`invalid number value ''`)
    ) {
      Toast.responseHandler(e, false);
    }
    return false;
  }
  return true;
};

export { canBeConvertedToWei };
