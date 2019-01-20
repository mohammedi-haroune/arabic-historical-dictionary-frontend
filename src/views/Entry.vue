<template>
  <new-entry></new-entry>
</template>

<script>
import NewEntry from "../components/NewEntry";
export default {
  name: "Entry",
  components: { NewEntry }
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.my-input.v-input .v-input__slot {
  border-radius: 50px;
}
</style>