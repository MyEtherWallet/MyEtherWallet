<template>
  <div class="full-width">
    <!--
  =====================================================================================
    Address Book - add address mode
  =====================================================================================
  -->
    <mew-input
      v-if="addMode"
      :show-blockie="true"
      :label="$t('interface.address-book.address')"
      :placeholder="$t('interface.address-book.enter-addr')"
      :value="addressToAdd"
      :rules="addressRules"
      :persistent-hint="validAddress"
      :hint="resolvedName || nametag || coin"
      :resolved-addr="resolvedAddress"
      autofocus
      @input="setAddress"
    />
    <!--
  =====================================================================================
    Address Book - edit mode
  =====================================================================================
  -->
    <div v-if="editMode" class="full-width d-flex align-center mb-7">
      <mew-blockie
        class="mr-3"
        :address="item.resolvedAddr ? item.resolvedAddr : item.address"
        height="45px"
        width="45px"
      />
      <div class="truncate">
        <h5 class="font-weight-bold">
          {{ $t('interface.address-book.address') }}
        </h5>
        <div class="d-flex align-center">
          <span id="item-addr" class="monospace mr-3 truncate">
            {{ checksumAddressToAdd }}
          </span>
          <mew-copy :copy-value="item.address" :tooltip="$t('common.copy')" />
        </div>
      </div>
    </div>
    <!--
  =====================================================================================
    Address Book - add/edit nickname
  =====================================================================================
  -->
    <mew-input
      class="mt-2"
      :label="$t('interface.address-book.nickname')"
      :placeholder="
        nickname ? nickname : $t('interface.address-book.enter-nickname')
      "
      :value="nickname"
      :rules="nicknameRules"
      @input="setNickname"
    />
    <!--
  =====================================================================================
    Address Book - save
  =====================================================================================
  -->
    <div class="text-center mt-4">
      <mew-button
        :disabled="disabled"
        :title="
          editMode
            ? $t('interface.address-book.update')
            : $t('common.confirm-add')
        "
        btn-size="xlarge"
        @click.native="editMode ? update() : add()"
      />
    </div>
    <!--
  =====================================================================================
    Address Book - remove address
  =====================================================================================
  -->
    <div v-if="editMode" class="mt-4 text-center">
      <mew-button
        :title="$t('interface.address-book.remove-addr')"
        :has-full-width="false"
        btn-size="small"
        btn-style="transparent"
        @click.native="remove"
      />
    </div>
  </div>
</template>

<script>
const modes = ['add', 'edit'];
</script>
<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { isEmpty, throttle } from 'lodash';
import { getAddressInfo } from '@kleros/address-tags-sdk';

import NameResolver from '@/modules/name-resolver/index';
import { toChecksumAddress, isAddress } from '@/core/helpers/addressUtils';
import { isValidCoinAddress } from '../handlers/handlerMulticoins.js';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useAddressBookStore } from '@/core/store/addressBook/index.js';

import { useI18n } from 'vue-i18n-composable';
import { storeToRefs } from 'pinia';

// emits
const emit = defineEmits(['back']);

// injections/use
const { network } = useGlobalStore();
const { addressBookStore, setAddressBook } = useAddressBookStore();
const { t } = useI18n();
const { web3 } = storeToRefs(useWalletStore);

// props
const props = defineProps({
  mode: { default: modes[0], type: String },
  item: { default: () => {}, type: Object },
  toAddress: { default: '', type: String }
});

// data
const resolvedAddr = ref('');
const nameResolver = ref(null);
const currentIdx = ref(null);
const nickname = ref('');
const addressToAdd = ref('');
const nametag = ref('');

