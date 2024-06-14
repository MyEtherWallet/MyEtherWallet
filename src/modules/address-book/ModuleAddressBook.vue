<template>
  <div>
    <mew-address-select
      ref="addressSelect"
      :resolved-addr="addressOnly"
      :hint="nameOnly"
      :copy-tooltip="$t('common.copy')"
      :save-tooltip="$t('common.save')"
      :enable-save-address="enableSave"
      :show-save="enableSave"
      :label="addrLabel"
      :items="addressBookWithMyAddress"
      :placeholder="$t('sendTx.enter-addr')"
      :success-toast="$t('sendTx.success.title')"
      :is-valid-address="isValidAddress"
      :show-copy="isValidAddress"
      :error-messages="errorMessages"
      @saveAddress="toggleOverlay"
      @input="setAddress"
    />
    <!-- add and edit the address book -->
    <mew-overlay
      :footer="footer"
      :title="$t('interface.address-book.add-addr')"
      :show-overlay="addMode"
      :close="toggleOverlay"
      content-size="xlarge"
    >
      <address-book-add-edit
        :to-address="inputAddr"
        mode="add"
        @back="toggleOverlay"
      />
    </mew-overlay>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, watch, onMounted } from 'vue';
import { isObject, throttle } from 'lodash';
import WAValidator from 'multicoin-address-validator';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import { isAddress, toChecksumAddress } from '@/core/helpers/addressUtils';
import NameResolver from '@/modules/name-resolver/index';
import { ERROR, Toast } from '../toast/handler/handlerToast';

import { USER_INPUT_TYPES } from '@/core/configs/commons';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useI18n } from 'vue-i18n-composable';
import { useAddressBookStore } from '@/core/store/addressBook';

const AddressBookAddEdit = defineAsyncComponent(() =>
  import('./components/AddressBookAddEdit')
);

// emits
const emit = defineEmits(['setAddress']);

// injections/use
const { addressBookStore } = useAddressBookStore();
const { network, web3 } = useGlobalStore();
const { address, isOfflineApp, identifier, instance } = useWalletStore();
const { t } = useI18n();

// props
const props = defineProps({
  isValidAddressFunc: {
    type: Function,
    default: isAddress
  },
  isHomePage: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: 'ETH'
  },
  preselectCurrWalletAdr: {
    type: Boolean,
    default: false
  },
  enableSaveAddress: {
    type: Boolean,
    default: true
  }
});

// data
const addMode = ref(false);
const resolvedAddr = ref('');
const inputAddr = ref('');
const nameResolver = ref(null);
const isValidAddress = ref(false);
const loadedAddressValidation = ref(false);
const nametag = ref('');
const footer = ref({
  text: 'Need help?',
  linkTitle: 'Contact support',
  link: 'mailto:support@myetherwallet.com'
});
const addressSelect = ref(null);

// computed
const errorMessages = computed(() => {
  if (!isValidAddress.value && loadedAddressValidation.value) {
    return t('interface.address-book.validations.invalid-address');
  }
  if (!inputAddr.value && loadedAddressValidation.value) {
    return t('interface.address-book.validations.addr-required');
  }
  return '';
});
const addressBookWithMyAddress = computed(() => {
  return props.isHomePage
    ? [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'MEW Donations',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ]
    : myAddressBook.value;
});
const myAddressBook = computed(() => {
  if (!props.isHomePage && !identifier.value && instance.value)
    instance.value.errorHandler(
      new Error('Wallet has no identifier! Please refresh the page')
    );
  return address.value
    ? [
        {
          address: toChecksumAddress(address.value),
          nickname: 'My Address',
          resolverAddr: ''
        }
      ].concat(addressBookStore.value)
    : // If address is undefined set to MEW Donations
      [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'MEW Donations',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ].concat(addressBookStore.value);
});
const enableSave = computed(() => {
  return props.isHomePage
    ? false
    : isValidAddress.value && props.enableSaveAddress;
});
const addrLabel = computed(() => {
  return props.label === '' ? t('sendTx.to-addr') : props.label;
});
const addressOnly = computed(() => {
  return isAddress(resolvedAddr.value) && isValidAddress.value
    ? resolvedAddr.value
    : '';
});
const nameOnly = computed(() => {
  return !isAddress(resolvedAddr.value) && isValidAddress.value
    ? resolvedAddr.value || nametag.value
    : '';
});

// watch
watch(
  () => web3.value,
  () => {
    if (network.value.type.ens && web3.value.currentProvider) {
      nameResolver.value = new NameResolver(network.value, web3.value);
    } else {
      nameResolver.value = null;
    }
  }
);
watch(
  () => inputAddr,
  newVal => {
    nametag.value = '';
    if (isAddress(newVal.toLowerCase())) {
      resolveAddress();
    } else {
      resolveName();
    }
  }
);

