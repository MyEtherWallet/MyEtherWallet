import UResolution from '../handlers/resolution';

const EMPTY_DOMAIN = {
  name: '',
  available: false,
  price: 0
};

const resolution = new UResolution();

const unstoppable = {
  namespaced: true,
  state: {
    currentDomain: EMPTY_DOMAIN,
    email: 'mew@unstoppabledomains.com',
    udBaseUrl: 'https://unstoppabledomains.com/api',
    resellerId: 'myetherwallet',
    myDomains: [],
    order: {},
    resolution,
    manageRecordDomain: { name: '' },
    activeOverlay: ''
  },
  mutations: {
    clearDomain: state => (state.currentDomain = EMPTY_DOMAIN),
    setCurrentDomain: (state, payload) => (state.currentDomain = payload.value),
    setMyDomains: (state, payload) => (state.myDomains = payload.value),
    setManageRecordDomain: (state, payload) =>
      (state.manageRecordDomain = payload.value),
    setActiveOverlay: (state, payload) => (state.activeOverlay = payload.value),
    setOrder: (state, payload) => (state.order = payload.value)
  },
  actions: {
    updateOrderStatus: async ({ commit, state }) => {
      const { order, email, udBaseUrl, resellerId } = state;
      const update = await fetch(
        `${udBaseUrl}/v1/resellers/${resellerId}/users/${email}/orders/${order.orderNumber}`
      ).then(res => {
        if (res.ok) {
          return res.json();
        }
      });
      commit('setOrder', {
        value: update.order
      });
    },
    fetchMyDomains: async ({ commit, state }, address) => {
      const domains = await fetch(`${state.udBaseUrl}/zns-domains/${address}`)
        .then(res => res.json())
        .then(res => res.domains.filter(d => d.extension === 'crypto'))
        .then(res =>
          Promise.all(
            res.map(async d => ({
              name: `${d.label}.${d.extension}`,
              subtext: 'Manage',
              colorTheme: 'superPrimary',
              namehash: state.resolution.namehash(`${d.label}.${d.extension}`),
              resolver: await state.resolution.getResolver(
                `${d.label}.${d.extension}`
              )
            }))
          )
        );
      commit('setMyDomains', {
        value: domains
      });
    },
    fetchIpfsHash: async ({ commit, state }) => {
      try {
        const ipfs = await state.resolution.getIpfsHash(
          state.manageRecordDomain.name
        );
        commit('setManageRecordDomain', {
          value: {
            ...state.manageRecordDomain,
            ipfsHash: ipfs
          }
        });
      } catch (err) {
        commit('setManageRecordDomain', {
          value: {
            ...state.manageRecordDomain
          }
        });
      }
    }
  },
  getters: {
    getDomain: state => state.currentDomain,
    getDomainName: state => state.currentDomain.name,
    getDomainPrice: state => state.currentDomain.price,
    getEmail: state => state.email,
    getOrder: state => state.order,
    getBaseUrl: state => state.udBaseUrl,
    getResellerId: state => state.resellerId,
    getMyDomains: state => state.myDomains,
    getManagedDomain: state => state.manageRecordDomain,
    getResolution: state => state.resolution,
    getActiveOverlay: state => state.activeOverlay
  },
  strict: false
};

export default unstoppable;