// computed
const disabled = computed(() => {
  if (addMode.value) {
    return (
      !addressToAdd.value ||
      !validAddress.value ||
      isEmpty(nickname.value) ||
      nickname.value?.length > 20 ||
      alreadyExists.value
    );
  }
  if (editMode.value) {
    return (
      nickname.value === props.item.value.nickname ||
      nickname.value?.length > 20 ||
      isEmpty(nickname.value)
    );
  }
  return true;
});
const addressRules = computed(() => {
  return [
    () =>
      !alreadyExists.value ||
      t('interface.address-book.validations.already-exists'),
    validAddress.value ||
      t('interface.address-book.validations.invalid-address'),
    value => !!value || t('interface.address-book.validations.addr-required')
  ];
});
const nicknameRules = computed(() => {
  return [
    value =>
      (value && value.length >= 1) ||
      t('interface.address-book.validations.nickname-required'),
    value =>
      (value && value.length <= 20) ||
      t('interface.address-book.validations.nickname-length')
  ];
});
const validAddress = computed(() => {
  if (addressToAdd.value.length > 94) return false;
  return resolvedAddr.value.length > 0 && !resolvedAddr.value?.includes('.')
    ? isAddress(resolvedAddr.value) ||
        isValidCoinAddress(resolvedAddr.value).valid
    : isAddress(lowercaseAddressToAdd.value) ||
        isValidCoinAddress(lowercaseAddressToAdd.value).valid ||
        isValidCoinAddress(addressToAdd.value).valid;
});
const coin = computed(() => {
  if (!validAddress.value) return '';
  return `Valid ${coinType.value} address`;
});
const coinType = computed(() => {
  return resolvedAddr.value.length > 0 && !resolvedAddr.value?.includes('.')
    ? isValidCoinAddress(resolvedAddr.value).coin
    : isValidCoinAddress(lowercaseAddressToAdd.value).coin ||
        isValidCoinAddress(addressToAdd.value).coin;
});
const editMode = computed(() => {
  return props.mode === modes[1];
});
const addMode = computed(() => {
  return props.mode === modes[0];
});
const alreadyExists = computed(() => {
  if (addMode.value) {
    return checkResolvedExists.value || checkAddressExists.value;
  }
  return false;
});
const checkResolvedExists = computed(() => {
  return Object.keys(addressBookStore).some(key => {
    const storedAddr = addressBookStore[key];
    return (
      resolvedAddr.value !== '' &&
      (storedAddr.address.toLowerCase() === resolvedAddr.value?.toLowerCase() ||
        storedAddr.resolvedAddr.toLowerCase() ===
          resolvedAddr.value?.toLowerCase())
    );
  });
});
const checkAddressExists = computed(() => {
  return Object.keys(addressBookStore).some(key => {
    const storedAddr = addressBookStore[key];
    return (
      (storedAddr.resolvedAddr !== '' &&
        storedAddr.resolvedAddr?.toLowerCase() ===
          addressToAdd.value?.toLowerCase()) ||
      storedAddr.address.toLowerCase() === addressToAdd.value?.toLowerCase()
    );
  });
});
const checksumAddressToAdd = computed(() => {
  if (addressToAdd.value !== '' && isAddress(lowercaseAddressToAdd.value)) {
    return toChecksumAddress(lowercaseAddressToAdd.value);
  }
  return addressToAdd.value;
});
const lowercaseAddressToAdd = computed(() => {
  return addressToAdd.value.toLowerCase();
});
const resolvedAddress = computed(() => {
  if (resolvedAddr.value.length === 0) return '';
  return validAddress.value && !resolvedAddr.value?.includes('.')
    ? resolvedAddr.value
    : '';
});
const resolvedName = computed(() => {
  if (resolvedAddr.value.length === 0) return '';
  return validAddress.value && resolvedAddr.value?.includes('.')
    ? resolvedAddr.value
    : '';
});

// watch
watch(
  () => props.toAddress,
  newVal => {
    addressToAdd.value = newVal;
  }
);
watch(
  () => addressToAdd,
  newVal => {
    nametag.value = '';
    if (isAddress(newVal.toLowerCase())) {
      resolveAddress();
    } else {
      resolveName();
    }
  }
);
watch(
  () => web3,
  () => {
    if (network.type.ens) {
      nameResolver.value = new NameResolver(network, web3);
    } else {
      nameResolver.value = null;
    }
  }
);

// mounted
onMounted(() => {
  if (network.type.ens) nameResolver.value = new NameResolver(network, web3);
  if (addMode.value && props.toAddress) {
    addressToAdd.value = props.toAddress;
  }
  if (editMode.value) {
    addressToAdd.value = props.item.address;
    nickname.value = props.item.nickname;
    currentIdx.value = addressBookStore.findIndex(
      item => item.address === item.address
    );
  }
});

// methods
const reset = () => {
  addressToAdd.value = '';
  nickname.value = '';
  resolvedAddr.value = '';
  nametag.value = '';
};
/**
 * Resolves address and @returns name
 */
const resolveAddress = throttle(async function () {
  if (nameResolver.value) {
    try {
      const resolvedName = await nameResolver.value.resolveAddress(
        addressToAdd
      );
      if (resolvedName && !resolvedName.name) {
        await getAddressInfo(
          checksumAddressToAdd.value,
          'https://ipfs.kleros.io'
        ).then(data => {
          nametag.value = data?.publicNameTag || '';
        });
      }
      resolvedAddr.value = resolvedName.name ? resolvedName.name : '';
    } catch (e) {
      nametag.value = '';
      resolvedAddr.value = '';
    }
  }
}, 300);
/**
 * Resolves name and @returns address
 */
const resolveName = throttle(async function () {
  if (nameResolver.value) {
    try {
      await nameResolver.value.resolveName(addressToAdd.value).then(addr => {
        resolvedAddr.value = addr;
      });
    } catch (e) {
      resolvedAddr.value = '';
    }
  }
}, 500);
const setAddress = value => {
  addressToAdd.value = value ? value : '';
};
const setNickname = value => {
  nickname.value = value;
};
const update = () => {
  addressBookStore[currentIdx].address = checksumAddressToAdd.value;
  addressBookStore[currentIdx].coinType = coinType.value.toLowerCase();
  addressBookStore[currentIdx].nickname = nickname.value;
  setAddressBook(addressBookStore);
  emit('back', [3]);
};
const remove = () => {
  addressBookStore.splice(currentIdx, 1);
  setAddressBook(addressBookStore);
  reset();
  emit('back', [3]);
};
const add = () => {
  if (alreadyExists.value) {
    reset();
    return;
  }
  addressBookStore.push({
    address: checksumAddressToAdd.value,
    resolvedAddr: resolvedAddress.value,
    coinType: coinType.value.toLowerCase(),
    nickname: nickname.value || (addressBookStore.length + 1).toString()
  });
  setAddressBook(addressBookStore);
  reset();
  emit('back', [3]);
};
</script>
