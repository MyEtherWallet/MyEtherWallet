<template>
  <main>
    <label>Enter Password</label>
    <br />
    <input type="text" style="border: 1px solid black" />
    <br />
    <button @click="enterPassword">Submit</button>
  </main>
</template>

<script setup lang="ts">
const enterPassword = () => {
  console.log('AAAAAAAA aaaaa')
}
</script>
