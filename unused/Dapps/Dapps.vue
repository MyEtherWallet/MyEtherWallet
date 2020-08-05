<template>
  <mew6-white-sheet>
    <div class="px-8 py-5">
      <div class="d-flex align-center">
        <block-title text="Dapps">
          <template v-slot:right-button>
            <text-button>View All</text-button>
          </template>
        </block-title>
      </div>
      <div>
        <dapps-block />
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
import BlockTitle from '@/components/BlockTitles/BlockTitle';
import TextButton from '@/components/Buttons/TextButton1';
import DappsBlock from '@/components/DappsBlock';

export default {
  components: {
    'block-title': BlockTitle,
    'text-button': TextButton,
    'dapps-block': DappsBlock
  },
  data() {
    return {};
  }
};
</script>
