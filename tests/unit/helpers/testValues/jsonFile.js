const content = {
  'version': 3,
  'id': '82b3808e-92cd-45f9-8a1d-e60b129d9cbb',
  'address': '09386c7cd7fc28479d81a0551d149ea20ca56460',
  'crypto': {
    'ciphertext': '07550b2704c50033c37f3cf614a849c2f7486b88438d839b2ceaf3ddc8166f22',
    'cipherparams': { 'iv': '90561e0e22c138a0f70251ce3d1c04fa' },
    'cipher': 'aes-128-ctr',
    'kdf': 'scrypt',
    'kdfparams': {
      'dklen': 32,
      'salt': 'ae157b7f6233e9b84f8663732187083f24a360f69096816badccf05a3783e785',
      'n': 131072,
      'r': 8,
      'p': 1
    },
    'mac': '1853b643514e6d11fd2968dd4996caf1d82b386cfdb1b0a6d296ce5810096a95'
  }
};

const contentAsString = '{"version":3,"id":"82b3808e-92cd-45f9-8a1d-e60b129d9cbb","address":"09386c7cd7fc28479d81a0551d149ea20ca56460","crypto":{"ciphertext":"07550b2704c50033c37f3cf614a849c2f7486b88438d839b2ceaf3ddc8166f22","cipherparams":{"iv":"90561e0e22c138a0f70251ce3d1c04fa"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"ae157b7f6233e9b84f8663732187083f24a360f69096816badccf05a3783e785","n":131072,"r":8,"p":1},"mac":"1853b643514e6d11fd2968dd4996caf1d82b386cfdb1b0a6d296ce5810096a95"}}';

const address = '0x09386C7Cd7FC28479d81a0551D149eA20CA56460';
const privateKey = 'fc3c01054fe0a3ece1cc7678e2e825dc67a3f4e561d4429ea606871cabd1b2d3';
const password = '123456789';

const rawTransactionDetails = {"nonce":"0x00","gasPrice":"0xb2d05e00","gasLimit":"0x5208","to":"0x09386C7Cd7FC28479d81a0551D149eA20CA56460","value":"0x0de0b6b3a7640000","data":"0x","chainId":1};
const transaction = '0xf86b8084b2d05e008252089409386c7cd7fc28479d81a0551d149ea20ca56460880de0b6b3a76400008025a0f99f353b834839adcf82a4263366790109a0910b13ffa1b09254556787eaf099a0116ebde2d2e0fca9d786660e90edc912bc64cda4541bb2d598628cdcf0add0a8';

export default {
  content,
  contentAsString,
  address,
  privateKey,
  password,
  rawTransactionDetails,
  transaction
};
