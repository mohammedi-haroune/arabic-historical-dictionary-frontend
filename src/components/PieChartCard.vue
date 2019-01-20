<template>
  <v-card class="mx-auto">
    <template>
      <PieChart :data="data"></PieChart>
    </template>
    <v-card-text
      :class="'title font-weight-bold mb-2  lighten-1  dark--text text-md-center '"
    >{{this.text}}</v-card-text>
  </v-card>
</template>


<script>
import PieChart from "../components/PieChart";

export default {
  name: "PieChartCard",
  props: {
    data: Object,
    options: Object,
    text: String
  },
  components: {
    PieChart
  }
};
</script>

<style>
.v-card {
  border-radius: 10px;
}
</style>
