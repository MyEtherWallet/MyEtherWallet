import { Resolution } from '@unstoppabledomains/resolution';
import { cryptoKeyToKey } from './records';

export default class UResolution {
  library = new Resolution();

  namehash(domain) {
    return this.library.namehash(domain);
  }

  async getRecord(domain, record) {
    return await this.library.record(domain, record);
  }

  async getRecords(domain, records) {
    return await this.library.records(domain, records);
  }

  async getIpfsHash(domain) {
    return await this.library.ipfsHash(domain);
  }

  async getAllRecords(domain) {
    const allRecords = await this.library.allRecords(domain);
    const returnee = [];
    for (const [key, value] of Object.entries(allRecords)) {
      if (value) {
        returnee.push({ record: cryptoKeyToKey[key], value });
      }
    }
    return returnee;
  }

  async getResolver(domain) {
    return await this.library.resolver(domain);
  }
}
