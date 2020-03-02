/* from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value/4760279#4760279
   Use `-` to reverse the sort order for the specified property */
function dynamicSort(property, convertFunc) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    if (convertFunc) {
      const result =
        convertFunc(+a[property]) < convertFunc(+b[property])
          ? -1
          : convertFunc(+a[property]) > convertFunc(+b[property])
          ? 1
          : 0;
      return result * sortOrder;
    }
    const result =
      +a[property] < +b[property] ? -1 : +a[property] > +b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function dynamicSortMultiple() {
  const props = arguments;
  return function(obj1, obj2) {
    let i = 0;
    let result = 0;
    const numberOfProperties = props.length;
    while (result === 0 && i < numberOfProperties) {
      if (Array.isArray(props[i])) {
        try {
          if (typeof props[i][1] === 'function') {
            result = dynamicSort(props[i][0], props[i][1])(obj1, obj2);
          }
        } catch (e) {
          result = dynamicSort(props[i][0])(obj1, obj2);
        }
      } else {
        result = dynamicSort(props[i])(obj1, obj2);
      }
      i++;
    }
    return result;
  };
}
function cleanUndefined(providerData) {
  return providerData.filter(entry => typeof entry !== 'undefined');
}

function bestProviderForQuantity(providerData, value) {
  providerData = cleanUndefined(providerData);
  if (providerData.every(entry => value >= +entry.minValue)) {
    providerData.sort(dynamicSortMultiple('-rate'));
  } else if (providerData.some(entry => value >= +entry.minValue)) {
    providerData = [
      ...providerData
        .filter(entry => value >= entry.minValue)
        .sort(dynamicSortMultiple('-rate')),
      ...providerData
        .filter(entry => value < entry.minValue)
        .sort(dynamicSortMultiple('-rate', 'minValue'))
    ];
  } else {
    providerData.sort(dynamicSortMultiple('-rate', 'minValue'));
  }
  return providerData;
}

function bestRateForQuantity(providerData, value) {
  const data = bestProviderForQuantity(providerData, +value);
  for (let i = 0; i < data.length; i++) {
    if (+value >= +data[i].minValue) {
      return +data[i].rate;
    } else if (+data[i].minValue === 0) {
      return +data[i].rate;
    }
  }
  return -1;
}

export { bestRateForQuantity, bestProviderForQuantity, dynamicSortMultiple };
