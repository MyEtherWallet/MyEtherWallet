export default msg => {
  return (
    msg === 'MetaMask Tx Signature: User denied transaction signature.' ||
    msg === 'User Rejected Request: The user rejected the request.'
  );
};
