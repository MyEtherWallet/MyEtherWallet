// const setDarkList = async function ({ commit }) {
//   const darkList = await fetch(
//     'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
//   )
//     .then(res => res.json())
//     .catch(e => {
//       Toast(e.message, {}, ERROR);
//     });
//   commit('SET_DARK_LIST', {
//     data: darkList,
//     timestamp: Date.now()
//   });
// };

export default {};
