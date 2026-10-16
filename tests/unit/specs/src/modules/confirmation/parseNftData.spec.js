import Web3 from 'web3';

import parseNftData from '@/modules/confirmation/handlers/parseNftData';

const web3 = new Web3();
const FROM = '0x1111111111111111111111111111111111111111';
const TO = '0x2222222222222222222222222222222222222222';

const encode = (signature, types, values) =>
  web3.eth.abi.encodeFunctionSignature(signature) +
  web3.eth.abi.encodeParameters(types, values).substr(2);

describe('parseNftData', () => {
  it('decodes an ERC-721 safeTransferFrom', () => {
    const data = encode(
      'safeTransferFrom(address,address,uint256)',
      ['address', 'address', 'uint256'],
      [FROM, TO, '4242']
    );
    expect(parseNftData(data)).toEqual({
      standard: 'ERC-721',
      from: FROM,
      to: TO,
      tokenId: '4242',
      amount: null
    });
  });

  it('decodes an ERC-721 safeTransferFrom with a data payload', () => {
    const data = encode(
      'safeTransferFrom(address,address,uint256,bytes)',
      ['address', 'address', 'uint256', 'bytes'],
      [FROM, TO, '7', '0xabcd']
    );
    expect(parseNftData(data)).toMatchObject({
      standard: 'ERC-721',
      to: TO,
      tokenId: '7'
    });
  });

  it('decodes an ERC-721 transferFrom', () => {
    const data = encode(
      'transferFrom(address,address,uint256)',
      ['address', 'address', 'uint256'],
      [FROM, TO, '1']
    );
    expect(parseNftData(data)).toMatchObject({ to: TO, tokenId: '1' });
  });

  it('decodes an ERC-1155 safeTransferFrom including the amount', () => {
    const data = encode(
      'safeTransferFrom(address,address,uint256,uint256,bytes)',
      ['address', 'address', 'uint256', 'uint256', 'bytes'],
      [FROM, TO, '99', '3', '0x']
    );
    expect(parseNftData(data)).toEqual({
      standard: 'ERC-1155',
      from: FROM,
      to: TO,
      tokenId: '99',
      amount: '3'
    });
  });

  it('returns null for an ERC-20 transfer', () => {
    const data = encode(
      'transfer(address,uint256)',
      ['address', 'uint256'],
      [TO, '1000']
    );
    expect(parseNftData(data)).toBeNull();
  });

  it.each([
    ['empty calldata', '0x'],
    ['a truncated selector', '0x4284'],
    ['a non-string', undefined],
    ['an unknown selector', '0xdeadbeef' + '00'.repeat(96)]
  ])('returns null for %s', (_label, data) => {
    expect(parseNftData(data)).toBeNull();
  });

  it('returns null rather than a half-decoded recipient on short calldata', () => {
    // Correct selector, but the parameters are truncated.
    expect(parseNftData('0x42842e0e' + '00'.repeat(20))).toBeNull();
  });
});
