import { tldSupported, getTld } from './helpers/helperTld';
import PermanentNameModule from './handlerPermanentName';

export default class ENSManager {
  constructor(network, address, web3, ens) {
    this.network = network;
    this.address = address;
    this.web3 = web3;
    if (!network.type.ens) {
      throw new Error('Network does not support ENS!');
    }
    this.ens = ens;
  }

  searchName(name) {
    if (tldSupported(this.network, name)) {
      return new PermanentNameModule(
        name,
        this.address,
        this.network,
        this.web3,
        this.ens
      );
    }
    throw new Error(
      `TLD: ${getTld(name, this.network)} is not supported in this network!`
    );
  }
  fetchAllNames() {
    const query = `
                  query getRegistrations($id: ID!, $first: Int, $skip: Int, $orderBy: Registration_orderBy, $orderDirection: OrderDirection, $expiryDate: Int) {
                    account(id: $id) {
                        registrations(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: {expiryDate_gt: $expiryDate}) {
                          expiryDate
                          domain {
                            labelName
                            labelhash
                            name
                            isMigrated
                            parent {
                              name
                            }
                          }
                        }
                      }
                  }
                `;
    const variables = {
      id: this.address.toLowerCase(),
      first: 1000,
      expiryDate: Math.floor(new Date().getTime() / 1000) - 86400 * 90 // grace period
    };
    return fetch(this.network.type.ens.subgraphPath, {
      method: 'POST',
      'Content-Type': 'application/json',
      body: JSON.stringify({ query, variables })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.data.account) return [];
        return data.data.account.registrations.map(r => {
          r.domain.expiryDate = r.expiryDate;
          return r.domain;
        });
      });
  }
  getAllNamesForAddress() {
    return this.fetchAllNames().then(names => {
      return names.map(item => {
        return new PermanentNameModule(
          item.name,
          this.address,
          this.network,
          this.web3,
          this.ens,
          item.expiryDate
        );
      });
    });
  }
}
