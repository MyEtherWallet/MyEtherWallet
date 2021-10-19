const blockAlert = {
  AVAILABLE: 'available',
  NOT_AVAILABLE: 'notavailable',
  OWNED: 'owned'
};

const blockAlertValidator = type => {
  console.log(
    'Valid',
    type === blockAlert.AVAILABLE ||
      type === blockAlert.NOT_AVAILABLE ||
      type === blockAlert.OWNED
  );
  return (
    type === blockAlert.AVAILABLE ||
    type === blockAlert.NOT_AVAILABLE ||
    type === blockAlert.OWNED
  );
};

export { blockAlert, blockAlertValidator };
