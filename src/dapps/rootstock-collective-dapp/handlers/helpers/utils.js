export const isAmountValid = (amount, min, max) => {
  if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
    return false;
  }
  const val = parseFloat(amount);

  return !Number.isNaN(val) && Number.isFinite(val) && val >= min && val <= max;
};

export const DISPLAY_NAME_SEPARATOR = 'D15PL4Y_N4M3:';
export const splitCombinedName = name => {
  const [proposalName, builderName] = name.split(DISPLAY_NAME_SEPARATOR);
  return { proposalName, builderName };
};

export const removeBrackets = name => {
  if (!name) {
    return '';
  }

  const bracketIndex = name.indexOf(']');

  if (bracketIndex !== -1) {
    return name.slice(bracketIndex + 1).trimStart();
  }

  return name;
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
    // For all other cases including 429 status code
    return Promise.resolve(parsedResponse);
  } catch (e) {
    // Send null in case of error or cache miss
    return Promise.resolve(parsedResponse);
  }
};
