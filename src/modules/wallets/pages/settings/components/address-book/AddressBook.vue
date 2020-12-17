<template>
  <div class="pb-4">
    <div class="mb-4">{{ $t('interface.address-book.add-up-to') }}</div>
    <mew-table
      :table-headers="tableHeaders"
      :table-data="tableData"
      has-color
      :success-toast="$t('common.copied')"
      @onClick="onEdit"
    />

    <div class="d-flex justify-center mt-5">
      <mew-button
        :disabled="addressBook.length > 10"
        title="+ Add"
        btn-size="xlarge"
        @click.native="$emit('add')"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {},
  props: {},
  data() {
    return {
      tableHeaders: [
        {
          text: '#',
          value: 'number',
          sortable: false,
          filterable: false,
          width: '5%'
        },
        {
          text: 'Address',
          value: 'address',
          sortable: false,
          filterable: false,
          width: '50%'
        },
        {
          text: 'Nickname',
          value: 'nickname',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '20%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          width: '20%'
        }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapState('wallet', ['addressBook'])
  },
  mounted() {
    this.addressBook.forEach((item, idx) => {
      this.tableData.push({
        number: idx + 1,
        address: item.address,
        nickname: item.nickname,
        resolvedAddr: item.resolvedAddr,
        callToAction: 'Edit'
      });
    });
  },
  methods: {
    onEdit(item) {
      this.$emit('edit', item);
    }
  }
};
</script>
