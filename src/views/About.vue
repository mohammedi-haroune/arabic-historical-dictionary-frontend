<template>
  <v-container row fluid>
    <h1>Environment variables</h1>
    <h2> {{ this.process.env }} </h2>
    <h2> VEU_APP_TAHAR : {{ tahar }} </h2>
    <h3 v-for="(env, i) in process.env" :key="i">
      {{ env  }}
    </h3>
  </v-container>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      process: process,
      tahar: process.env
    }
  }
}
</script>
