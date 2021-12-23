const BLOCK_ALERT = {
  AVAILABLE: 'available',
  NOT_AVAILABLE: 'notavailable',
  OWNED: 'owned',
  RESERVED: 'reserved'
};

const blockAlertValidator = type => {
  return (
    type === BLOCK_ALERT.AVAILABLE ||
    type === BLOCK_ALERT.NOT_AVAILABLE ||
    type === BLOCK_ALERT.OWNED ||
    type === BLOCK_ALERT.RESERVED
  );
};

export { BLOCK_ALERT, blockAlertValidator };