onMounted(() => {
  if (isOfflineApp.value) {
    footer.value = {
      text: 'Need help? Email us at support@myetherwallet.com',
      linkTitle: '',
      link: ''
    };
  }
  if (network.value.type.ens && web3.value.currentProvider)
    nameResolver.value = new NameResolver(network.value, web3.value);
  if (props.isHomePage) {
    setDonationAddress();
  }
  if (props.preselectCurrWalletAdr) {
    addressSelect.value.selectAddress(addressBookWithMyAddress.value[0]);
    setAddress(toChecksumAddress(address), USER_INPUT_TYPES.selected);
  }
});

// methods
/**
 * Checks if address is valid
 * and sets the address value
 */
const setAddress = async (value, inputType) => {
  if (typeof value === 'string') {
    if (
      props.currency.toLowerCase() ===
      network.value.type.currencyName?.toLowerCase()
    ) {
      /**
       * Checks if user typed or selected an address from dropdown
       */
      const typeVal =
        inputType === USER_INPUT_TYPES.typed
          ? value
          : addressBookWithMyAddress.value.find(item => {
              return value.toLowerCase() === item.address.toLowerCase();
            });
      inputAddr.value = value;
      resolvedAddr.value = '';
      /**
       * Checks if the address is valid
       */
      try {
        const isAddValid = props.isValidAddressFunc(inputAddr);
        if (isAddValid instanceof Promise) {
          const validation = await isAddValid;
          isValidAddress.value = validation;
        } else {
          isValidAddress.value = isAddValid;
        }
      } catch (e) {
        isValidAddress.value = false;
      }
      loadedAddressValidation.value = !isValidAddress.value ? false : true;
      /**
       * @emits setAddress
       */
      emit('setAddress', value, isValidAddress, {
        type: inputType,
        value: isObject(typeVal) ? typeVal.nickname : typeVal
      });
      /**
       * Resolve address with ENS/Unstoppable/Kleros
       */
      if (isValidAddress.value && !isOfflineApp.value) await resolveAddress();

      if (!isValidAddress.value) {
        await resolveName();
      }
    } else {
      const currencyExists = WAValidator.findCurrency(
        props.currency.toLowerCase()
      );
      if (currencyExists) {
        const validate = WAValidator.validate(
          value,
          props.currency.toLowerCase()
        );
        if (validate) {
          inputAddr.value = value;
          isValidAddress.value = true;
        } else {
          isValidAddress.value = false;
        }
        loadedAddressValidation.value = true;
        /**
         * @emits setAddress
         */
        emit('setAddress', value, isValidAddress.value, {
          type: inputType,
          value: value
        });
      } else {
        isValidAddress.value = false;
        loadedAddressValidation.value = true;
        emit('setAddress', value, isValidAddress.value, {
          type: inputType,
          value: value
        });
      }
    }
  }
};
// is used from the parent context
// eslint-disable-next-line
const clear = () => {
  addMode.value = false;
  resolvedAddr.value = '';
  inputAddr.value = '';
  nameResolver.value = null;
  isValidAddress.value = false;
  loadedAddressValidation.value = false;
  addressSelect.value.clear();
  emit('setAddress', resolvedAddr.value, isValidAddress.value, {
    type: USER_INPUT_TYPES.typed,
    value: inputAddr.value
  });

  // Calls setups from mounted
  if (!isOfflineApp.value && network.value.type.ens)
    nameResolver.value = new NameResolver(network.value, web3.value);
  if (props.isHomePage) {
    setDonationAddress();
  }
};
/**
 * Sets selected address to be MEW donation address
 * only happens on home page
 */
const setDonationAddress = () => {
  addressSelect.value.selectAddress(addressBookWithMyAddress.value[0]);
};
const toggleOverlay = () => {
  addMode.value = !addMode.value;
};
/**
 * Resolves address and @returns name
 */
const resolveAddress = throttle(async function () {
  if (nameResolver.value) {
    try {
      const reverseName = await nameResolver.value.resolveAddress(inputAddr);
      if (reverseName && !reverseName.name) {
        try {
          await getAddressInfo(
            toChecksumAddress(inputAddr),
            'https://ipfs.kleros.io'
          ).then(data => {
            nametag.value = data?.publicNameTag || '';
          });
        } catch (e) {
          name.valuetag = '';
        }
      }
      resolvedAddr.value = reverseName?.name ? reverseName.name : '';
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }
}, 300);
/**
 * Resolves name and @returns address
 */
const resolveName = throttle(async function () {
  if (nameResolver.value) {
    try {
      await nameResolver.value.resolveName(inputAddr).then(addr => {
        resolvedAddr.value = addr;
        isValidAddress.value = true;
        loadedAddressValidation.value = true;
        emit('setAddress', resolvedAddr.value, isValidAddress.value, {
          type: USER_INPUT_TYPES.resolved,
          value: inputAddr.value
        });
      });
    } catch (e) {
      loadedAddressValidation.value = true;
    }
  }
}, 500);
</script>
