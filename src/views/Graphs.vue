<template>
<v-flex>
  <LineChart></LineChart>
  <LineChart></LineChart>
</v-flex>
  
</template>

<script>
  import LineChart from '@/components/LineChart'

  
  var components = {LineChart,LineChart}
  export default {
    name: 'Graphs',
    components: components
  }
</script>

