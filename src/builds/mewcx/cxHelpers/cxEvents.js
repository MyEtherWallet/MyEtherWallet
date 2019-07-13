const events = {
  WEB3_DETECTED: 'web3{{id}}web3Detected',
  INJECT_WEB3: 'injectWeb3',
  SELECTED_MEW_CX_ACC: 'selectedMewCXAccount',
  MEW_TX_HASH: 'mewTxHash',
  MEW_SIGNED_MSG: 'mewSignedMsg',
  REJECT_MEW_CX_ACC: 'rejectMewCXAccount',
  REJECT_MEW_TX_SIGN: 'rejectMewTxSign',
  REJECT_MEW_SIGN_MSG: 'rejectMewSignMsg',
  WEB3_GET_CURRENT_ACC: 'web3{{id}}getCurrentAccount',
  WEB3_GET_ACC: 'web3{{id}}getAccount',
  WEB3_SEND_TX: 'web3{{id}}sendTx',
  WEB3_SEND_SIGN_MSG: 'web3{{id}}sendSignMsg',
  WEB3_RECEIVE_ACC: 'web3{{id}}receiveAccount',
  WEB3_RECEIVE_TX_HASH: 'web3{{id}}recieveTxHash',
  WEB3_RECEIVE_SIGNED_MSG: 'web3{{id}}recieveSignedMsg',
  WEB3_REJECT: 'web3{{id}}reject',
  CX_FETCH_MEW_ACCS: 'fetchMewCXAccounts',
  CX_WEB3_DETECTED: 'web3Detected',
  CX_CONFIRM_SEND_TX: 'confirmAndSendTx',
  CX_SIGN_MSG: 'signMsg',
  CX_INJECT_WEB3: 'injectWeb3'
};

export default events;
