const gs = (m, d) => {
  const first = {
    0: 'Aquarius',
    1: 'Pisces',
    2: 'Aries',
    3: 'Taurus',
    4: 'Gemini',
    5: 'Cancer',
    6: 'Leo',
    7: 'Virgo',
    8: 'Libra',
    9: 'Scorpio',
    10: 'Sagittarius',
    11: 'Capricorn'
  };

  let i;

  switch (m) {
    case 0:
      if (d > 20) {
        i = m;
      } else {
        i = 11;
      }
      break;
    case 1:
      if (d > 19) {
        i = m;
      } else {
        i = 0;
      }
      break;
    case 2:
      if (d > 21) {
        i = m;
      } else {
        i = 1;
      }
      break;
    case 3:
      if (d > 20) {
        i = m;
      } else {
        i = 2;
      }
      break;
    case 4:
      if (d > 21) {
        i = m;
      } else {
        i = 3;
      }
      break;
    case 5:
      if (d > 21) {
        i = m;
      } else {
        i = 4;
      }
      break;
    case 6:
      if (d > 23) {
        i = m;
      } else {
        i = 5;
      }
      break;
    case 7:
      if (d > 23) {
        i = m;
      } else {
        i = 6;
      }
      break;
    case 8:
      if (d > 23) {
        i = m;
      } else {
        i = 7;
      }
      break;
    case 9:
      if (d > 23) {
        i = m;
      } else {
        i = 8;
      }
      break;
    case 10:
      if (d > 22) {
        i = m;
      } else {
        i = 9;
      }
      break;
    case 11:
      if (d > 22) {
        i = m;
      } else {
        i = 10;
      }
      break;
  }

  return first[i];
};

export { gs };
