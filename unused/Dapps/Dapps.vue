<template>
  <mew6-white-sheet>
    <div class="px-8 py-5">
      <div class="d-flex align-center">
        <BlockTitle text="Dapps">
          <template v-slot:right-button>
            <TextButton>View All</TextButton>
          </template>
        </BlockTitle>
      </div>
      <div>
        <DappsBlock />
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
import BlockTitle from '@/components/BlockTitles/BlockTitle2';
import TextButton from '@/components/Buttons/TextButton1';
import DappsBlock from '@/components/DappsBlock';

export default {
  components: { BlockTitle, TextButton, DappsBlock },
  data() {
    return {};
  }
};
</script>
