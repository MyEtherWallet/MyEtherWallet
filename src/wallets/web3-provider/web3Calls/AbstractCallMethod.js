import { AbstractMethod } from 'web3-core-method';

export default class AbstractCallMethod extends AbstractMethod {
  constructor(rpcMethod, parametersAmount, utils, formatters) {
    super(rpcMethod, parametersAmount, utils, formatters);
  }
  static get Type() {
    return 'CALL';
  }
  async execute(moduleInstance) {
    this.beforeExecution(moduleInstance);

    if (this.parameters.length !== this.parametersAmount) {
      throw new Error(
        `Invalid Arguments length: expected: ${this.parametersAmount}, given: ${this.parameters.length}`
      );
    }

    try {
      let response = await moduleInstance.currentProvider.send(
        this.rpcMethod,
        this.parameters
      );

      if (response) {
        response = this.afterExecution(response);
      }

      if (this.callback) {
        this.callback(false, response);
      }

      return response;
    } catch (error) {
      if (this.callback) {
        this.callback(error, null);
      }

      throw error;
    }
  }
}
