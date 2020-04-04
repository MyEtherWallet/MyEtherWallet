import {ERC20} from '@/partners';
import {WETH_ABI} from './config'

export default class DexAgHelper{
  constructor (web3) {
    this.web3 = web3;
  }

  getWethContract(trade, signer) {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    return new ethers.Contract(wethTokenAddress, wethAbi, signer);
  }
  async getEtherToWrap(trade, provider, signer) {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const methodObject = new this.web3.eth.Contract(
      WETH_ABI,
      wethTokenAddress
    ).methods;//.approve(spender, fromValueWei);

    if (!trade.metadata.input) {
      return 0;
    }
    if (trade.metadata.input.address != wethTokenAddress) {
      return 0;
    }
    const wethAmount = trade.metadata.input.amount;
    const wethContract = new ethers.Contract(wethTokenAddress, erc20Abi, signer);
    const accountAddress = await signer.getAddress();
    const wethBalance = await wethContract.balanceOf(accountAddress);
    const balance = await signer.getBalance();
    if (wethBalance.gte(wethAmount)) {
      // Enough weth, no need to wrap
      return 0;
    }
    const totalBalance = balance.add(wethBalance);
    if (totalBalance.lt(wethAmount)) {
      // Insufficient balance
      return -1;
    }
    // eth to wrap = weth required for trade - weth balance
    const ethToWrap = wethBalance.sub(wethAmount).mul(-1);
    return ethToWrap.toString();
  }
}
