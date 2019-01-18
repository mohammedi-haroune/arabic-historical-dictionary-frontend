<template>
  <v-card class="mx-auto my-5" height="200">
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
      <!--
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>mdi-clock</v-icon>
      <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
      -->
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  name: "StatCard",
  props: {
    title: String,
    color: String,
    icon: String,
    stats: String
  },
  data() {
    return {};
  }
};
</script>


<style>
.v-sheet--offset {
  top: -40px;
  right: 250%;
  position: relative;
}
.v-sheet {
  border-radius: 8px;
}
</style>
