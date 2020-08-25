<template>
  <mew6-white-sheet>
    <InterfaceWrap title="Interact with contract">
      <div class="d-flex">
        <mew-input
          label="Contract Address"
          placeholder=" "
          class="mr-3 flex-grow-1"
        />
        <mew-select :items="contractType" label="Contract Type" />
      </div>
      <v-textarea
        no-resize
        outlined
        name="input-7-4"
        label="ABI/JSON Interface"
        value="constant-:true-inputs-:-name-:-name-outputs-:-name-:-type-:-string-payable-:false-type-:-function-constant-:true-inputs-:-name-:-bid-value-type-:-uint256-name-:-get-buy-price-outputs-:-name-:-token-count-type-:-uint256-name-:-purchase-value-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-spender-type-:-address-name-:-value-type-:-uint256-name-:-approve-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-withdrawn-balance-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-value-type-:-uint256-name-:-withdraw-funds-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-withdraw-address-outputs-:-name-:-type-:-address-payable-:false-type-:-function-constant-:true-inputs-:-name-:-total-supply-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-from-type-:-address-name-:-to-type-:-address-name-:-value-type-:-uint256-name-:-transfer-from-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-decimals-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-trade-spread-invert-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-crowdsale-end-declaration-time-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-owner2-outputs-:-name-:-type-:-address-payable-:false-type-:-function-constant-:true-inputs-:-name-:-funding-unlock-fraction-invert-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-halt-crowdsale-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-owner-type-:-address-name-:-balance-of-outputs-:-name-:-balance-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-owner1-outputs-:-name-:-type-:-address-payable-:false-type-:-function-constant-:false-inputs-:-name-:-confirm-crowdsale-end-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-symbol-outputs-:-name-:-type-:-string-payable-:false-type-:-function-constant-:false-inputs-:-name-:-max-price-type-:-uint256-name-:-buy-limit-outputs-:-payable-:true-type-:-function-constant-:true-inputs-:-name-:-funding-unlock-period-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-buy-outputs-:-payable-:true-type-:-function-constant-:false-inputs-:-name-:-to-type-:-address-name-:-value-type-:-uint256-name-:-transfer-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-unlocked-balance-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-token-price-min-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-unlock-funds-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-ask-size-tokens-type-:-uint256-name-:-get-sell-price-outputs-:-name-:-sale-value-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-declare-crowdsale-end-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-token-creation-min-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-funding-unlock-time-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-is-halted-outputs-:-name-:-type-:-bool-payable-:false-type-:-function-constant-:false-inputs-:-name-:-token-count-type-:-uint256-name-:-min-price-type-:-uint256-name-:-sell-limit-outputs-:-payable-:false-type-:-function-constant-:true-inputs-:-name-:-crowdsale-start-block-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-min-funding-reached-outputs-:-name-:-type-:-bool-payable-:false-type-:-function-constant-:true-inputs-:-name-:-owner-type-:-address-name-:-spender-type-:-address-name-:-allowance-outputs-:-name-:-remaining-type-:-uint256-payable-:false-type-:-function-constant-:true-inputs-:-name-:-crowdsale-end-lock-time-outputs-:-name-:-type-:-uint256-payable-:false-type-:-function-constant-:false-inputs-:-name-:-token-count-type-:-uint256-name-:-sell-outputs-:-payable-:false-type-:-function-inputs-:-name-:-owner1-type-:-address-name-:-owner2-type-:-address-name-:-withdraw-address-type-:-address-name-:-crowdsale-start-block-type-:-uint256-payable-:false-type-:-constructor-payable-:true-type-:-fallback-anonymous-:false-inputs-:-indexed-:true-name-:-who-type-:-address-indexed-:false-name-:-tokens-type-:-uint256-indexed-:false-name-:-purchase-value-type-:-uint256-indexed-:false-name-:-supply-after-type-:-uint256-name-:-log-buy-type-:-event-anonymous-:false-inputs-:-indexed-:true-name-:-who-type-:-address-indexed-:false-name-:-tokens-type-:-uint256-indexed-:false-name-:-sale-value-type-:-uint256-indexed-:false-name-:-supply-after-type-:-uint256-name-:-log-sell-type-:-event-anonymous-:false-inputs-:-indexed-:false-name-:-amount-type-:-uint256-name-:-log-withdraw-type-:-event-anonymous-:false-inputs-:-indexed-:false-name-:-completed-type-:-bool-name-:-log-crowdsale-end-type-:-event-anonymous-:false-inputs-:-indexed-:true-name-:-owner-type-:-address-indexed-:true-name-:-spender-type-:-address-indexed-:false-name-:-value-type-:-uint256-name-:-approval-type-:-event-anonymous-:false-inputs-:-indexed-:true-name-:-from-type-:-address-indexed-:true-name-:-to-type-:-address-indexed-:false-name-:-value-type-:-uint256-name-:-transfer-type-:-event"
      ></v-textarea>

      <div class="text-center mt-3">
        <mew-button
          title="Interact"
          :has-full-width="false"
          button-size="xlarge"
        />
      </div>
      <div class="text-center mt-2">
        <mew-button
          title="Clear all"
          :has-full-width="false"
          button-size="xlarge"
          btn-style="transparent"
        />
      </div>
    </InterfaceWrap>
  </mew6-white-sheet>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';

export default {
  components: { InterfaceWrap },
  data() {
    return {
      contractType: [
        {
          name: 'Contract 1',
          subtext: 'Eth',
          value: '1'
        }
      ]
    };
  }
};
</script>
