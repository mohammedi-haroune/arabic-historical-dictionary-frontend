<template>
  <v-layout>
    <v-flex>
      <v-bottom-sheet v-model="showing" inset>
        <v-btn
          slot="activator"
          color="red"
          dark
        >
          Show player
        </v-btn>

        <v-card tile>
          <v-progress-linear
            :value="50"
            class="my-0"
            height="3"
          ></v-progress-linear>

          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>The Walker</v-list-tile-title>
                <v-list-tile-sub-title>Fitz & The Trantrums</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-spacer></v-spacer>

              <v-list-tile-action>
                <v-btn icon>
                  <v-icon>fast_rewind</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
                <v-btn icon>
                  <v-icon>pause</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
                <v-btn icon>
                  <v-icon>fast_forward</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-bottom-sheet>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'PromotedActions',
  data () {
    return {
      showing: false,
      clicked: 0,
      tiles: [
        { img: 'keep.png', title: 'Keep' },
        { img: 'inbox.png', title: 'Inbox' },
        { img: 'hangouts.png', title: 'Hangouts' },
        { img: 'messenger.png', title: 'Messenger' },
        { img: 'google.png', title: 'Google+' }
      ],
      selecting: ''
    }
  },
  mounted () {
    const self = this
    document.onmouseup = document.onkeyup = document.onselectionchange = function () {
      let text = ''
      if (window.getSelection) {
        text = window.getSelection().toString()
      } else if (document.selection && document.selection.type != 'Control') {
        text = document.selection.createRange().text
      }
      self.selecting = text
      const empty = text.trim() === ''
      self.showing = !empty
      return text
    }
  }
}
</script>

<style scoped>

</style>
