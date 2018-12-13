<template>
  <v-layout>
    <v-btn @click="addMeaning">
      {{ $t('message.meaning.add') }}
      <v-icon meduim>add</v-icon>
    </v-btn>

    <v-card class="elevation-24">
      <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="1.75"></v-img>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
          <div>Located two hours south of Sydney in the
            <br>Southern Highlands of New South Wales, ...
          </div>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn flat color="orange">Share</v-btn>
        <v-btn flat color="orange">Explore</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
// Vue.use(require('vue-chartist'))
export default {
  data(){
     return {
    labels: ["A", "B", "C"],
    series: [[1, 3, 2], [4, 6, 5]]
  }}
};
</script>

