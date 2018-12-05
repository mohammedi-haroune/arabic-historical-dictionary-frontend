<template>
  <v-layout>
    <document-content :id="$route.params.id"></document-content>
  </v-layout>
</template>

<script>
import DocumentContent from '../components/DocumentContent'
export default {
  name: 'Document',
  components: { DocumentContent }
}
</script>

<style scoped>

</style>
