<template>
  <mew6-white-sheet>
    <div class="d-flex align-center">
      <mew-module
        subtitle="My Tokens Value"
        title="$3,132.25"
        :icon="require('@/assets/images/icons/icon-token-grey.png')"
        icon-align="left"
      >
        <template v-slot:rightHeaderContainer>
          <mew-button
            class="ml-auto"
            :has-full-width="false"
            title="All tokens"
            button-size="xsmall"
            btn-style="transparent"
            @click.native="goTo('HomeAccessWallet')"
          />
        </template>
      </mew-module>
    </div>
    <mew-table
      :has-color="false"
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
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '120px'
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '120px'
        },
        {
          text: 'Token Value',
          value: 'value',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '140px'
        }
      ],
      tableData: [
        {
          token: 'XMR',
          price: '$8.23',
          cap: '$1.23B',
          change: '2.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'AMIS',
          price: '$23.11',
          cap: '$5.22B',
          change: '0.43%',
          status: '-',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'JCK',
          price: '$3.65',
          cap: '$0.43B',
          change: '10.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'AMN',
          price: '$10.72',
          cap: '0.11B',
          change: '8.88%',
          value: '$27.54',
          status: '-',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          callToAction: 'Trade'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
