const updateOrderStatus = async ({ commit, state }) => {
  const { order, email, udBaseUrl, resellerId } = state;
  const update = await fetch(
    `${udBaseUrl}/v1/resellers/${resellerId}/users/${email}/orders/${order.orderNumber}`
  ).then(res => {
    if (res.ok) {
      return res.json();
    }
  });
  commit('SET_ORDER', {
    value: update.order
  });
};
const fetchMyDomains = async ({ commit, state }, address) => {
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
  commit('SET_MY_DOMAIN', {
    value: domains
  });
};
const fetchIpfsHash = async ({ commit, state }) => {
  try {
    const ipfs = await state.resolution.getIpfsHash(
      state.manageRecordDomain.name
    );
    commit('SET_MANAGE_RECORD', {
      value: {
        ...state.manageRecordDomain,
        ipfsHash: ipfs
      }
    });
  } catch (err) {
    commit('SET_MANAGE_RECORD', {
      value: {
        ...state.manageRecordDomain
      }
    });
  }
};

const setDomain = ({ commit }, domain) => {
  commit('SET_CURRENT_DOMAIN', {
    value: domain
  });
};

export default {
  updateOrderStatus,
  fetchMyDomains,
  fetchIpfsHash,
  setDomain
};
