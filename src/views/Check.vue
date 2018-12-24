<template>
  <v-layout>
    <v-flex text-xs-center>
      <check-history :meaning_id="meaning_id"></check-history>
    </v-flex>
  </v-layout>
</template>

<script>
import CheckHistory from '../components/CheckHistory'
export default {
  components: { CheckHistory },
  data () {
    return {
      meaning_id: 82995
    }
  }
}
</script>
