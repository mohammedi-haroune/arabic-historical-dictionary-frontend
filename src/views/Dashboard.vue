<i18n>
  en:
    message:
      word: "Content"
  ar:
    message:
      word: "عدد الكلمات"
      
      
</i18n>


<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md4>
        <StatCard :title="lorem"></StatCard>
      </v-flex>
      <v-flex d-flex xs12 sm6 md4></v-flex>
    </v-layout>
  </v-container>
</template>




<script>
// Vue.use(require('vue-chartist'))
import StatCard from "../components/StatCard";
export default {
  components: { StatCard },
  data() {
    return {
      labels: ["A", "B", "C"],
      series: [[1, 3, 2], [4, 6, 5]],
      lorem: "yes",
      labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      value: [200, 675, 410, 390, 310, 460, 250, 240]
    };
  }
};
</script>

