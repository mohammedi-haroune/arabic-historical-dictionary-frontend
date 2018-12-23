<template>
  <v-layout>
    <v-flex text-xs-center>
     <v-text-field
        label="Term Search"
        placeholder="Start typing to Search"
        prepend-icon="search"
        v-model="term"
        @input="updateResults"
      ></v-text-field>

      <v-data-table
        :headers="headers"
        :items="results"
        hide-actions
        expand
      >
        <template slot="items" slot-scope="{ item }">
          <td>{{ item.fileid }}</td>
          <td class="text-xs-right">{{ item.freq }}</td>
          <td class="text-xs-right">{{ item.tf_idf }}</td>

          <td>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" @click.stop="preview(item.fileid)" color="success" flat>Preview</v-btn>
            </v-dialog>
          </td>
        </template>

        <template slot="no-data">
          <v-alert :value="true" icon="warning">
            Sorry, nothing to display here :(
          </v-alert>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import $backend from '../backend'
export default {
  data () {
    return {
      term: 'information',
      dialog: false,
      previewing: {},
      headers: [
        {
          text: 'Document',
          align: 'left',
          sortable: false,
          value: 'fileid'
        },
        { text: 'Frequency', value: 'freq', align: 'right' },
        { text: 'TF_IDF', value: 'tf_idf', align: 'right' },
        { text: 'Preview', value: 'fielid', sortable: false, align: 'center' }
      ],
      results: []
    }
  },
  mounted () {
    this.updateResults()
  },
  methods: {
    async updateResults () {
      this.results = await $backend.$find(this.term)
    },
    async preview (fileid) {
      const docs = await $backend.$fetchDocuments()
      this.previewing = docs.find(d => {
        return d.fileid === fileid
      })
      this.dialog = true
    }
  }
}
</script>
