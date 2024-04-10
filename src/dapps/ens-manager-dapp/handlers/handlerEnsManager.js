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
    query getNamesForAddress($orderBy: Domain_orderBy, $orderDirection: OrderDirection, $first: Int, $whereFilter: Domain_filter) {
      domains(
        orderBy: $orderBy
        orderDirection: $orderDirection
        first: $first
        where: $whereFilter
      ) {
        ...DomainDetails
        registration {
          ...RegistrationDetails
        }
      }
    }

    fragment DomainDetails on Domain {
      ...DomainDetailsWithoutParent
      parent {
        name
        id
      }
    }

    fragment DomainDetailsWithoutParent on Domain {
      labelName
      labelhash
      name
      isMigrated
    }

    fragment RegistrationDetails on Registration {
      registrationDate
      expiryDate
    }
`;

    const variables = {
      orderBy: 'expiryDate',
      orderDirection: 'asc',
      first: 20,
      whereFilter: {
        and: [
          {
            or: [
              {
                owner: this.address.toLowerCase()
              },
              {
                registrant: this.address.toLowerCase()
              },
              {
                wrappedOwner: this.address.toLowerCase()
              }
            ]
          },
          {
            parent_not:
              '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2'
          },
          {
            or: [
              {
                expiryDate_gt: `${
                  Math.floor(new Date().getTime() / 1000) - 86400 * 90
                }` // grace period
              },
              {
                expiryDate: null
              }
            ]
          },
          {
            or: [
              {
                owner_not: '0x0000000000000000000000000000000000000000'
              },
              {
                resolver_not: null
              },
              {
                and: [
                  {
                    registrant_not: '0x0000000000000000000000000000000000000000'
                  },
                  {
                    registrant_not: null
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    return fetch(this.network.type.ens.subgraphPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
        operationName: 'getRegistrations',
        extensions: {}
      })
    })
      .then(response => response.json())
      .then(({ data, error }) => {
        if (error) return [];
        if (!data.domains) return [];
        return data.domains.map(name => {
          name.expiryDate = name.registration.expiryDate;
          return name;
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
