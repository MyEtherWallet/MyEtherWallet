<template>
  <mew6-white-sheet>
    <div class="d-flex align-center px-7 py-7">
      <mew-module
        subtitle="My Tokens Value"
        title="$3,132.25"
        :icon="require('@/assets/images/icons/icon-token-grey.png')"
        icon-align="left"
      />
      <mew-button
        class="ml-auto"
        :has-full-width="false"
        title="All tokens"
        button-size="xsmall"
        btn-style="transparent"
        @click.native="goTo('HomeAccessWallet')"
      />
    </div>
    <mew-table
      has-color
      :table-headers="tableHeaders"
      :table-data="tableData"
    />
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: '24H Changes',
          value: 'changes',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Token Value',
          value: 'value',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: '',
          value: 'btn',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100%'
        }
      ],
      tableData: [
        {
          token: 'XMR',
          price: '$8.23',
          cap: '$1.23B',
          changes: '2.23%',
          value: '$27.54',
          btn: 'Trade'
        },
        {
          token: 'AMIS',
          price: '$23.11',
          cap: '$5.22B',
          changes: '0.43%',
          value: '$27.54',
          btn: 'Trade'
        },
        {
          token: 'JCK',
          price: '$3.65',
          cap: '$0.43B',
          changes: '10.23%',
          value: '$27.54',
          btn: 'Trade'
        },
        {
          token: 'AMN',
          price: '$10.72',
          cap: '0.11B',
          changes: '8.88%',
          value: '$27.54',
          btn: 'Trade'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
