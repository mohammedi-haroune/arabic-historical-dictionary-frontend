<template>
  <v-card class="mx-auto" max-width="300">
    <v-container grid-list-md text-xs-center>
      <v-layout>
        <v-flex xs2>
          <div :class="'title font-weight-bold '+color+'--text'">{{this.stats}}</div>
        </v-flex>
        <v-flex xs2>
          <v-sheet
            class="v-sheet--offset ml-5"
            :color="color"
            elevation="2"
            width="calc(1.2*100px)"
            height="calc(1.2*80px)"
          >
            <v-container>
              <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                  <v-icon dark size="50px">{{this.icon}}</v-icon>
                </v-flex>
              </v-layout>
            </v-container>
          </v-sheet>
        </v-flex>
      </v-layout>
    </v-container>

    <v-card-text class="pt-1">
      <div class="title font-weight-light mb-2">{{this.title}}</div>

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
    stat: Number,
    color: String,
    icon: String,
    stats: Number
  },
  data() {
    return {
      stats: {
        words: 0,
        wordsAvg: 0,
        types: 0,
        wordsInDico: 0
      },
      labels: ["A", "B", "C"],
      series: [[1, 3, 2], [4, 6, 5]],
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
    };
  }
};
</script>


<style>
.v-sheet--offset {
  top: -40px;
  right: 355%;
  position: relative;
}
.v-sheet {
  border-radius: 5px;
}
</style>
