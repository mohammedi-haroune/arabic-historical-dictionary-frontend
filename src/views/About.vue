<template>
  <v-container row fluid>
    <h1>Environment variables</h1>
    <h2> {{ this.process.env }} </h2>
    <h3 v-for="(k, v) in env" :key="k">
      {{ k + ':'  + v }}
    </h3>
  </v-container>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      env: process.env
    }
  }
}
</script>
