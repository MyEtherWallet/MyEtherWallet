import ModuleNftManager from '@/modules/nft-manager/ModuleNftManager';

const { estimateRecipient, setAddress } = ModuleNftManager.methods;
const { isValid } = ModuleNftManager.computed;

const RECIPIENT = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const ATTACKER = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const NFT = {
  contract: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
  token_id: '7'
};

/** A promise whose settlement the test controls. */
const deferred = () => {
  let release;
  let fail;
  const promise = new Promise((resolve, reject) => {
    release = resolve;
    fail = reject;
  });
  return { promise, release, fail };
};

const makeContext = (getGasFees, overrides = {}) => {
  const ctx = {
    toAddress: '',
    lastEnteredAddress: '',
    confirmedRecipient: '',
    estimatingRecipient: false,
    estimateGeneration: 0,
    enoughFunds: false,
    showBalanceError: false,
    gasFees: '0',
    localGasPrice: '0',
    balanceInWei: '1000000000000000000', // 1 ETH
    gasPriceType: 'regular',
    selectedNft: NFT,
    nft: {
      isValidAddress: h => h !== '' && /^0x[0-9a-fA-F]{40}$/.test(h),
      getGasFees
    },
    gasPriceByType: () => '1000000000', // 1 gwei
    estimateRecipient,
    setAddress,
    ...overrides
  };
  return ctx;
};

const valid = ctx => isValid.call(ctx);

describe('NFT recipient snapshot', () => {
  it('promotes a recipient to the snapshot only after a successful estimate', async () => {
    const ctx = makeContext(() => Promise.resolve('60000'));
    ctx.toAddress = RECIPIENT;

    await ctx.estimateRecipient(RECIPIENT);

    expect(ctx.confirmedRecipient).toBe(RECIPIENT);
    expect(ctx.enoughFunds).toBe(true);
    expect(ctx.estimatingRecipient).toBe(false);
    expect(valid(ctx)).toBe(true);
  });

  it('disables Send while the estimate is in flight', async () => {
    const pendingEstimate = deferred();
    const ctx = makeContext(() => pendingEstimate.promise);
    ctx.toAddress = RECIPIENT;

    const running = ctx.estimateRecipient(RECIPIENT);

    expect(ctx.estimatingRecipient).toBe(true);
    expect(ctx.confirmedRecipient).toBe('');
    expect(valid(ctx)).toBe(false);

    pendingEstimate.release('60000');
    await running;

    expect(valid(ctx)).toBe(true);
  });

  it('clears the snapshot as soon as the recipient changes', async () => {
    const ctx = makeContext(() => Promise.resolve('60000'));
    ctx.toAddress = RECIPIENT;
    await ctx.estimateRecipient(RECIPIENT);
    expect(valid(ctx)).toBe(true);

    // The user edits the recipient; the watcher re-runs estimation.
    ctx.toAddress = ATTACKER;
    const running = ctx.estimateRecipient(ATTACKER);
    expect(ctx.confirmedRecipient).toBe('');
    expect(valid(ctx)).toBe(false);
    await running;
  });

  it('ignores a stale estimate for a superseded recipient', async () => {
    const stalled = deferred();
    let call = 0;
    const ctx = makeContext(() =>
      call++ === 0 ? stalled.promise : Promise.resolve('60000')
    );

    ctx.toAddress = ATTACKER;
    const stale = ctx.estimateRecipient(ATTACKER);

    // Recipient corrected before the first estimate returns.
    ctx.toAddress = RECIPIENT;
    await ctx.estimateRecipient(RECIPIENT);

    stalled.release('60000');
    await stale;

    // The stale estimate must not have re-pointed the snapshot.
    expect(ctx.confirmedRecipient).toBe(RECIPIENT);
    expect(valid(ctx)).toBe(true);
  });

  it('does not settle a recipient whose estimate failed', async () => {
    const ctx = makeContext(() =>
      Promise.reject(new Error('execution reverted'))
    );
    ctx.toAddress = ATTACKER;

    await ctx.estimateRecipient(ATTACKER);

    expect(ctx.confirmedRecipient).toBe('');
    expect(ctx.enoughFunds).toBe(false);
    expect(ctx.estimatingRecipient).toBe(false);
    expect(valid(ctx)).toBe(false);
  });

  it('does not settle a recipient the wallet cannot afford', async () => {
    const ctx = makeContext(() => Promise.resolve('60000'), {
      balanceInWei: '1' // 1 wei
    });
    ctx.toAddress = RECIPIENT;

    await ctx.estimateRecipient(RECIPIENT);

    expect(ctx.confirmedRecipient).toBe('');
    expect(ctx.showBalanceError).toBe(true);
    expect(valid(ctx)).toBe(false);
  });

  it('rejects a snapshot that no longer matches the live input', async () => {
    const ctx = makeContext(() => Promise.resolve('60000'));
    ctx.toAddress = RECIPIENT;
    await ctx.estimateRecipient(RECIPIENT);

    // Belt and braces: even if the snapshot survived, isValid requires it to
    // still equal what the input holds.
    ctx.toAddress = ATTACKER;
    expect(valid(ctx)).toBe(false);
  });

  it('skips estimation when no NFT is selected', async () => {
    const getGasFees = jest.fn();
    const ctx = makeContext(getGasFees, { selectedNft: {} });

    await ctx.estimateRecipient(RECIPIENT);

    expect(getGasFees).not.toHaveBeenCalled();
    expect(ctx.confirmedRecipient).toBe('');
    expect(valid(ctx)).toBe(false);
  });

  it('drops a resolution that describes a superseded input', () => {
    const ctx = makeContext(() => Promise.resolve('60000'));

    // User types a name, then corrects to a literal address.
    ctx.setAddress('attacker.eth', false, {
      type: 'TYPED',
      value: 'attacker.eth'
    });
    ctx.setAddress(RECIPIENT, true, { type: 'TYPED', value: RECIPIENT });
    expect(ctx.toAddress).toBe(RECIPIENT);

    // The stale resolution for the abandoned name arrives.
    ctx.setAddress(ATTACKER, true, { type: 'RESOLVED', value: 'attacker.eth' });

    expect(ctx.toAddress).toBe(RECIPIENT);
  });

  it('accepts a resolution that still describes the current input', () => {
    const ctx = makeContext(() => Promise.resolve('60000'));

    ctx.setAddress('vitalik.eth', false, {
      type: 'TYPED',
      value: 'vitalik.eth'
    });
    ctx.setAddress(RECIPIENT, true, { type: 'RESOLVED', value: 'vitalik.eth' });

    expect(ctx.toAddress).toBe(RECIPIENT);
  });
});
