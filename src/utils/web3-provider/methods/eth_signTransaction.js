export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_signTransaction') return next();
  res(new Error('wallet doesnt support eth_signTransaction'));
};
