export const isAmountValid = (amount, min, max) => {
  const val = parseFloat(amount);

  if (!isNaN(val) && val >= min && val <= max) {
    return true;
  }

  return false;
};

export const getTokenPrice = async tokenId => {
  const cacheKey = `dao_rc_${tokenId}`;
  let parsedResponse = null;
  try {
    const cache = localStorage.getItem(cacheKey);

    try {
      if (cache) {
        parsedResponse = JSON.parse(cache);
      }
    } catch (_) {
      parsedResponse = null;
    }
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=USD`
    );

    if (response.ok && response.status === 200) {
      const data = await response.json();

      localStorage.setItem(cacheKey, JSON.stringify(data));
      return Promise.resolve(data);
    }
    return Promise.resolve(parsedResponse);
  } catch (e) {
    return Promise.resolve(parsedResponse);
  }
};
