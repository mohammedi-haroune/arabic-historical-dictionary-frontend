<template>
  <v-card class="mt-3 mx-auto" max-width="400">
    <v-sheet
      class="v-sheet--offset ml-5"
      color="orange"
      elevation="2"
      width="calc(1.2*100px)"
      height="calc(1.2*80px)"
    >
      <v-container fill-height>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-icon dark size="50px">mdi-chart</v-icon>
          </v-flex>
        </v-layout>
      </v-container>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">{{this.title}}</div>
      <div class="subheading font-weight-light grey--text">Last Campaign Performance</div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>mdi-clock</v-icon>
      <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "StatCard",
  props: {
    title: String,
    stat: Number
  },
  data() {
    return {
      labels: ["A", "B", "C"],
      series: [[1, 3, 2], [4, 6, 5]],
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
    };
  }
};
</script>


<style>
.v-sheet--offset {
  top: -24px;
  right: 65%;
  position: relative;
}
.v-sheet {
  border-radius: 5px;
}
</style>
